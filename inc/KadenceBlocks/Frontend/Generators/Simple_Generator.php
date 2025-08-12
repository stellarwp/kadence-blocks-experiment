<?php
/**
 * Simple component CSS generator
 * Handles components that just need a simple output function applied
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Simple component CSS generator
 * Handles color, padding, margin, and other simple components
 */
class Simple_Generator extends Base_Generator {
	
	/**
	 * Map of component types to their output functions
	 *
	 * @var array
	 */
	protected static $output_functions = array();
	
	/**
	 * Constructor
	 *
	 * @param object $css_engine The main CSS Engine instance.
	 */
	public function __construct( $css_engine ) {
		parent::__construct( $css_engine );
		
		// Define output functions for each component type
		self::$output_functions = array(
			'color'   => array( $this, 'get_color_output' ),
			'padding' => array( $this, 'get_spacing_output' ),
			'margin'  => array( $this, 'get_spacing_output' ),
		);
	}
	
	/**
	 * Generate CSS for simple component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		$component_type = isset( $meta['component'] ) ? $meta['component'] : '';
		$output_fn = isset( self::$output_functions[ $component_type ] ) ? self::$output_functions[ $component_type ] : null;
		
		$this->generate_simple( $attribute_name, $meta, $resolved_values, $output_fn );
	}
	
	/**
	 * Get color output
	 *
	 * @param mixed $value The color value.
	 * @return string The processed color value.
	 */
	protected function get_color_output( $value ) {
		return $this->css_engine->sanitize_color( $value );
	}
	
	/**
	 * Get spacing output
	 *
	 * @param mixed $value The spacing value.
	 * @return string The processed spacing value.
	 */
	protected function get_spacing_output( $value ) {
		if ( $this->css_engine->is_variable_spacing_value( $value ) ) {
			return $this->css_engine->get_variable_spacing_value( $value );
		}
		
		// If numeric, add 'px' unit
		if ( is_numeric( $value ) ) {
			return $value . 'px';
		}
		
		return $value;
	}
}