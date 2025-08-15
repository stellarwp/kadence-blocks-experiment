<?php
/**
 * Icon component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Icon component CSS generator
 */
class Icon_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'icon';
	
	/**
	 * Generate CSS for icon component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Process each icon property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_icon_property( $key, $resolved_value, $meta );
			}
		}
	}
	
	/**
	 * Apply an icon property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @return void
	 */
	protected function apply_icon_property( $key, $resolved_value, $meta ) {
		$css_value = $this->process_icon_value( $key, $resolved_value['value'] );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Use the inherited method for applying the property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
	}
	
	/**
	 * Process icon value based on property type
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @return string The processed CSS value.
	 */
	protected function process_icon_value( $key, $value ) {
		switch ( $key ) {
			case 'iconSize':
			case 'iconSizeHover':
				// Check if it's a variable icon size value
				if ( $this->css_engine->is_variable_icon_size_value( $value ) ) {
					return $this->css_engine->get_variable_icon_size_value( $value );
				}
				// If numeric, add 'px' unit
				if ( is_numeric( $value ) ) {
					return $value . 'px';
				}
				return $value;
				
			case 'iconLineWidth':
			case 'iconLineWidthHover':
				// Line width is typically a numeric value
				if ( is_numeric( $value ) ) {
					return $value;
				}
				return $value;
				
			case 'color':
			case 'colorHover':
				return $this->css_engine->sanitize_color( $value );
				
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
			case 'paddingLeft':
			case 'paddingHoverTop':
			case 'paddingHoverRight':
			case 'paddingHoverBottom':
			case 'paddingHoverLeft':
				// Handle padding values
				if ( $this->css_engine->is_variable_spacing_value( $value ) ) {
					return $this->css_engine->get_variable_spacing_value( $value );
				}
				if ( is_numeric( $value ) ) {
					return $value . 'px';
				}
				return $value;
				
			case 'alignItems':
				// Alignment values are used as-is
				return $value;
				
			case 'rotation':
			case 'rotationHover':
				// Rotation values need to be formatted as rotate transform
				if ( is_numeric( $value ) ) {
					return 'rotate(' . $value . 'deg)';
				}
				// If value already has deg unit, wrap it in rotate()
				if ( strpos( $value, 'deg' ) !== false ) {
					return 'rotate(' . $value . ')';
				}
				return $value;
				
			default:
				return $value;
		}
	}
	
	/**
	 * Get CSS property name for icon
	 *
	 * @param string $key The attribute key.
	 * @param array  $meta Component metadata.
	 * @return string The CSS property name.
	 */
	protected function get_css_property( $key, $meta ) {
		// Map icon properties to their CSS equivalents
		$property_map = array(
			'iconSize'           => 'font-size',
			'iconSizeHover'      => 'font-size',
			'iconLineWidth'      => 'stroke-width',
			'iconLineWidthHover' => 'stroke-width',
			'color'              => 'color',
			'colorHover'         => 'color',
			'paddingTop'         => 'padding-top',
			'paddingRight'       => 'padding-right',
			'paddingBottom'      => 'padding-bottom',
			'paddingLeft'        => 'padding-left',
			'paddingHoverTop'    => 'padding-top',
			'paddingHoverRight'  => 'padding-right',
			'paddingHoverBottom' => 'padding-bottom',
			'paddingHoverLeft'   => 'padding-left',
			'alignItems'         => 'align-items',
			'rotation'           => 'transform',
			'rotationHover'      => 'transform',
		);
		
		if ( isset( $property_map[ $key ] ) ) {
			// Handle CSS variable prefix if needed
			if ( ! empty( $meta['varPrefix'] ) ) {
				$suffix = ! empty( $meta['varSuffix'] ) ? $meta['varSuffix'] : '';
				return $meta['varPrefix'] . $property_map[ $key ] . $suffix;
			}
			return $property_map[ $key ];
		}
		
		// Use parent implementation for other properties
		return parent::get_css_property( $key, $meta );
	}
	
	/**
	 * Override getSelector for icon-specific selectors
	 *
	 * @param string $key The property key.
	 * @param array  $meta Component metadata.
	 * @return string The CSS selector.
	 */
	protected function get_selector( $key, $meta ) {
		$selector = parent::get_selector( $key, $meta );
		
		// Some icon properties might need specific selectors
		// For example, the icon SVG itself might need targeting
		if ( strpos( $key, 'iconSize' ) !== false || strpos( $key, 'iconLineWidth' ) !== false ) {
			// These might need to target the SVG element specifically
			// But this depends on the HTML structure
		}
		
		return $selector;
	}
	
	/**
	 * Get component keys for icon
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'iconSize',
			'iconLineWidth',
			'color',
			'iconSizeHover',
			'iconLineWidthHover',
			'colorHover',
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'paddingHoverTop',
			'paddingHoverRight',
			'paddingHoverBottom',
			'paddingHoverLeft',
			'alignItems',
			'rotation',
			'rotationHover',
		);
	}
}