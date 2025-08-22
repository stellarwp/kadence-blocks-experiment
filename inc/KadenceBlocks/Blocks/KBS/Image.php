<?php
/**
 * Class to Build the KBS Image Block.
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Blocks\KBS;

use KadenceWP\KadenceBlocks\Blocks\Abstract_Block;
use function get_block_wrapper_attributes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Row Block.
 *
 * @category class
 */
class Image extends Abstract_Block {

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'image';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $root_selector_class = 'kbs-image';

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
		$classes     = [ $this->root_selector_class, $this->root_selector_class . $unique_id ];
		$classes     = array_merge( $classes, $this->get_global_style_class( $attributes ) );

		$has_overlay = false;

		// Attribute aquisition.
		$image_value = self::get_resolved_value( 'image', $attributes, 'none', $this->get_attribute_meta( $block_instance, 'image' ), 'image', [] );
		$has_image = ! empty( $image_value['appliedValue'] ) ? true : false;
		$image_id_value = self::get_resolved_value( 'image', $attributes, 'none', $this->get_attribute_meta( $block_instance, 'image' ), 'imageId', [] );
		$alt_any_value = self::get_resolved_value( 'alt', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'alt' ), 'alt', [] );
		$title_any_value = self::get_resolved_value( 'title', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'title' ), 'title', [] );
		$dynamic_alt_any_value = self::get_resolved_value( 'alt', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'alt' ), 'dynamicAlt', [] );
		$has_dynamic_alt = ! empty( $dynamic_alt_any_value['appliedValue'] ) ? true : false;
		$use_ratio_any_value = self::get_resolved_value( 'useRatio', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'useRatio' ), 'useRatio', [] );
		$has_ratio = ! empty( $use_ratio_any_value['appliedValue'] ) ? true : false;
		$ratio_any_value = self::get_resolved_value( 'ratio', $attributes, 'any', $this->get_attribute_meta( $block_instance, 'ratio' ), 'ratio', [] );
		$ratio_value = $ratio_any_value['appliedValue'] ? : 'land43';
		$link_value = self::get_resolved_value( 'link', $attributes, 'none', $this->get_attribute_meta( $block_instance, 'link' ), 'url', [] );
		$has_link = ! empty( $link_value['appliedValue'] ) ? true : false;

		// Image wrapper attributes.
		$img_wrapper_classes = [
			'kbs-image-wrapper',
		];
		if ( $has_ratio ) {
			$classes[] = 'kbs-image-has-ratio';
			$img_wrapper_classes[] = 'kbs-image-ratio-' . $ratio_value;
		}
		if ( $has_overlay ) {
			$img_wrapper_classes[] = 'kbs-image-has-overlay';
		}

		$img_wrapper_args = [
			'class' => implode( ' ', $img_wrapper_classes ),
		];

		$img_wrapper_attributes = self::get_wrapper_attributes( $img_wrapper_args );

		// Image attributes.
		$alt = $alt_any_value['appliedValue'] ? : '';
		if ( apply_filters( 'kadence_blocks_update_alt_text_globally', $has_dynamic_alt, $attributes ) && ! empty( $image_id_value['appliedValue'] ) ) {
			// Check if we can get the alt text.
			$alt = get_post_meta( $image_id_value['appliedValue'], '_wp_attachment_image_alt', true );
		}

		$img_args = [
			'class' => 'kbs-image-img',
			'src' => $image_value['appliedValue'],
			'alt' => $alt,
			'title' => $title_any_value['appliedValue'],
		];

		$img_attributes = self::get_wrapper_attributes( $img_args );

		// Wrapper attributes.
		$wrapper_args = [
			'class' => implode( ' ', $classes ),
		];
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}

		$wrapper_args       = apply_filters( 'kbs_wrapper_args', $wrapper_args, $attributes, $this->block_name, $unique_id, $block_instance );
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		// html output.
		$content = $has_ratio || $has_overlay ? '<div ' . $img_wrapper_attributes . '>' : '';
		$img_content = '<img ' . $img_attributes . ' />';
		if ( $has_link ) {
			$img_content = self::get_link_html( $attributes['link'], $img_content );
		}
		$content .= $img_content;
		$content .= $has_ratio || $has_overlay ? '</div>' : '';

		$bg_html = $this->get_background_html( 'foreground', $attributes, $block_instance );

		if ( $has_image ) {
			return sprintf( '<figure %1$s><div class="kbs-image-foreground">%3$s</div>%2$s</figure>', $wrapper_attributes, $content, $bg_html );
		}

		return '';
	}
}
