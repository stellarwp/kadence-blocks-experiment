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
			// Color components
			'color'       => array( $this, 'get_color_output' ),
			
			// Spacing components
			'padding'     => array( $this, 'get_spacing_output' ),
			'margin'      => array( $this, 'get_spacing_output' ),
			
			// FlexBox gap properties
			'rowGap'      => array( $this, 'get_gap_output' ),
			'columnGap'   => array( $this, 'get_gap_output' ),
			
			// Dimension components
			'maxWidth'    => array( $this, 'get_dimension_output' ),
			'maxHeight'   => array( $this, 'get_dimension_output' ),
			'minWidth'    => array( $this, 'get_dimension_output' ),
			'minHeight'   => array( $this, 'get_dimension_output' ),
			'width'       => array( $this, 'get_dimension_output' ),
			'height'      => array( $this, 'get_dimension_output' ),
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
		
		// Handle flexBox components with multiple properties
		if ( 'flexBox' === $component_type ) {
			foreach ( $resolved_values as $key => $resolved_value ) {
				if ( $this->should_render_value( $resolved_value, $meta ) ) {
					$output_fn = isset( self::$output_functions[ $key ] ) ? self::$output_functions[ $key ] : null;
					$css_value = $output_fn ? call_user_func( $output_fn, $resolved_value['value'] ) : $resolved_value['value'];
					if ( ! empty( $css_value ) ) {
						$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
					}
				}
			}
		}
		// Handle dimension components
		elseif ( in_array( $component_type, array( 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'width', 'height' ), true ) ) {
			$resolved_value = isset( $resolved_values[ $component_type ] ) ? $resolved_values[ $component_type ] : null;
			if ( $resolved_value && $this->should_render_value( $resolved_value, $meta ) ) {
				$output_fn = isset( self::$output_functions[ $component_type ] ) ? self::$output_functions[ $component_type ] : null;
				$css_value = $output_fn ? call_user_func( $output_fn, $resolved_value['value'] ) : $resolved_value['value'];
				if ( ! empty( $css_value ) ) {
					$this->apply_property( $component_type, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
				}
			}
		}
		// Handle transition components (no processing needed)
		elseif ( 'transition' === $component_type ) {
			$this->generate_simple( $attribute_name, $meta, $resolved_values, null );
		}
		// Standard simple component handling
		else {
			$output_fn = isset( self::$output_functions[ $component_type ] ) ? self::$output_functions[ $component_type ] : null;
			$this->generate_simple( $attribute_name, $meta, $resolved_values, $output_fn );
		}
	}
	
	/**
	 * Get color output
	 *
	 * @param mixed $value The color value.
	 * @return string The processed color value.
	 */
	protected function get_color_output( $value ) {
        // If value originates from a preset, keep as-is so typography preset var fallback works upstream
        if ( is_string( $value ) && strpos( $value, 'var(--kbs-' ) === 0 ) {
            return $value;
        }
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
	
	/**
	 * Get gap output
	 *
	 * @param mixed $value The gap value.
	 * @return string The processed gap value.
	 */
	protected function get_gap_output( $value ) {
		if ( $this->css_engine->is_variable_gap_value( $value ) ) {
			return $this->css_engine->get_variable_gap_value( $value );
		}
		
		// If numeric, add 'px' unit
		if ( is_numeric( $value ) ) {
			return $value . 'px';
		}
		
		return $value;
	}
	
	/**
	 * Get dimension output
	 *
	 * @param mixed $value The dimension value.
	 * @return string The processed dimension value.
	 */
	protected function get_dimension_output( $value ) {
		// Check for content width tokens
		if ( $this->css_engine->is_variable_content_width_value( $value ) ) {
			return $this->css_engine->get_variable_content_width_value( $value );
		}
		
		// Handle special values
		if ( 'auto' === $value || 'inherit' === $value || 'initial' === $value || 'unset' === $value ) {
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
}