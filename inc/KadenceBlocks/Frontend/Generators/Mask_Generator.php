<?php
/**
 * Mask component CSS generator
 * Handles mask-image properties using shape types from assets/images/masks
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Mask component CSS generator
 * Handles mask-image properties using shape types from assets/images/masks
 */
class Mask_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'mask';
	
	/**
	 * Map of shape types to their corresponding mask image files
	 *
	 * @var array
	 */
	protected static $mask_images = array(
		'thumbs-down' => 'thumbs-down.svg',
		'thumbs-up'   => 'thumbs-up.svg',
		'smile-beam'  => 'smile-beam.svg',
		'star'        => 'star.svg',
		'mug-hot'     => 'mug-hot.svg',
		'rounded'     => 'rounded.svg',
		'heart'       => 'heart.svg',
		'hexagon'     => 'hexagon.svg',
		'dog'         => 'dog.svg',
		'diamond'     => 'diamond.svg',
		'cat'         => 'cat.svg',
		'circle'      => 'circle.svg',
		'blob1'       => 'blob1.svg',
		'blob2'       => 'blob2.svg',
		'blob3'       => 'blob3.svg',
	);
	
	/**
	 * Generate CSS for mask component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Check if debugging is enabled for this component
		if ( ! empty( $meta['debug'] ) && $meta['debug'] === true ) {
			$this->output_generator_debug( $attribute_name, $meta, $resolved_values );
		}
		
		// Handle shape-based masks
		$shape_value = isset( $resolved_values['shape'] ) ? $resolved_values['shape'] : null;
		if ( $shape_value && $this->should_render_value( $shape_value, $meta ) ) {
			$css_value = $this->process_mask_value( $shape_value['value'], $resolved_values, $meta );
			if ( ! empty( $css_value ) ) {
				$this->apply_property( 'mask-image', array_merge( $shape_value, array( 'value' => $css_value ) ), $meta );
			}
		}
	}
	
	/**
	 * Process mask value to generate CSS mask-image URL
	 *
	 * @param string $shape_type The shape type value.
	 * @param array  $resolved_values All resolved values for the component.
	 * @param array  $meta Component metadata.
	 * @return string|null The processed CSS value or null if invalid.
	 */
	protected function process_mask_value( $shape_type, $resolved_values, $meta ) {
		if ( empty( $shape_type ) || ! is_string( $shape_type ) ) {
			return null;
		}
		
		// Handle custom shape - look for image key
		if ( $shape_type === 'custom' ) {
			$image_value = isset( $resolved_values['image'] ) ? $resolved_values['image'] : null;
			if ( $image_value && ! empty( $image_value['value'] ) ) {
				return 'url("' . esc_url( $image_value['value'] ) . '")';
			}
			return null;
		}
		
		// Normalize the shape type (convert to kebab-case if needed)
		$normalized_shape_type = strtolower( str_replace( ' ', '-', $shape_type ) );
		
		// Get the corresponding mask image file
		$mask_image_file = isset( self::$mask_images[ $normalized_shape_type ] ) ? self::$mask_images[ $normalized_shape_type ] : null;
		
		if ( empty( $mask_image_file ) ) {
			// If shape type not found, return null (no CSS will be generated)
			return null;
		}
		
		// Create the mask image URL directly
		$mask_image_url = KADENCE_BLOCKS_URL . '/includes/assets/images/masks/' . $mask_image_file;
		
		return 'url("' . esc_url( $mask_image_url ) . '")';
	}
	
	/**
	 * Get component keys for mask
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array( 'shape', 'image' );
	}
} 