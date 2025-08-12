<?php
/**
 * Transition component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Transition component CSS generator
 */
class Transition_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'transition';
	
	/**
	 * Generate CSS for transition component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Collect transition properties
		$property = '';
		$duration = '';
		$timing_function = '';
		$delay = '';
		
		// Process each transition property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( ! $this->should_render_value( $resolved_value, $meta ) ) {
				continue;
			}
			
			switch ( $key ) {
				case 'transitionProperty':
					$property = $resolved_value['value'];
					break;
				case 'transitionDuration':
					$duration = $this->format_duration( $resolved_value['value'] );
					break;
				case 'transitionTimingFunction':
					$timing_function = $resolved_value['value'];
					break;
				case 'transitionDelay':
					$delay = $this->format_duration( $resolved_value['value'] );
					break;
			}
		}
		
		// Build transition shorthand if we have the minimum required properties
		if ( ! empty( $property ) && ! empty( $duration ) ) {
			$transition_value = $property . ' ' . $duration;
			
			if ( ! empty( $timing_function ) ) {
				$transition_value .= ' ' . $timing_function;
			}
			
			if ( ! empty( $delay ) ) {
				$transition_value .= ' ' . $delay;
			}
			
			$this->add_property( 'transition', $transition_value );
		} else {
			// Apply individual properties if shorthand can't be used
			if ( ! empty( $property ) ) {
				$this->add_property( 'transition-property', $property );
			}
			if ( ! empty( $duration ) ) {
				$this->add_property( 'transition-duration', $duration );
			}
			if ( ! empty( $timing_function ) ) {
				$this->add_property( 'transition-timing-function', $timing_function );
			}
			if ( ! empty( $delay ) ) {
				$this->add_property( 'transition-delay', $delay );
			}
		}
	}
	
	/**
	 * Format duration value
	 *
	 * @param mixed $value The duration value.
	 * @return string The formatted duration.
	 */
	protected function format_duration( $value ) {
		// If numeric, assume milliseconds and convert to seconds
		if ( is_numeric( $value ) ) {
			if ( $value < 10 ) {
				// If less than 10, assume it's already in seconds
				return $value . 's';
			}
			// Convert milliseconds to seconds
			return ( $value / 1000 ) . 's';
		}
		
		// Check if it already has a unit
		if ( strpos( $value, 'ms' ) !== false || strpos( $value, 's' ) !== false ) {
			return $value;
		}
		
		return $value;
	}
	
	/**
	 * Get component keys for transition
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'transitionProperty',
			'transitionDuration',
			'transitionTimingFunction',
			'transitionDelay',
		);
		}
}