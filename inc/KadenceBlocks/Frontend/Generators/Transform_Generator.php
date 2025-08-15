<?php
/**
 * Transform component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Transform component CSS generator
 */
class Transform_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'transform';
	
	/**
	 * Generate CSS for transform component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Collect all transform functions
		$transform_functions = array();
		$transform_origin = '';
		
		// Process each transform property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( ! $this->should_render_value( $resolved_value, $meta ) ) {
				continue;
			}
			
			// Handle transform-origin separately
			if ( $key === 'origin' ) {
				$transform_origin = $resolved_value['value'];
				continue;
			}
			
			// Process transform function
			$transform_function = $this->process_transform_function( $key, $resolved_value['value'] );
			if ( ! empty( $transform_function ) ) {
				$transform_functions[] = $transform_function;
			}
		}
		
		// Apply transform property if we have functions
		if ( ! empty( $transform_functions ) ) {
			$transform_value = implode( ' ', $transform_functions );
			$this->add_property( 'transform', $transform_value );
		}
		
		// Apply transform-origin if set
		if ( ! empty( $transform_origin ) ) {
			$this->add_property( 'transform-origin', $transform_origin );
		}
	}
	
	/**
	 * Process transform function
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @return string The processed transform function.
	 */
	protected function process_transform_function( $key, $value ) {
		switch ( $key ) {
			case 'scale':
				return $this->format_scale( $value );
				
			case 'translate':
				return $this->format_translate( $value );
				
			case 'rotate':
				return $this->format_rotate( $value );
				
			case 'skew':
				return $this->format_skew( $value );
				
			default:
				return '';
		}
	}
	
	/**
	 * Format scale transform
	 *
	 * @param mixed $value The scale value.
	 * @return string The formatted scale function.
	 */
	protected function format_scale( $value ) {
		if ( is_array( $value ) ) {
			$x = isset( $value['x'] ) ? $value['x'] : 1;
			$y = isset( $value['y'] ) ? $value['y'] : 1;
			
			if ( $x === $y ) {
				return 'scale(' . $x . ')';
			}
			return 'scale(' . $x . ', ' . $y . ')';
		}
		
		if ( is_numeric( $value ) ) {
			return 'scale(' . $value . ')';
		}
		
		return '';
	}
	
	/**
	 * Format translate transform
	 *
	 * @param mixed $value The translate value.
	 * @return string The formatted translate function.
	 */
	protected function format_translate( $value ) {
		if ( is_array( $value ) ) {
			$x = isset( $value['x'] ) ? $this->add_unit( $value['x'] ) : '0';
			$y = isset( $value['y'] ) ? $this->add_unit( $value['y'] ) : '0';
			$z = isset( $value['z'] ) ? $this->add_unit( $value['z'] ) : null;
			
			if ( $z !== null ) {
				return 'translate3d(' . $x . ', ' . $y . ', ' . $z . ')';
			}
			return 'translate(' . $x . ', ' . $y . ')';
		}
		
		if ( ! empty( $value ) ) {
			return 'translateX(' . $this->add_unit( $value ) . ')';
		}
		
		return '';
	}
	
	/**
	 * Format rotate transform
	 *
	 * @param mixed $value The rotate value.
	 * @return string The formatted rotate function.
	 */
	protected function format_rotate( $value ) {
		if ( is_array( $value ) ) {
			$x = isset( $value['x'] ) ? $value['x'] : 0;
			$y = isset( $value['y'] ) ? $value['y'] : 0;
			$z = isset( $value['z'] ) ? $value['z'] : 0;
			
			// If only Z rotation, use simple rotate
			if ( $x == 0 && $y == 0 && $z != 0 ) {
				return 'rotate(' . $this->add_deg_unit( $z ) . ')';
			}
			
			// Use rotate3d for complex rotations
			if ( $x != 0 || $y != 0 || $z != 0 ) {
				return 'rotate3d(' . $x . ', ' . $y . ', ' . $z . ', ' . $this->add_deg_unit( $value['angle'] ?? 0 ) . ')';
			}
		}
		
		if ( is_numeric( $value ) || is_string( $value ) ) {
			return 'rotate(' . $this->add_deg_unit( $value ) . ')';
		}
		
		return '';
	}
	
	/**
	 * Format skew transform
	 *
	 * @param mixed $value The skew value.
	 * @return string The formatted skew function.
	 */
	protected function format_skew( $value ) {
		if ( is_array( $value ) ) {
			$x = isset( $value['x'] ) ? $this->add_deg_unit( $value['x'] ) : '0';
			$y = isset( $value['y'] ) ? $this->add_deg_unit( $value['y'] ) : '0';
			
			return 'skew(' . $x . ', ' . $y . ')';
		}
		
		if ( ! empty( $value ) ) {
			return 'skewX(' . $this->add_deg_unit( $value ) . ')';
		}
		
		return '';
	}
	
	/**
	 * Add unit to numeric value
	 *
	 * @param mixed $value The value to add unit to.
	 * @return string The value with unit.
	 */
	
	/**
	 * Get component keys for transform
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'scale',
			'translate',
			'rotate',
			'skew',
			'origin',
		);
	}
}