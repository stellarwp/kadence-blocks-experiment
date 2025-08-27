<?php
/**
 * Filter component CSS generator
 * Handles combining dropShadow and simple filter values into a single CSS filter property
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filter component CSS generator
 */
class Filter_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'filter';
	
	/**
	 * Map of filter slugs to their CSS filter strings
	 *
	 * @var array
	 */
	protected static $filter_map = array(
		'none'              => '',
		'sepia'             => 'sepia(0.5)',
		'grayscale'         => 'grayscale(1)',
		'saturation'        => 'saturate(1.6)',
		'earlybird'         => 'contrast(0.9) sepia(0.2)',
		'mayfair'           => 'contrast(1.1) saturate(1.1)',
		'toaster'           => 'contrast(1.5) brightness(0.9)',
		'vintage'           => 'sepia(0.2) brightness(1.1) contrast(1.3)',
	);
	
	/**
	 * Generate CSS for filter component
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
		
		// Collect all filter values
		$filter_values = array();
		
		// Process dropShadow values
		if ( isset( $resolved_values['dropShadow'] ) ) {
			$drop_shadow_value = $resolved_values['dropShadow'];
			if ( $this->should_render_value( $drop_shadow_value, $meta ) ) {
				$drop_shadow_css = $this->process_drop_shadow_value( $drop_shadow_value['value'] );
				if ( ! empty( $drop_shadow_css ) ) {
					$filter_values[] = $drop_shadow_css;
				}
			}
		}
		
		// Process simple filter values
		if ( isset( $resolved_values['simple'] ) ) {
			$simple_filter_value = $resolved_values['simple'];
			if ( $this->should_render_value( $simple_filter_value, $meta ) ) {
				$simple_filter_css = $this->process_simple_filter_value( $simple_filter_value['value'] );
				if ( ! empty( $simple_filter_css ) ) {
					$filter_values[] = $simple_filter_css;
				}
			}
		}
		
		// Apply combined filter if we have any values
		if ( ! empty( $filter_values ) ) {
			$combined_filter = implode( ' ', $filter_values );
			$this->apply_property( 'filter', array( 'value' => $combined_filter ), $meta );
		}
	}
	
	/**
	 * Process dropShadow value to generate CSS drop-shadow filter
	 *
	 * @param mixed $value The dropShadow value (assumed to be a valid shadow string).
	 * @return string|null The processed CSS value or null if invalid.
	 */
	protected function process_drop_shadow_value( $value ) {
		// Assume value is already a valid shadow string
		if ( is_string( $value ) && ! empty( trim( $value ) ) ) {
			return $value;
		}
		
		return null;
	}
	
	/**
	 * Process simple filter value
	 *
	 * @param string $value The simple filter slug.
	 * @return string|null The processed CSS value or null if invalid.
	 */
	protected function process_simple_filter_value( $value ) {
		// If value is already a string and not empty, look it up in the filter map
		if ( is_string( $value ) && ! empty( trim( $value ) ) ) {
			$filter_string = isset( self::$filter_map[ $value ] ) ? self::$filter_map[ $value ] : null;
			if ( $filter_string !== null ) {
				return $filter_string;
			}
			// If not found in map, return the value as-is (for backward compatibility)
			return $value;
		}
		
		return null;
	}
	
	/**
	 * Get component keys for filter
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'dropShadow',
			'simple',
		);
	}
} 