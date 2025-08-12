<?php
/**
 * Dimension component CSS generator (width, height, maxWidth, etc.)
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dimension component CSS generator
 */
class Dimension_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'dimension';
	
	/**
	 * Generate CSS for dimension component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// For dimension properties, we typically have a single value
		// The attribute name itself is the dimension type (width, maxWidth, etc.)
		$dimension_type = strtolower( $attribute_name );
		
		// Process each dimension property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_dimension_property( $key, $resolved_value, $meta, $dimension_type );
			}
		}
	}
	
	/**
	 * Apply a dimension property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @param string $dimension_type The type of dimension.
	 * @return void
	 */
	protected function apply_dimension_property( $key, $resolved_value, $meta, $dimension_type ) {
		$css_value = $this->process_dimension_value( $resolved_value['value'] );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Use the inherited method for applying the property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
	}
	
	/**
	 * Process dimension value
	 *
	 * @param mixed $value The resolved value.
	 * @return string The processed CSS value.
	 */
	protected function process_dimension_value( $value ) {
		// Handle special values
		if ( $value === 'auto' || $value === 'inherit' || $value === 'initial' || $value === 'unset' ) {
			return $value;
		}
		
		// Handle percentage values
		if ( strpos( $value, '%' ) !== false ) {
			return $value;
		}
		
		// Handle viewport units
		if ( strpos( $value, 'vw' ) !== false || strpos( $value, 'vh' ) !== false || 
			 strpos( $value, 'vmin' ) !== false || strpos( $value, 'vmax' ) !== false ) {
			return $value;
		}
		
		// Handle rem/em units
		if ( strpos( $value, 'rem' ) !== false || strpos( $value, 'em' ) !== false ) {
			return $value;
		}
		
		// Handle calc() expressions
		if ( strpos( $value, 'calc(' ) !== false ) {
			return $value;
		}
		
		// Handle CSS variables
		if ( strpos( $value, 'var(' ) !== false ) {
			return $value;
		}
		
		// If numeric, add 'px' unit
		if ( is_numeric( $value ) ) {
			return $value . 'px';
		}
		
		return $value;
	}
	
	/**
	 * Get component keys for dimension
	 * This varies based on the specific dimension type
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		// For dimension components, the key is typically the same as the attribute name
		return array(
			'width',
			'height',
			'maxWidth',
			'maxHeight',
			'minWidth',
			'minHeight',
		);
		}
}