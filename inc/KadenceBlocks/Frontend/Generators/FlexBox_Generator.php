<?php
/**
 * FlexBox component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * FlexBox component CSS generator
 */
class FlexBox_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'flexBox';
	
	/**
	 * Generate CSS for flexbox component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Process each flexbox property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_flexbox_property( $key, $resolved_value, $meta );
			}
		}
	}
	
	/**
	 * Apply a flexbox property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @return void
	 */
	protected function apply_flexbox_property( $key, $resolved_value, $meta ) {
		$css_value = $this->process_flexbox_value( $key, $resolved_value['value'] );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Use the inherited method for applying the property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
	}
	
	/**
	 * Process flexbox value based on property type
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @return string The processed CSS value.
	 */
	protected function process_flexbox_value( $key, $value ) {
		switch ( $key ) {
			case 'rowGap':
			case 'columnGap':
				// Handle gap values
				if ( $this->css_engine->is_variable_gap_value( $value ) ) {
					return $this->css_engine->get_variable_gap_value( $value );
				}
				// If numeric, add 'px' unit
				if ( is_numeric( $value ) ) {
					return $value . 'px';
				}
				return $value;
				
			case 'flexDirection':
			case 'flexWrap':
			case 'justifyContent':
			case 'alignItems':
			case 'alignContent':
				// These are used as-is
				return $value;
				
			default:
				return $value;
		}
	}
	
	/**
	 * Get component keys for flexbox
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'flexDirection',
			'justifyContent',
			'alignItems',
			'alignContent',
			'flexWrap',
			'rowGap',
			'columnGap',
		);
		}
}