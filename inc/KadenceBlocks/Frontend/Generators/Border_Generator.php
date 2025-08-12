<?php
/**
 * Border component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Border component CSS generator
 */
class Border_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'border';
	
	/**
	 * Generate CSS for border component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Process each border property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_border_property( $key, $resolved_value, $meta );
			}
		}
	}
	
	/**
	 * Apply a border property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @return void
	 */
	protected function apply_border_property( $key, $resolved_value, $meta ) {
		$css_value = $this->process_border_value( $key, $resolved_value['value'] );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Use the inherited method for applying the property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
	}
	
	/**
	 * Process border value based on property type
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @return string The processed CSS value.
	 */
	protected function process_border_value( $key, $value ) {
		// Handle border radius properties
		if ( strpos( $key, 'Radius' ) !== false ) {
			// If numeric, add 'px' unit
			if ( is_numeric( $value ) ) {
				return $value . 'px';
			}
			return $value;
		}
		
		// Handle border side properties (borderTop, borderLeft, etc.)
		if ( strpos( $key, 'border' ) === 0 && strpos( $key, 'Radius' ) === false ) {
			// Border shorthand properties
			if ( is_array( $value ) ) {
				return $this->format_border_shorthand( $value );
			}
			return $value;
		}
		
		return $value;
	}
	
	/**
	 * Format border shorthand from array
	 *
	 * @param array $border_data The border data array.
	 * @return string The formatted border shorthand.
	 */
	protected function format_border_shorthand( $border_data ) {
		$width = isset( $border_data['width'] ) ? $border_data['width'] : '1px';
		$style = isset( $border_data['style'] ) ? $border_data['style'] : 'solid';
		$color = isset( $border_data['color'] ) ? $border_data['color'] : '';
		
		// Add px unit to width if numeric
		if ( is_numeric( $width ) ) {
			$width = $width . 'px';
		}
		
		// Sanitize color
		if ( ! empty( $color ) ) {
			$color = $this->css_engine->sanitize_color( $color );
		}
		
		// Return shorthand
		if ( ! empty( $color ) ) {
			return $width . ' ' . $style . ' ' . $color;
		}
		
		return $width . ' ' . $style;
	}
	
	/**
	 * Get component keys for border
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'borderTopLeftRadius',
			'borderTopRightRadius',
			'borderBottomRightRadius',
			'borderBottomLeftRadius',
			'borderTopLeftRadiusHover',
			'borderTopRightRadiusHover',
			'borderBottomRightRadiusHover',
			'borderBottomLeftRadiusHover',
			'borderTop',
			'borderLeft',
			'borderRight',
			'borderBottom',
			'borderTopHover',
			'borderLeftHover',
			'borderRightHover',
			'borderBottomHover',
		);
		}
}