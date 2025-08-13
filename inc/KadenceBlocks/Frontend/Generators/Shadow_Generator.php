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
     * Default values for box/text shadows
     * Using a single structure keeps things compact.
     */
    protected $shadow_defaults = array(
        'box' => array(
            'color'  => 'var(--kbs-shadow-default-color,#00000033)',
            'x'      => 'var(--kbs-shadow-default-x,6px)',
            'y'      => 'var(--kbs-shadow-default-y,6px)',
            'blur'   => 'var(--kbs-shadow-default-blur,9px)',
            'spread' => 'var(--kbs-shadow-default-spread,0)',
        ),
        'text' => array(
            'color' => 'var(--kbs-text-shadow-default-color,#00000066)',
            'x'     => 'var(--kbs-text-shadow-default-x,2px)',
            'y'     => 'var(--kbs-text-shadow-default-y,2px)',
            'blur'  => 'var(--kbs-text-shadow-default-blur,2px)',
        ),
    );
	
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
		// Check if debugging is enabled for this component
		if ( ! empty( $meta['debug'] ) && $meta['debug'] === true ) {
			$this->output_generator_debug( $attribute_name, $meta, $resolved_values );
		}
		
		// If this component has layers and resolved_values is empty, we need to handle layers
		if ( ! empty( $meta['hasLayers'] ) && empty( $resolved_values ) ) {
			$this->generate_layered_shadows( $attribute_name, $meta, $block_instance );
			return;
		}
		
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
	 * Generate CSS for layered shadows
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	protected function generate_layered_shadows( $attribute_name, $meta, $block_instance ) {
		// For CSS variables, we need to output a variable even if there are no layers
		// This ensures the CSS fallback pattern works correctly
		if ( ! empty( $meta['varPrefix'] ) ) {
			// Get the attributes from the CSS engine
			$attributes = $this->css_engine->get_current_attributes();
			
			// Get device options for responsive CSS
			$device_options = $this->css_engine->device_options;
			if ( empty( $device_options ) ) {
				$device_options = array( array( 'key' => 'desktop' ) );
			}
			
			// Process each device
			foreach ( $device_options as $device_option ) {
				$device_key = isset( $device_option['key'] ) ? $device_option['key'] : 'desktop';
				
				// Set the media state for this device
				$this->css_engine->set_media_state( $device_key );
				
				// Check if we have shadow data for this attribute
				$shadow_value = '';
				
				// Check both the attribute name and without 'Hover' suffix for data
				$shadow_data_key = $attribute_name;
				$shadow_attribute = null;
				
				if ( ! empty( $attributes[ $attribute_name ] ) ) {
					$shadow_attribute = $attributes[ $attribute_name ];
				} elseif ( substr( $attribute_name, -5 ) === 'Hover' ) {
					// If this is a hover attribute but no data, check the base attribute
					$base_attribute = substr( $attribute_name, 0, -5 );
					if ( ! empty( $attributes[ $base_attribute ] ) ) {
						// Use the base shadow for hover if no specific hover shadow is defined
						// This ensures hover state inherits from non-hover state
						$shadow_attribute = $attributes[ $base_attribute ];
					}
				}
				
				if ( ! empty( $shadow_attribute ) && ! empty( $shadow_attribute['layers'] ) ) {
					// We have layers, format them into a shadow string
					$layers = $shadow_attribute['layers'];
					$shadow_parts = array();
					
					// Process each layer for this device
					foreach ( $layers as $layer ) {
						if ( ! empty( $layer ) ) {
							// Get values for this device, falling back to parent devices
							$shadow_data = $this->get_device_shadow_data( $layer, $device_key, $device_options );
							
							if ( $shadow_data ) {
								$formatted = $this->format_layer_shadow( $shadow_data, $attribute_name );
								if ( ! empty( $formatted ) ) {
									$shadow_parts[] = $formatted;
								}
							}
						}
					}
					
					if ( ! empty( $shadow_parts ) ) {
						$shadow_value = implode( ', ', array_reverse( $shadow_parts ) );
					}
				}
				
				// Use the base generator's method to get the CSS property
				$property = $this->get_css_property( $attribute_name, $meta );
				
				// For hover attributes, only output if we have an actual shadow value
				// This allows the CSS fallback pattern to work correctly
				$is_hover = substr( $attribute_name, -5 ) === 'Hover';
				
				if ( ! empty( $shadow_value ) ) {
					// We have a shadow value, output it
					$this->add_property( $property, $shadow_value );
				} elseif ( ! $is_hover ) {
					// For non-hover attributes, always output a variable (even if empty)
					// This ensures the base shadow variable exists
					$this->add_property( $property, 'initial' );
				}
				// For hover attributes with no value, don't output anything
				// This allows CSS to fall back to the non-hover value
			}
			
			// Reset media state back to desktop
			$this->css_engine->set_media_state( 'desktop' );
		}
	}
	
	/**
	 * Get shadow data for a specific device with fallback
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_key The current device key.
	 * @param array  $device_options All device options.
	 * @return array|null The shadow data or null.
	 */
	protected function get_device_shadow_data( $layer, $device_key, $device_options ) {
		// First check if current device has data
		if ( ! empty( $layer[ $device_key ] ) ) {
			return $layer[ $device_key ];
		}
		
		// Find current device index
		$current_index = -1;
		foreach ( $device_options as $index => $option ) {
			if ( $option['key'] === $device_key ) {
				$current_index = $index;
				break;
			}
		}
		
		// Fall back to parent devices
		if ( $current_index > 0 ) {
			for ( $i = $current_index - 1; $i >= 0; $i-- ) {
				$parent_device = $device_options[ $i ]['key'];
				if ( ! empty( $layer[ $parent_device ] ) ) {
					return $layer[ $parent_device ];
				}
			}
		}
		
		return null;
	}
	
	/**
	 * Format a layer shadow from layer data
	 *
	 * @param array  $shadow_data The shadow layer data.
	 * @param string $attribute_name The attribute name.
	 * @return string The formatted shadow value.
	 */
	protected function format_layer_shadow( $shadow_data, $attribute_name ) {
		// Check if this is a text shadow - look for 'textshadow' in the lowercase attribute name
        $is_text_shadow = strpos( strtolower( $attribute_name ), 'textshadow' ) !== false;
        $defaults = $is_text_shadow ? $this->shadow_defaults['text'] : $this->shadow_defaults['box'];
		
		// Get values with proper defaults
		// If value is set and is 0 or a valid value, use it; otherwise use the CSS variable with fallback
		$x = isset( $shadow_data['x'] ) && ( $shadow_data['x'] !== '' && $shadow_data['x'] !== null ) ? 
			$this->add_unit( $shadow_data['x'] ) : 
			$defaults['x'];
		$y = isset( $shadow_data['y'] ) && ( $shadow_data['y'] !== '' && $shadow_data['y'] !== null ) ? 
			$this->add_unit( $shadow_data['y'] ) : 
			$defaults['y'];
		$blur = isset( $shadow_data['blur'] ) && ( $shadow_data['blur'] !== '' && $shadow_data['blur'] !== null ) ? 
			$this->add_unit( $shadow_data['blur'] ) : 
			$defaults['blur'];
		$color = isset( $shadow_data['color'] ) && ! empty( $shadow_data['color'] ) ? 
			$this->css_engine->sanitize_color( $shadow_data['color'] ) : 
			$defaults['color'];
		
		if ( empty( $color ) ) {
			return '';
		}
		
		// Build shadow string with correct CSS order: [inset] x y blur [spread] color
		$shadow_string = '';
		
		// Box shadow can have spread and inset
		if ( ! $is_text_shadow ) {
			$spread = isset( $shadow_data['spread'] ) && ( $shadow_data['spread'] !== '' && $shadow_data['spread'] !== null ) ? 
				$this->add_unit( $shadow_data['spread'] ) : 
				$defaults['spread'];
			$inset = isset( $shadow_data['inset'] ) && $shadow_data['inset'] ? 'inset ' : '';
			
			$shadow_string = $inset . $x . ' ' . $y . ' ' . $blur;
			if ( ! empty( $spread ) ) {
				$shadow_string .= ' ' . $spread;
			}
			$shadow_string .= ' ' . $color;
		} else {
			// Text shadow format (no spread or inset)
			$shadow_string = $x . ' ' . $y . ' ' . $blur . ' ' . $color;
		}
		
		return trim( $shadow_string );
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
		// Determine if this is a text shadow or box shadow
        $is_text_shadow = ( $shadow_type === 'textshadow' || $shadow_type === 'text-shadow' );
        $defaults = $is_text_shadow ? $this->shadow_defaults['text'] : $this->shadow_defaults['box'];
		
		// Get values with proper defaults
		$h_offset = isset( $shadow['hOffset'] ) && ( $shadow['hOffset'] !== '' && $shadow['hOffset'] !== null ) ? 
			$this->add_unit( $shadow['hOffset'] ) : 
			$defaults['x'];
		$v_offset = isset( $shadow['vOffset'] ) && ( $shadow['vOffset'] !== '' && $shadow['vOffset'] !== null ) ? 
			$this->add_unit( $shadow['vOffset'] ) : 
			$defaults['y'];
		$blur = isset( $shadow['blur'] ) && ( $shadow['blur'] !== '' && $shadow['blur'] !== null ) ? 
			$this->add_unit( $shadow['blur'] ) : 
			$defaults['blur'];
		$color = isset( $shadow['color'] ) && ! empty( $shadow['color'] ) ? 
			$this->css_engine->sanitize_color( $shadow['color'] ) : 
			$defaults['color'];
		
		// Box shadow can have spread and inset, text shadow cannot
		if ( ! $is_text_shadow ) {
			$spread = isset( $shadow['spread'] ) && ( $shadow['spread'] !== '' && $shadow['spread'] !== null ) ? 
				$this->add_unit( $shadow['spread'] ) : 
				$defaults['spread'];
			$inset = isset( $shadow['inset'] ) && $shadow['inset'] ? 'inset ' : '';
			
			if ( ! empty( $spread ) ) {
				return $inset . $h_offset . ' ' . $v_offset . ' ' . $blur . ' ' . $spread . ( ! empty( $color ) ? ' ' . $color : '' );
			}
			// Box shadow without spread
			return $inset . $h_offset . ' ' . $v_offset . ' ' . $blur . ( ! empty( $color ) ? ' ' . $color : '' );
		}
		
		// Text shadow format (no spread or inset)
		return $h_offset . ' ' . $v_offset . ' ' . $blur . ( ! empty( $color ) ? ' ' . $color : '' );
	}
	
	/**
	 * Add unit to numeric value
	 *
	 * @param mixed $value The value to add unit to.
	 * @return string The value with unit.
	 */
	
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