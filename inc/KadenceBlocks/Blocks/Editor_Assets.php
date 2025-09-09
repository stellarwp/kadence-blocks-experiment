<?php
/**
 * Handles all functionality related to the A/B Testing Block
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Blocks;

use KadenceWP\KadenceBlocks\Settings\Global_Style;
use KadenceWP\KadenceBlocks\Settings\Global_Styles_Manager;
use KadenceWP\KadenceBlocks\Settings\Global_Style_Item;
use KadenceWP\KadenceBlocks\Frontend\CSS_Engine;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function kbs_is_ai_disabled;
use function kbs_get_asset_file;
/**
 * Handles all functionality related to the A/B Testing Block.
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */
class Editor_Assets {
	/**
	 * Google fonts array.
	 *
	 * @var array
	 */
	public static $google_fonts = null;

	/**
	 * The CSS Engine instance.
	 *
	 * @var CSS_Engine
	 */
	public $css = null;

	/**
	 * Constructor
	 *
	 * @param CSS_Engine $css_engine The CSS Engine instance.
	 */
	public function __construct( CSS_Engine $css_engine ) {
		$this->css = $css_engine;
	}
	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 1.0.0
	 */
	public function on_init_editor_assets() {
		// If in the frontend, bail out.
		if ( ! is_admin() ) {
			return;
		}
		// Icons Scripts & Styles.
		$kadence_icons_meta = kbs_get_asset_file( 'dist/icons' );
		wp_register_script( 'kadence-icons', KADENCE_BLOCKS_URL . 'dist/icons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-icons', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/helpers' );
		wp_register_script( 'kadence-helpers', KADENCE_BLOCKS_URL . 'dist/helpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-helpers', 'kadence-blocks' );

		$kadence_base = kbs_get_asset_file( 'dist/extension-kadence-base' );
		wp_register_script( 'kadence-blocks-js', KADENCE_BLOCKS_URL . 'dist/extension-kadence-base.js', array_merge( $kadence_base['dependencies'], [ 'wp-api' ] ), $kadence_base['version'], true );
		// // Block CSS Scripts & Styles.
		$kadence_stores_meta = kbs_get_asset_file( 'dist/extension-stores' );
		wp_register_script( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension-stores.js', array_merge( $kadence_stores_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_stores_meta['version'], true );
		wp_register_style( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension/stores.css', [ 'wp-edit-blocks' ], $kadence_stores_meta['version'] );
		wp_set_script_translations( 'kadence-extension-stores', 'kadence-blocks' );

		// Global Styles Store.
		$kadence_global_styles_meta = kbs_get_asset_file( 'dist/extension-global-styles-store' );
		wp_register_script( 'kadence-extension-global-styles-store', KADENCE_BLOCKS_URL . 'dist/extension-global-styles-store.js', array_merge( $kadence_global_styles_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js', 'kadence-extension-stores' ] ), $kadence_global_styles_meta['version'], true );
		wp_set_script_translations( 'kadence-extension-global-styles-store', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/components' );
		wp_register_script( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js', 'kadence-extension-global-styles-store' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-components', 'kadence-blocks' );

		// Block CSS Scripts & Styles.
		$kadence_block_css_meta = kbs_get_asset_file( 'dist/extension-block-css' );
		wp_register_script( 'kadence-extension-block-css', KADENCE_BLOCKS_URL . 'dist/extension-block-css.js', array_merge( $kadence_block_css_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_block_css_meta['version'], true );
		wp_set_script_translations( 'kadence-extension-block-css', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/kbsHelpers' );
		wp_register_script( 'kadence-kbsHelpers', KADENCE_BLOCKS_URL . 'dist/kbsHelpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-kbsHelpers', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/kbsComponents' );
		wp_register_script( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js', 'kadence-extension-global-styles-store' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-kbsComponents', 'kadence-blocks' );

		// Icons Scripts & Styles.
		$kadence_icons_meta = kbs_get_asset_file( 'dist/kbsIcons' );
		wp_register_script( 'kadence-kbsIcons', KADENCE_BLOCKS_URL . 'dist/kbsIcons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-kbsIcons', 'kadence-blocks' );

		// Plugin Scripts & Styles.
		$kadence_control_meta = kbs_get_asset_file( 'dist/plugin-kbs-control' );
		wp_register_script( 'plugin-kbs-control-js', KADENCE_BLOCKS_URL . 'dist/plugin-kbs-control.js', array_merge( $kadence_control_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_control_meta['version'], true );
		wp_register_style( 'plugin-kbs-control-css', KADENCE_BLOCKS_URL . 'dist/plugin-kbs-control.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_control_meta['version'] );
		wp_set_script_translations( 'kbs-plugin-js', 'kadence-blocks' );

		$kadence_prebuilt_library_meta = kbs_get_asset_file( 'dist/kbs-prebuilt-library' );
		wp_register_script( 'kadence-kbs-prebuilt-library', KADENCE_BLOCKS_URL . 'dist/kbs-prebuilt-library.js', array_merge( $kadence_prebuilt_library_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_prebuilt_library_meta['version'], true );
		wp_register_style( 'kadence-kbs-prebuilt-library', KADENCE_BLOCKS_URL . 'dist/kbs-prebuilt-library.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_prebuilt_library_meta['version'] );
		wp_set_script_translations( 'kadence-kbs-prebuilt-library', 'kadence-blocks' );

		$blocks = [
			'container',
			'row',
			'text',
			'buttons',
			'image',
		];
		foreach ( $blocks as $block ) {
			$meta   = kbs_get_asset_file( sprintf( 'dist/kbs-%s', $block ) );
			$handle = sprintf( 'kbs-%s', $block );

			wp_register_style( $handle, sprintf( '%sdist/kbs-%s.css', KADENCE_BLOCKS_URL, $block ), [ 'wp-edit-blocks', 'kadence-components', 'kadence-kbsComponents' ], $meta['version'] );
			wp_set_script_translations( $handle, 'kadence-blocks' );
		}

		$gfont_names_path = KADENCE_BLOCKS_PATH . 'includes/gfonts-names-array.php';

		$pro_data = kbs_get_current_license_data();
		if ( ! empty( $pro_data['key'] ) ) {
			$pro_data['api_key'] = $pro_data['key'];
		}
		if ( ! empty( $pro_data['email'] ) ) {
			$pro_data['api_email'] = $pro_data['email'];
		}
		$token         = ! kbs_is_ai_disabled() ? get_authorization_token( 'kadence-blocks' ) : '';
		$is_authorized = false;
		if ( ! empty( $pro_data['key'] ) && ! kbs_is_ai_disabled() ) {
			$is_authorized = is_authorized( $pro_data['key'], 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}
		if ( empty( $pro_data['domain'] ) ) {
			$pro_data['domain'] = get_license_domain();
		}

		wp_localize_script(
			'kadence-blocks-js',
			'kbs_params',
			[
				'responsive_device_options' => $this->get_responsive_device_options(),
				'global_styles'             => Global_Style::get_global_styles(),
				'cloud_enabled'             => apply_filters( 'kadence_blocks_cloud_enabled', true ),
				'cloud_settings'            => get_option( 'kadence_blocks_cloud' ),
				'prebuilt_libraries'        => apply_filters( 'kadence_blocks_custom_prebuilt_libraries', [] ),
				'showDesignLibrary'         => apply_filters( 'kadence_blocks_design_library_enabled', true ),
				'isKadenceTheme'            => class_exists( 'Kadence\Theme' ),
				'userrole'                  => wp_get_current_user()->roles[0],
				'svgMaskPath'               => KADENCE_BLOCKS_URL . 'includes/assets/images/masks/',
				'settings'                  => get_option( 'kadence_blocks_settings' ),
				'dynamic_enabled'           => apply_filters( 'kadence_blocks_dynamic_enabled', true ),
				'isAuthorized'              => $is_authorized,
				'isAIDisabled'              => kbs_is_ai_disabled(),
				'proData'                   => $pro_data,
				'homeLink'                  => admin_url( 'admin.php?page=kadence-blocks-home' ),
				'site_name'                 => sanitize_title( get_bloginfo( 'name' ) ),
				'pSlug'                     => apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ),
				'pVersion'                  => KADENCE_BLOCKS_VERSION,
				'aiLang'                    => apply_filters( 'kadence_blocks_ai_lang', 'en-US' ),
			]
		);
		wp_register_style( 'kbs-editor-global', false, [], KADENCE_BLOCKS_VERSION );
		wp_add_inline_style( 'kbs-editor-global', trim( apply_filters( 'kbs_editor_global_styles_css', '' ) ) );
	}

	/**
	 * Enqueue the global styles for the editor.
	 * 
	 * @param string $css any custom css.
	 * @return string
	 */
	public function editor_global_styles( $css ) {
		$generated_css = $this->generate_editor_global_styles_css();
		if ( ! empty( $generated_css ) ) {
			$css .= $generated_css;
		}
		return $css;
	}
	/**
	 * Gets variable name from category and type (PHP equivalent of JS function).
	 *
	 * @param string $category The style category (e.g., 'color', 'typography').
	 * @param string $type The style type or token name (e.g., 'primary', 'body').
	 * @return string The CSS variable name.
	 */
	public function get_mapping_variable_name( $category, $type ) {
		// First convert camelCase to kebab-case, then clean up
		$category_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $category );
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $category_slug ) );
		$category_slug = trim( $category_slug, '-' );

		$type_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $type );
		$type_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $type_slug ) );
		$type_slug = trim( $type_slug, '-' );

		return sprintf( '--kbs-%s-%s', $category_slug, $type_slug );
	}

	/**
	 * Generates the dynamic css based on customizer options.
	 *
	 * @param string $css any custom css.
	 * @return string
	 */
	public function generate_editor_global_styles_css() {
		// $css = $this->css_engine->global_styles_css->get_output_global_css();
		$global_styles = Global_Style::get_global_styles();
		
		$this->css->set_style_id( 'kbs-global-styles' );

		// Cache style items and base style for palette resolution
		$style_item_cache = [];
		$base_style_item  = isset( $global_styles['kbs-base'] )
			? new Global_Style_Item( 'kbs-base', $global_styles['kbs-base'] )
			: null;

		// Always emit ALL kbs-base color variables to :root, regardless of usage
		if ( $base_style_item ) {
			$base_mappings = $base_style_item->get_mappings();
			if ( isset( $base_mappings['colors'] ) && is_array( $base_mappings['colors'] ) ) {
				$this->css->set_selector( ':root' );
				foreach ( $base_mappings['colors'] as $token => $token_data ) {
					$value = $token_data['value'] ?? null;
					if ( $value === null || $value === '' ) {
						continue;
					}
					if ( is_string( $value ) && strpos( $value, 'var(--global-palette' ) !== false ) {
						$value = $this->resolve_global_palette_references( $value, $base_style_item );
					}
					$var_name = self::get_mapping_variable_name( 'colors', (string) $token );
					$this->css->add_property( $var_name, $value );
				}
			}
		}

		// For each global style class key
		foreach ( $global_styles as $style_id => $style_data ) {
			error_log( 'style_id' );
			error_log( print_r( $style_id, true ) );
			error_log( 'style_data' );
			error_log( print_r( $style_data, true ) );
			$selector = ( 'kbs-base' === $style_id ) ? ':root' : '.kbs-global-style-' . $style_id;
			$this->css->set_selector( $selector );
			if ( ! isset( $style_data ) ) {
				continue;
			}
			if ( ! isset( $style_item_cache[ $style_id ] ) ) {
				$style_item_cache[ $style_id ] = new Global_Style_Item( $style_id, $style_data );
			}
			$style_item = $style_item_cache[ $style_id ];
			$mappings = $style_item->get_mappings();
			//error_log( 'mappings' );
			//error_log( print_r( $mappings, true ) );
			foreach ( $mappings as $map_item ) {
				error_log( 'map_item' );
				error_log( print_r( $map_item, true ) );
				$v = $map_item;
				foreach ( $map_item as $single_item ) {
					error_log( 'single_item' );
					error_log( print_r( $single_item, true ) );
					$value = $single_item['value'] ?? null;
					if ( $value !== null ) {
						if ( is_string( $value ) && strpos( $value, 'var(--global-palette' ) !== false ) {
							$value = $this->resolve_global_palette_references( $value, $base_style_item );
						}
						$this->css->add_property( $single_item['name'], $value );
					}

				}
			}

				// Emit preset component variables for this style, so var(--kbs-<prop>-<preset>) resolves in this scope
				$components = $style_item->get_components();
			if ( ! empty( $components ) && is_array( $components ) ) {
				foreach ( $components as $component_name => $component_data ) {
					if ( empty( $component_data['presets'] ) || ! is_array( $component_data['presets'] ) ) {
						continue;
					}
						
					// Get component keys dynamically based on component type
					$component_keys = \KadenceWP\KadenceBlocks\Frontend\Utils\Component_Value_Resolver::get_component_keys( $component_name );
						
					foreach ( $component_data['presets'] as $preset_key => $preset_data ) {
						if ( empty( $preset_data['attributes'] ) || ! is_array( $preset_data['attributes'] ) ) {
							continue;
						}
							
						// Determine attributes for desktop device as base
						$attrs = isset( $preset_data['attributes']['desktop'] ) && is_array( $preset_data['attributes']['desktop'] )
							? $preset_data['attributes']['desktop'] : ( is_array( $preset_data['attributes'] ) ? $preset_data['attributes'] : [] );
							
						$token = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $preset_key ) );
							
						// Process each component key dynamically
						foreach ( $component_keys as $attr_key ) {
							// Skip hover/active states for now (could be enhanced later)
							if ( strpos( $attr_key, 'Hover' ) !== false || strpos( $attr_key, 'Active' ) !== false ) {
								continue;
							}
								
							if ( ! isset( $attrs[ $attr_key ] ) || $attrs[ $attr_key ] === '' ) {
								continue;
							}
								
							$val = $attrs[ $attr_key ];
								
							// Process value through appropriate CSS engine methods based on property type
							if ( is_string( $val ) ) {
								// Font size processing
								if ( $attr_key === 'fontSize' ) {
									$converted = $this->css->get_variable_font_size_value( $val );
									if ( $converted ) {
										$val = $converted;
									}
								}
								// Line height processing
								elseif ( $attr_key === 'lineHeight' ) {
									$converted = $this->css->get_variable_line_height_value( $val );
									if ( $converted ) {
										$val = $converted;
									}
								}
								// Letter spacing processing
								elseif ( $attr_key === 'letterSpacing' ) {
									$converted = $this->css->get_variable_letter_spacing_value( $val );
									if ( $converted ) {
										$val = $converted;
									}
								}
								// Color processing
								elseif ( strpos( $attr_key, 'color' ) !== false || strpos( $attr_key, 'Color' ) !== false ) {
									$val = $this->css->sanitize_color( $val );
								}
								// Spacing values (padding, margin, etc.)
								elseif ( preg_match( '/(padding|margin|gap|width|height|size|radius)/i', $attr_key ) ) {
									$converted = $this->css->get_variable_spacing_value( $val );
									if ( $converted ) {
										$val = $converted;
									}
								}
							}
								
							// Skip non-string values to avoid warnings
							if ( is_array( $val ) || is_object( $val ) ) {
								continue;
							}
								
							// Generate variable name using kebab-case conversion
							$var_name = sprintf( '--kbs-%s-%s', strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $attr_key ) ), $token );
							$this->css->add_property( $var_name, $val );
						}
					}
				}
			}
		}
		$css = $this->css->css_output();
		// error_log( 'generated_css' );
		// error_log( print_r( $css, true ) );
		return $css;
	}

	/**
	 * Connects theme styles to core block style so it loads in full size editing context.
	 * This is a workaround so dynamic css can be loaded in Iframe and FSE mode.
	 */
	public function update_block_style_dependencies() {
		$wp_styles = wp_styles();
		$style     = $wp_styles->query( 'wp-block-library', 'registered' );
		if ( ! $style ) {
			return;
		}
		if (
			wp_style_is( 'kbs-editor-global', 'registered' ) &&
			! in_array( 'kbs-editor-global', $style->deps, true )
		) {
			$style->deps[] = 'kbs-editor-global';
		}
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function editor_plugin_enqueue() {
		global $pagenow;
		if ( $pagenow !== 'widgets.php' ) {
			wp_enqueue_script( 'plugin-kbs-control-js' );
			wp_enqueue_style( 'plugin-kbs-control-css' );
			wp_enqueue_script( 'kadence-kbs-prebuilt-library' );
			wp_enqueue_style( 'kadence-kbs-prebuilt-library' );
		}
	}

	/**
	 * Get the responsive device options.
	 *
	 * @return array
	 */
	public static function get_responsive_device_options() {
		$responsive_device_options = apply_filters(
			'kadence_blocks_responsive_device_options',
			[
				[
					'name'          => 'Desktop',
					'key'           => 'desktop',
					'icon'          => 'desktop',
					'itemClass'     => 'kbs-desk-size',
					'attributeSlug' => 'desktop',
					'mediaQuery'    => apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' ),
				],
				[
					'name'          => 'Tablet',
					'key'           => 'tablet',
					'icon'          => 'tablet',
					'itemClass'     => 'kbs-tablet-size',
					'attributeSlug' => 'tablet',
					'mediaQuery'    => apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' ),
				],
				[
					'name'          => 'Mobile',
					'key'           => 'mobile',
					'icon'          => 'mobile',
					'itemClass'     => 'kbs-mobile-size',
					'attributeSlug' => 'mobile',
					'mediaQuery'    => apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' ),
				],
			] 
		);

		/*
		 * The editor is dependent on these keys to set values.
		 * If any device is missing an attribute slug, name, or key, remove it.
		 */
		foreach ( $responsive_device_options as $key => $device ) {
			if ( ! isset( $device['attributeSlug'] ) || ! isset( $device['name'] ) || ! isset( $device['key'] ) ) {
				unset( $responsive_device_options[ $key ] );
			}
		}

		return $responsive_device_options;
	}
}
