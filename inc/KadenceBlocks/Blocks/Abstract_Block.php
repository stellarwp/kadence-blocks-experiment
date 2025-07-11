<?php
/**
 * Handles all functionality related to the KBS Blocks.
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Blocks;

use KadenceWP\KadenceBlocks\Frontend\CSS_Engine;
use KadenceWP\KadenceBlocks\Frontend\Font_Engine;
use KadenceWP\KadenceBlocks\Settings\Global_Style;
use KadenceWP\KadenceBlocks\Blocks\Editor_Assets;
use function kbs_get_asset_file;

/**
 * Handles all functionality related to the KBS Blocks..
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */
class Abstract_Block {
	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'kbs';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = '';

	/**
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_editor_style = true;

	/**
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_editor_script = true;

	/**
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;

	/**
	 * Block determines if scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Cache for a blocks attributes with defaults based on uniqueId
	 * Stored as: uniqueId => attributes
	 *
	 * @var array
	 */
	protected $attributes_with_defaults = [];

	/**
	 * Cache for default attributes by block name.
	 * Stored as: blockName => attributes
	 *
	 * @var array
	 */
	protected $default_attributes_cache = [];


	/**
	 * Allow us to enable merged defaults on blocks individually.
	 * Considered setting this as a property within each block, but it's easier to see an exhaustive list here.
	 * Eventually all blocks will be supported.
	 *
	 * @var array
	 */
	protected $is_cpt_block = [
		'navigation',
		'header',
		'advanced-form',
	];

	/**
	 * The global styles instance.
	 *
	 * @var array
	 */
	protected $global_styles = null;

	/**
	 * The CSS engine instance.
	 *
	 * @var CSS_Engine
	 */
	protected CSS_Engine $css_engine;

	/**
	 * The Font engine instance.
	 *
	 * @var Font_Engine
	 */
	protected Font_Engine $font_engine;

	/**
	 * @param Container  $container The container instance.
	 * @param CSS_Engine $css_engine The CSS engine instance.
	 */
	public function __construct( CSS_Engine $css_engine, Font_Engine $font_engine ) {
		$this->css_engine  = $css_engine;
		$this->font_engine = $font_engine;
	}

	/**
	 * On init startup register the block.
	 */
	public function on_init() {
		if ( $this->should_register() ) {
			$block_asset_meta = kbs_get_asset_file( 'dist/kbs-' . $this->block_name );
			$handle           = $this->namespace . '-' . $this->block_name;
			$editor_handle    = $handle . '-editor';
			$args             = [
				'render_callback' => [ $this, 'render_css' ],
			];
			// Register the block.
			if ( $this->has_editor_script ) {
				wp_register_script(
					$editor_handle,
					KADENCE_BLOCKS_URL . 'dist/kbs-' . $this->block_name . '.js',
					$block_asset_meta['dependencies'],
					$block_asset_meta['version'],
					true
				);
				wp_set_script_translations( $editor_handle, 'kadence-blocks' );
				$args['editor_script'] = $editor_handle;
			}
			if ( $this->has_editor_style ) {
				wp_register_style(
					$editor_handle,
					KADENCE_BLOCKS_URL . 'dist/kbs-' . $this->block_name . '.css',
					[],
					$block_asset_meta['version']
				);
				$args['editor_style'] = $editor_handle;
			}
			if ( $this->has_style ) {
				wp_register_style(
					$handle,
					KADENCE_BLOCKS_URL . 'dist/style-kbs-' . $this->block_name . '.css',
					[],
					$block_asset_meta['version']
				);
				$args['style'] = $handle;
			}
			register_block_type(
				KADENCE_BLOCKS_PATH . 'dist/kbs-blocks/' . $this->block_name . '/block.json',
				$args
			);
		}
	}

	/**
	 * Add Class name to list of blocks to render in header.
	 *
	 * @param array $block_class_array the blocks that are registered to be rendered.
	 */
	public function register_blocks_to_generate_post_css( $block_class_array ) {
		if ( $this->should_register() ) {
			if ( ! isset( $block_class_array[ $this->namespace . '/' . $this->block_name ] ) ) {
				$block_class_array[ $this->namespace . '/' . $this->block_name ] = '\KadenceWP\KadenceBlocks\Blocks\KBS\\' . str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $this->block_name ) ) );
			}
		}

		return $block_class_array;
	}

	/**
	 * Check if block stylesheet should render inline.
	 *
	 * @param string $name the stylesheet name.
	 */
	public function should_render_inline_stylesheet( $name ) {
		if ( apply_filters( 'kadence_blocks_force_render_inline_stylesheet', false, $name ) || ( ! is_admin() && ! wp_style_is( $name, 'done' ) && ! is_feed() ) ) {
			if ( function_exists( 'wp_is_block_theme' ) ) {
				if ( ! doing_filter( 'the_content' ) && ! wp_is_block_theme() && 1 === did_action( 'wp_head' ) ) {
					wp_print_styles( $name );
				}
			} elseif ( ! doing_filter( 'the_content' ) && 1 === did_action( 'wp_head' ) ) {
				wp_print_styles( $name );
			}
		}
	}

	/**
	 * Render styles in the footer.
	 *
	 * @param string $name the stylesheet name.
	 */
	public function render_styles_footer( $name, $css ) {
		if ( ! is_admin() && ! wp_style_is( $name, 'done' ) && ! is_feed() ) {
			wp_register_style( $name, false, [], false );
			wp_add_inline_style( $name, $css );
			wp_enqueue_style( $name );
		}
	}

	/**
	 * Check if block should render inline.
	 *
	 * @param string $name the blocks name.
	 * @param string $unique_id the blocks unique id.
	 */
	public function should_render_inline( $name, $unique_id ) {
		if ( ( doing_filter( 'the_content' ) && ! is_feed() ) || apply_filters( 'kadence_blocks_force_render_inline_css_in_content', false, $name, $unique_id ) || is_customize_preview() ) {
			return true;
		}

		return false;
	}

	/**
	 * Process fonts for a block and add them to the font engine
	 *
	 * @param array         $attributes Block attributes
	 * @param WP_Block|null $block_instance The block instance
	 * @return void
	 */
	protected function process_fonts( $attributes, $block_instance ) {
		if ( empty( $attributes ) || ! is_array( $attributes ) ) {
			return;
		}

		// Get block attributes meta from instance if available
		$attributes_meta = [];
		if ( is_object( $block_instance ) && isset( $block_instance->attributes ) ) {
			$attributes_meta = $block_instance->attributes;
		}

		// Process fonts through the font engine
		$this->font_engine->process_block_fonts( $attributes, $attributes_meta );
	}

	/**
	 * Render Block CSS in Page Head.
	 *
	 * @param array    $block the block data.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function output_head_data( $block, $block_instance ) {
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( in_array( $this->block_name, $this->is_cpt_block ) ) {
				$unique_id = ! empty( $attributes['id'] ) ? strval( $attributes['id'] ) . '-cpt-id' : '';
				if ( empty( $unique_id ) ) {
					$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
				}
			} else {
				$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
			}
			if ( ! empty( $unique_id ) ) {
				$unique_id = str_replace( '/', '-', $unique_id );
				// Check and enqueue stylesheets and scripts if needed.
				$this->render_scripts( $attributes, false );

				// Process and enqueue fonts
				$this->process_fonts( $attributes, $block_instance );

				if ( ! $this->css_engine->has_styles( 'kb-' . $this->block_name . $unique_id ) && apply_filters( 'kadence_blocks_render_head_css', true, $this->block_name, $attributes ) ) {
					// Filter attributes for easier dynamic css.
					$attributes = apply_filters( 'kadence_blocks_' . $this->block_name . '_render_block_attributes', $attributes );
					$this->build_css( $attributes, $this->css_engine, $unique_id, $unique_id, $block_instance );
				}
			}
		}
	}

	/**
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		$handle = $this->namespace . '-' . $this->block_name;
		if ( $this->has_style ) {
			if ( ! wp_style_is( $handle, 'enqueued' ) ) {
				$this->enqueue_style( $handle );
				if ( $inline ) {
					$this->should_render_inline_stylesheet( $handle );
				}
			}
		}
		if ( $this->has_script ) {
			if ( ! wp_script_is( $handle, 'enqueued' ) ) {
				$this->enqueue_script( $handle );
			}
		}
	}
	/**
	 * Render Block CSS
	 *
	 * @param array    $attributes the blocks attribtues.
	 * @param string   $content the blocks content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function render_css( $attributes, $content, $block_instance ) {
		$this->render_scripts( $attributes, true );

		// Process and enqueue fonts
		$this->process_fonts( $attributes, $block_instance );

		if ( in_array( $this->block_name, $this->is_cpt_block ) ) {
			$unique_id = ! empty( $attributes['id'] ) ? strval( $attributes['id'] ) . '-cpt-id' : '';
			if ( empty( $unique_id ) ) {
				$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
			}
		} else {
			$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
		}
		if ( ! empty( $unique_id ) ) {
			$unique_id       = str_replace( '/', '-', $unique_id );
			$unique_style_id = apply_filters( 'kadence_blocks_build_render_unique_id', $unique_id, $this->block_name, $attributes );

			// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
			$attributes = apply_filters( 'kadence_blocks_' . str_replace( '-', '_', $this->block_name ) . '_render_block_attributes', $attributes, $block_instance );

			$content = $this->build_html( $attributes, $unique_id, $content, $block_instance );
			if ( ! $this->css_engine->has_styles( 'kb-' . $this->block_name . $unique_style_id ) && ! is_feed() && apply_filters( 'kadence_blocks_render_inline_css', true, $this->block_name, $unique_id ) ) {
				$css = $this->build_css( $attributes, $this->css_engine, $unique_id, $unique_style_id, $block_instance );
				if ( ! empty( $css ) && ! wp_is_block_theme() ) {
					$this->do_inline_styles( $content, $unique_style_id, $css );
				}
			} elseif ( ! wp_is_block_theme() && ! $this->css_engine->has_header_styles( 'kb-' . $this->block_name . $unique_style_id ) && ! is_feed() && apply_filters( 'kadence_blocks_render_inline_css', true, $this->block_name, $unique_id ) ) {
				// Some plugins run render block without outputing the content, this makes it so css can be rebuilt.
				$css = $this->build_css( $attributes, $this->css_engine, $unique_id, $unique_style_id, $block_instance );
				if ( ! empty( $css ) ) {
					$this->do_inline_styles( $content, $unique_style_id, $css );
				}
			}
		}

		return $content;
	}

	/**
	 * Potentially prepend inline style to the content, unless it needs to get moved off to the footer.
	 *
	 * @param string $content the blocks content.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 * @param string $css the css class for blocks.
	 */
	public function do_inline_styles( &$content, $unique_style_id, $css ) {
		if ( apply_filters( 'kadence_blocks_render_styles_footer', $this->block_name == 'data' || $this->block_name == 'slide' ) ) {
			$this->render_styles_footer( 'kb-' . $this->block_name . $unique_style_id, $css );
		} else {
			$content = '<style>' . $css . '</style>' . $content;
		}
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array    $attributes the blocks attributes.
	 * @param string   $css the css class for blocks.
	 * @param string   $unique_id the blocks attr ID.
	 * @param string   $unique_style_id the blocks alternate ID for queries.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id, $block_instance ) {
		return '';
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param array    $attributes the blocks attributes.
	 * @param string   $unique_id the blocks attr ID.
	 * @param string   $content the blocks content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		return $content;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts( $handle ) {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_style( $handle, KADENCE_BLOCKS_URL . 'dist/style-kbs-' . $this->block_name . '.css', [], KADENCE_BLOCKS_VERSION );
	}

	/**
	 * Registers and enqueue's script.
	 *
	 * @param string $handle the handle for the script.
	 */
	public function enqueue_script( $handle ) {
		if ( ! wp_script_is( $handle, 'registered' ) ) {
			$this->register_scripts( $handle );
		}
		wp_enqueue_script( $handle );
	}

	/**
	 * Registers and enqueue's styles.
	 *
	 * @param string $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts( $handle );
		}
		wp_enqueue_style( $handle );
	}

	/**
	 * Get this blocks preset, defaults to the block preset.
	 *
	 * @param string $cache_key The cache key (usually unique id).
	 * @param array  $attributes The block's attributes.
	 * @param string $block_name The name of the block.
	 * @return array
	 */
	public function get_global_preset( $cache_key, $attributes, $cache = true ) {
		if ( ! empty( $this->attributes_with_defaults[ $cache_key ] ) ) {
			return $this->attributes_with_defaults[ $cache_key ];
		}

		$default_attributes = $this->get_block_default_attributes();

		if ( $cache ) {
			$this->attributes_with_defaults[ $cache_key ] = $merged_attributes;
		}
		return $merged_attributes;
	}

	/**
	 * Get default attributes for a block.
	 *
	 * @return array
	 */
	protected function get_block_default_attributes() {
		$block_name = 'kadence/' . $this->block_name;
		if ( ! isset( $this->default_attributes_cache[ $block_name ] ) ) {
			$registry           = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
			$default_attributes = [];

			if ( $registry && property_exists( $registry, 'attributes' ) && ! empty( $registry->attributes ) ) {
				foreach ( $registry->attributes as $key => $value ) {
					if ( isset( $value['default'] ) ) {
						$default_attributes[ $key ] = $value['default'];
					}
				}
			}

			$this->default_attributes_cache[ $block_name ] = $default_attributes;
		}

		return $this->default_attributes_cache[ $block_name ];
	}

	/**
	 * Get an initial attribute from the block instance.
	 *
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @param string   $attribute_name The name of the attribute to get.
	 * @param string   $default The default value to return if the attribute is not found.
	 * @return string
	 */
	public function get_initial_attribute( $block_instance, $attribute_name, $default ) {
		if ( is_object( $block_instance ) && isset( $block_instance->block_type->attributes ) ) {
			$attributes = $block_instance->block_type->attributes;
			if ( isset( $attributes[ $attribute_name ]['initial'] ) && $attributes[ $attribute_name ]['initial'] ) {
				return $attributes[ $attribute_name ]['initial'];
			}
		}
		return $default;
	}

	/**
	 * Add Custom CSS for block.
	 *
	 * @param object $css the css class for blocks.
	 * @param array  $attributes the blocks attributes.
	 * @param string $root_selector the selector for the block.
	 */
	public function add_custom_css( $css, $attributes, $root_selector ) {
		if ( ! empty( $attributes['kbsCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', $root_selector, $attributes['kbsCSS'] ) );
		}
		return $css;
	}
	/**
	 * Gets the HTML tag from the attributes.
	 * If the tag provided isn't allowed, return the default value.
	 *
	 * @param array  $attributes Array of the blocks attributes.
	 * @param string $tag_key Offest on $attributes where the tag is set.
	 * @param string $initial Default tag to use if $tag_key attribue is undefined or invalid.
	 * @param array  $allowed_tags Array of allowed tags.
	 *
	 * @return string
	 */
	public function get_html_tag( $attributes, $tag_key, $initial, $allowed_tags = [] ) {

		if ( ! empty( $attributes[ $tag_key ] ) && in_array( $attributes[ $tag_key ], $allowed_tags ) ) {

			return $attributes[ $tag_key ];
		}

		return $initial;
	}
	/**
	 * Retuurn if this block should register itself. (can override for things like blocks in two plugins)
	 *
	 * @return boolean
	 */
	public function should_register() {
		return true;
	}

	/**
	 * Get the current blocks pro version. Useful for mocking in tests that rely the on KBP_VERSION constant.
	 *
	 * @return string|null
	 */
	protected function get_pro_version() {
		return defined( 'KBP_VERSION' ) ? KBP_VERSION : null;
	}

	/**
	 * Get the global style classes for a block.
	 *
	 * @param array $attributes The blocks attributes.
	 * @return array
	 */
	protected function get_global_style_classes( $attributes ) {
		$generated_classes = [];
		if ( ! empty( $attributes['globalStyleIds'] ) && is_array( $attributes['globalStyleIds'] ) ) {
			foreach ( $attributes['globalStyleIds'] as $global_style_id ) {
				$generated_classes[] = 'kbs-global-style-' . (string) $global_style_id;
			}
		}
		return $generated_classes;
	}

	/**
	 * Get the preset style classes for a block.
	 *
	 * @param array $attributes The blocks attributes.
	 * @return array
	 */
	protected function get_preset_style_classes( $attributes ) {
		$classes = [];
		if ( ! empty( $attributes ) && is_array( $attributes ) ) {
			foreach ( $attributes as $key => $sub_attributes ) {
				if ( ! empty( $sub_attributes['preset'] ) ) {
					$classes[] = $sub_attributes['preset'];
				}
			}
		}
		return $classes;
	}
	/**
	 * Get the global styles ids.
	 *
	 * @param array    $attributes The attributes of the block.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return array
	 */
	public function get_global_styles_ids( $attributes, $block_instance ) {
		$parent_global_styles_ids = [];
		if ( is_object( $block_instance ) && ! empty( $block_instance->context['kbs/parentGlobalStyles'] ) && is_array( $block_instance->context['kbs/parentGlobalStyles'] ) ) {
			$parent_global_styles_ids = $block_instance->context['kbs/parentGlobalStyles'];
		}
		$current_global_styles_ids = [];
		if ( ! empty( $attributes['globalStyleIds'] ) && is_array( $attributes['globalStyleIds'] ) ) {
			$current_global_styles_ids = $attributes['globalStyleIds'];
		}
		return array_merge( $parent_global_styles_ids, $current_global_styles_ids, [ 'kbs-base' ] );
	}
	/**
	 * Get the preset layers.
	 *
	 * @param string $layers_preset The preset layers.
	 * @param string $component The component.
	 * @param array  $global_styles_ids Global style IDs.
	 * @return array
	 */
	public function get_preset_layers( $layers_preset, $component, $global_styles_ids ) {
		$preset_data = $this->get_preset_data( $layers_preset, $component, $global_styles_ids );
		if ( empty( $preset_data ) ) {
			return [];
		}
		$layers = ! empty( $preset_data['attributes']['layers'] ) ? $preset_data['attributes']['layers'] : [];
		if ( ! empty( $layers ) ) {
			// Reverse the layers so we process the first layer last.
			return array_reverse( $layers );
		}
		return [];
	}
	/**
	 * Get the background layers for a block.
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $attributes The blocks attributes.
	 * @param string   $component The component.
	 * @param WP_Block $block_instance The block instance.
	 * @return array
	 */
	public function get_background_layers( $attribute_name, $attributes, $component, $block_instance ) {
		$global_styles_ids = $this->get_global_styles_ids( $attributes, $block_instance );
		$layers_preset     = ! empty( $attributes[ $attribute_name ]['preset'] ) ? $attributes[ $attribute_name ]['preset'] : '';
		
		if ( ! empty( $layers_preset ) ) {
			return $this->get_preset_layers( $layers_preset, $component, $global_styles_ids );
		}
		
		// Get layers.
		$layers = ! empty( $attributes[ $attribute_name ]['layers'] ) ? $attributes[ $attribute_name ]['layers'] : [];
		if ( ! empty( $layers ) ) {
			// Reverse the layers so we process the first layer last.
			return array_reverse( $layers );
		}
		return [];
	}
	/**
	 * Get the background html for a block.
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $attributes The blocks attributes.
	 * @param WP_Block $block_instance The block instance.
	 * @return array
	 */ 
	public function get_background_html( $attribute_name, $attributes, $block_instance ) {
		$bg_html           = '';
		$background_layers = $this->get_background_layers( $attribute_name, $attributes, 'background', $block_instance );
		if ( ! empty( $background_layers ) ) {
			// If using preset and preset placeholder mode, just output html placeholder.
			if ( ! empty( $attributes[ $attribute_name ]['preset'] ) && apply_filters( 'kbs_use_preset_placeholder', false ) ) {
				return '<div class="kbs-bg-placeholder-' . $attributes[ $attribute_name ]['preset'] . '"></div>';
			}
			$attributes_meta   = $this->get_attribute_meta( $block_instance, $attribute_name );
			$meta_class_prefix = $attributes_meta['classPrefix'] ?? 'kbs-bg-style-';
			foreach ( $background_layers as $index => $layer ) {
				$bg_type     = ! empty( $layer['desktop']['type'] ) ? $layer['desktop']['type'] : '';
				$has_effects = false;
				if ( $index === 0 ) {
					if ( $this->has_layer_value( $layer, 'opacity', '100%' ) || $this->has_layer_value( $layer, 'opacityHover', '100%' ) || $this->has_layer_value( $layer, 'blendMode', 'normal' ) || $this->has_layer_value( $layer, 'blendModeHover', 'normal' ) || apply_filters( 'kbs_always_use_bg_layers', false ) ) {
						$has_effects = true;
					}
				}
				if ( $index === 0 && 'video' !== $bg_type && 'mask' !== $bg_type && ! $has_effects ) {
					continue;
				}
				$bg_html .= '<div class="kbs-bg-layer ' . $meta_class_prefix . $index . ' bg-type-' . $bg_type . '">';
				if ( 'video' === $bg_type ) {
					$video_type = ! empty( $layer['desktop']['videoType'] ) ? $layer['desktop']['videoType'] : 'local';
					if ( 'local' === $video_type && ! empty( $layer['desktop']['video'] ) ) {
						$video_args            = [
							'class'       => 'kbs-bg-video',
							'src'         => $layer['desktop']['video'],
							'autoplay'    => true,
							'muted'       => true,
							'loop'        => 'false',
							'playsinline' => true,
						];
						$video_args            = apply_filters( 'kbs_bg_video_args', $video_args, $attributes, $this->block_name, $unique_id, $block_instance );
						$video_html_attributes = [];
						foreach ( $video_args as $key => $value ) {
							if ( empty( $value ) || true === $value ) {
								$video_html_attributes[] = $key;
							} else {
								$video_html_attributes[] = $key . '="' . esc_attr( $value ) . '"';
							}
						}
						$bg_html .= '<div class="kbs-bg-video-wrapper"><video ' . implode( ' ', $video_html_attributes ) . '></video></div>';
					} elseif ( 'youtube' === $video_type && ! empty( $layer['desktop']['youtube'] ) ) {
						$bg_html .= '<video class="kbs-bg-video" src="' . $layer['desktop']['youtube'] . '" autoplay muted loop playsinline></video>';
					} elseif ( 'vimeo' === $video_type && ! empty( $layer['desktop']['vimeo'] ) ) {
						$bg_html .= '<video src="' . $layer['desktop']['vimeo'] . '" autoplay muted loop playsinline></video>';
					}
				}
				if ( 'mask' === $bg_type ) {
					$mask_type = ! empty( $layer['desktop']['maskType'] ) ? $layer['desktop']['maskType'] : 'mask';
					$divider_position = ! empty( $layer['desktop']['dividerPosition'] ) ? $layer['desktop']['dividerPosition'] : 'bottom';
					switch ( $mask_type ) {
						case 'pattern':
							$bg_html .= '<div class="kbs-pattern-mask-svg kbs-pattern-svg"></div>';
							break;
						case 'divider':
							$bg_html .= '<div class="kbs-divider-svg-wrapper kbs-divider-position-' . $divider_position . '"><div class="kbs-divider-svg"></div></div>';
							break;
						default:
							$bg_html .= '<div class="kbs-pattern-mask-svg kbs-mask-svg"></div>';
							break;
					}
				}
				$bg_html .= '</div>';
			}
		}
		return $bg_html;
	}

	/**
	 * Check if the layer has a value.
	 *
	 * @param array  $layer The layer data.
	 * @param string $attribute_name The attribute name.
	 * @return bool
	 */
	public function has_layer_value( $layer, $attribute_name, $default_value = '' ) {
		if ( empty( $layer ) || ! is_array( $layer ) ) {
			return false;
		}
		$device_options = Editor_Assets::get_responsive_device_options();
		foreach ( $device_options as $device_option ) {
			if ( isset( $layer[ $device_option['key'] ][ $attribute_name ] ) && '' !== $layer[ $device_option['key'] ][ $attribute_name ] && $default_value !== $layer[ $device_option['key'] ][ $attribute_name ] ) {
				return true;
				break;
			}
		}
		return false;
	}
	/**
	 * Get global styles.
	 */
	public function get_global_styles() {
		$global_style_data = Global_Style::get_global_styles();
		if ( ! $global_style_data ) {
			return [];
		}

		return $global_style_data;
	}
	/**
	 * Get preset data.
	 *
	 * @param string $preset_key The preset key.
	 * @param array  $global_styles_ids Global style IDs.
	 * @return array
	 */
	public function get_preset_data( $preset_key, $component, $global_styles_ids ) {
		if ( null === $this->global_styles ) {
			$this->global_styles = $this->get_global_styles();
		}
		// We use the order of the global styles ids to get the first defined preset. If the global ID doesn't have a defined preset we move to the next.
		foreach ( $global_styles_ids as $global_style_id ) {
			if ( ! empty( $this->global_styles[ $global_style_id ]['components'][ $component ]['presets'] ) && is_array( $this->global_styles[ $global_style_id ]['components'][ $component ]['presets'] ) ) {
				foreach ( $this->global_styles[ $global_style_id ]['components'][ $component ]['presets'] as $preset_item_key => $preset_data ) {
					if ( $preset_key === $preset_item_key ) {
						return $preset_data;
						break;
					}
				}
			}
		}
	}
	/**
	 * Get the attribute meta from the block instance.
	 *
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @param string   $attribute_name The name of the attribute to get.
	 * @return array
	 */
	public function get_attribute_meta( $block_instance, $attribute_name ) {
		if ( is_object( $block_instance ) && isset( $block_instance->block_type->attributes[ $attribute_name ] ) ) {
			return $block_instance->block_type->attributes[ $attribute_name ];
		}
		return [];
	}
}
