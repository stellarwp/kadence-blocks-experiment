<?php
/**
 * Shadow component CSS generator (box-shadow, text-shadow)
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shadow component CSS generator
 */
class Shadow_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'shadow';
	
	/**
	 * Generate CSS for shadow component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Determine shadow type from attribute name
		$shadow_type = strtolower( str_replace( 'Hover', '', $attribute_name ) );
		
		// Process each shadow property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_shadow_property( $key, $resolved_value, $meta, $shadow_type );
			}
		}
	}
	
	/**
	 * Apply a shadow property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @param string $shadow_type The type of shadow (box-shadow or text-shadow).
	 * @return void
	 */
	protected function apply_shadow_property( $key, $resolved_value, $meta, $shadow_type ) {
		$css_value = $this->process_shadow_value( $resolved_value['value'], $shadow_type );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Use the inherited method for applying the property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
	}
	
	/**
	 * Process shadow value
	 *
	 * @param mixed  $value The resolved value.
	 * @param string $shadow_type The type of shadow.
	 * @return string The processed CSS value.
	 */
	protected function process_shadow_value( $value, $shadow_type ) {
		// If value is already a string (CSS shadow value), return as-is
		if ( is_string( $value ) && ! empty( $value ) ) {
			return $value;
		}
		
		// If value is an array, format it as shadow
		if ( is_array( $value ) ) {
			return $this->format_shadow_from_array( $value, $shadow_type );
		}
		
		return $value;
	}
	
	/**
	 * Format shadow from array of values
	 *
	 * @param array  $shadow_data The shadow data array.
	 * @param string $shadow_type The type of shadow.
	 * @return string The formatted shadow CSS value.
	 */
	protected function format_shadow_from_array( $shadow_data, $shadow_type ) {
		// Handle multiple shadows
		if ( isset( $shadow_data[0] ) && is_array( $shadow_data[0] ) ) {
			$shadows = array();
			foreach ( $shadow_data as $single_shadow ) {
				$formatted = $this->format_single_shadow( $single_shadow, $shadow_type );
				if ( ! empty( $formatted ) ) {
					$shadows[] = $formatted;
				}
			}
			return implode( ', ', $shadows );
		}
		
		// Handle single shadow
		return $this->format_single_shadow( $shadow_data, $shadow_type );
	}
	
	/**
	 * Format a single shadow
	 *
	 * @param array  $shadow The shadow data.
	 * @param string $shadow_type The type of shadow.
	 * @return string The formatted shadow value.
	 */
	protected function format_single_shadow( $shadow, $shadow_type ) {
		$h_offset = isset( $shadow['hOffset'] ) ? $this->add_unit( $shadow['hOffset'] ) : '0';
		$v_offset = isset( $shadow['vOffset'] ) ? $this->add_unit( $shadow['vOffset'] ) : '0';
		$blur = isset( $shadow['blur'] ) ? $this->add_unit( $shadow['blur'] ) : '0';
		$color = isset( $shadow['color'] ) ? $this->css_engine->sanitize_color( $shadow['color'] ) : '';
		
		// Box shadow can have spread and inset
		if ( $shadow_type === 'boxshadow' || $shadow_type === 'box-shadow' ) {
			$spread = isset( $shadow['spread'] ) ? $this->add_unit( $shadow['spread'] ) : '';
			$inset = isset( $shadow['inset'] ) && $shadow['inset'] ? 'inset ' : '';
			
			if ( ! empty( $spread ) ) {
				return $inset . $h_offset . ' ' . $v_offset . ' ' . $blur . ' ' . $spread . ( ! empty( $color ) ? ' ' . $color : '' );
			}
		}
		
		// Basic shadow format (works for both text-shadow and simple box-shadow)
		return ( isset( $inset ) ? $inset : '' ) . $h_offset . ' ' . $v_offset . ' ' . $blur . ( ! empty( $color ) ? ' ' . $color : '' );
	}
	
	/**
	 * Add unit to numeric value
	 *
	 * @param mixed $value The value to add unit to.
	 * @return string The value with unit.
	 */
	protected function add_unit( $value ) {
		if ( is_numeric( $value ) ) {
			return $value . 'px';
		}
		return $value;
	}
	
	/**
	 * Get component keys for shadow
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'boxShadow',
			'textShadow',
		);
		}
}