<?php
/**
 * Class to Build the KBS Text Block.
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Blocks\KBS;

use KadenceWP\KadenceBlocks\Blocks\Abstract_Block;
use KadenceWP\KadenceBlocks\Frontend\Svg_Render;
use function get_block_wrapper_attributes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Text Block.
 *
 * @category class
 */
class Text extends Abstract_Block {

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'text';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $root_selector_class = 'kbs-text';

	/**
	 * Allowed HTML tags for front end output
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = [ 'div', 'p', 'span' ];
	
	/**
	 * Block determines in scripts need to be loaded for block.
	 * Note: this block can have scripts, such as typed text, but because we don't know in attributes if this block needs scripts, we need to check the content during build_html instead.
	 * This prevents the scripts for some features for loading for blocks that don't need them.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Builds CSS for block.
	 *
	 * @param array      $attributes the blocks attributes.
	 * @param CSS_Engine $css the css class for blocks.
	 * @param string     $unique_id the blocks attr ID.
	 * @param string     $unique_style_id the blocks alternate ID for queries.
	 * @param WP_Block   $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id, $block_instance ) {
		$css->set_style_id( 'kbs-' . $this->block_name . $unique_style_id );
		$root_selector = '.' . $this->root_selector_class . $unique_id;

		$css->set_selector( $root_selector );

		$css->add_attributes( $attributes, $block_instance );

		// Add text alignment if set.
		if ( ! empty( $attributes['align'] ) ) {
			$css->set_selector( $root_selector );
			$css->add_property( 'text-align', $attributes['align'] );
		}

		$css = $this->add_custom_css( $css, $attributes, $root_selector );

		return $css->css_output();
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param array    $attributes the block attributes.
	 * @param string   $unique_id the blocks unique id.
	 * @param string   $content the blocks inner content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		//Since we don't know in attributes if this block needs scripts, we need to check the content here
		$has_typed_text = strpos( $content, 'kt-typed-text' ) !== false;
		$has_tooltip = strpos( $content, 'kb-tooltips' ) !== false;
		$icon_tooltip_content_any_value = self::get_resolved_value( 'icon', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'icon' ), 'tooltipContent', [] );
		$has_icon_tooltip = ! empty( $icon_tooltip_content_any_value['appliedValue'] );
		if ( $has_typed_text ) {
			$this->enqueue_script( 'kbs-' . $this->block_name );
		}
		if ( $has_tooltip || $has_icon_tooltip ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		$initial_tag  = $this->get_initial_attribute( $block_instance, 'htmlTag', 'div' );
		$html_tag     = $this->get_html_tag( $attributes, 'htmlTag', $initial_tag, $this->allowed_html_tags );
		$wrapper_classes      = [ $this->root_selector_class, $this->root_selector_class . $unique_id ];
		$wrapper_classes = array_merge( $wrapper_classes, $this->get_global_style_classes( $attributes ) );
		$content_classes = [];

		$link_value = self::get_resolved_value( 'link', $attributes, 'none', $this->get_attribute_meta( $block_instance, 'link' ), 'url', [] );
		$icon_any_value = self::get_resolved_value( 'icon', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'icon' ), 'icon', [] );
		$max_width_any_value = self::get_resolved_value( 'maxWidth', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'maxWidth' ), 'maxWidth', [] );
		$color_any_value = self::get_resolved_value( 'color', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'color' ), 'color', [] );
		$icon_placement_any_value = self::get_resolved_value( 'icon', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'iconPlacement' ), 'placement', [] );

		$has_link = ! empty( $link_value['appliedValue'] ) ? true : false;
		$has_max_width = ! empty( $max_width_any_value['appliedValue'] ) ? true : false;
		$has_icon = ! empty( $icon_any_value['appliedValue'] ) ? true : false;
		$has_gradient = ! empty( $color_any_value['appliedValue'] ) && strpos( $color_any_value['appliedValue'], 'gradient(' ) !== false;

		$should_wrap_content = $has_link || $has_max_width || $has_icon || $has_gradient || $has_typed_text;


		if ( ! empty( $attributes['align'] ) ) {
			$wrapper_classes[] = 'has-text-align-' . $attributes['align'];
		}
		if ( $has_icon ) {
			$wrapper_classes[] = 'kbs-text-has-icon';
		}

		$content_classes[] = 'kbs-text-content';
		$content_class_string = 'class="' . esc_attr( implode( ' ', $content_classes ) ) . '"';


		if ( !$should_wrap_content ) {
			$wrapper_classes = array_merge( $wrapper_classes, $content_classes );
		}
		
		$wrapper_args = [
			'class' => implode( ' ', $wrapper_classes ),
		];
		
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		
		$wrapper_args       = apply_filters( 'kbs_wrapper_args', $wrapper_args, $attributes, $this->block_name, $unique_id, $block_instance );
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$icon_html = Svg_Render::render_icon( $attributes, 'icon', 'kbs-text-' );
		$icon_placement = $icon_placement_any_value['appliedValue'];
		if ( $icon_placement === 'right' ) {
			$content = $content . $icon_html;
		} else {
			$content = $icon_html . $content;
		}

		if ( $has_link ) {
			$content = self::get_link_html( $attributes['link'], $content);
		}

		if ( $should_wrap_content ) {
			$content = str_replace( 'class="kbs-text-content"', $content_class_string,  $content );
			return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
		} else {
			$content = str_replace( 'class="kbs-text-content"', $wrapper_attributes, $content );
			return $content;
		}
	}

	/**
	 * Registers scripts and styles.
	 *
	 * @param string $handle the handle for the script.
	 */
	public function register_scripts( $handle ) {
		parent::register_scripts( $handle );

		wp_register_script( 'kadence-blocks-typed-js', KADENCE_BLOCKS_URL . 'includes/assets/js/typed.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kbs-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kbs-text.min.js', [ 'kadence-blocks-typed-js' ], KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', [ 'kadence-blocks-popper' ], KADENCE_BLOCKS_VERSION, true );
	}
}
