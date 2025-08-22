<?php
/**
 * Background component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

use KadenceWP\KadenceBlocks\Frontend\Utils\Pattern_Options;
use KadenceWP\KadenceBlocks\Frontend\Utils\Divider_Options;
use KadenceWP\KadenceBlocks\Frontend\Utils\Mask_Options;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Background component CSS generator
 * Handles layered backgrounds including colors, images, gradients, masks, patterns, etc.
 */
class Background_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'background';
	
	/**
	 * Generate CSS for background component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Background components use layers
		if ( ! empty( $meta['hasLayers'] ) ) {
			$this->generate_layered_background( $attribute_name, $meta, $block_instance );
		} else {
			// Simple background without layers
			$this->generate_simple_background( $resolved_values, $meta );
		}
	}
	
	/**
	 * Generate CSS for layered backgrounds
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	protected function generate_layered_background( $attribute_name, $meta, $block_instance ) {
		$attributes = $this->css_engine->get_current_attributes();
		$global_styles_ids = $this->css_engine->get_global_styles_ids( $attributes, $block_instance );
		
		// Get layers from attributes or presets
		$layers_preset = ! empty( $attributes[ $attribute_name ]['preset'] ) ? $attributes[ $attribute_name ]['preset'] : '';
		
		if ( ! empty( $layers_preset ) ) {
			$preset_data = $this->css_engine->get_preset_data( $layers_preset, 'background', $global_styles_ids );
			$layers = ! empty( $preset_data['attributes']['layers'] ) ? $preset_data['attributes']['layers'] : array();
		} else {
			$layers = ! empty( $attributes[ $attribute_name ]['layers'] ) ? $attributes[ $attribute_name ]['layers'] : array();
		}
		
		if ( ! empty( $layers ) && is_array( $layers ) ) {
			//before we start processing layers, add the selector suffix to the current base selector
			$base_selector = $this->get_current_selector();
			$this->set_selector( $base_selector . ( isset( $meta['selectorSuffix'] ) ? $meta['selectorSuffix'] : '' ) );
			
			// Reverse layers for proper stacking order
			$reversed_layers = array_reverse( $layers );
			foreach ( $reversed_layers as $index => $layer ) {
				$this->process_background_layer( $layer, $index, $meta, $attributes, $block_instance, $global_styles_ids );
			}

			//reset the selector to the original base selector
			$this->set_selector( $base_selector );
		}
	}
	
	/**
	 * Generate CSS for simple background (non-layered)
	 *
	 * @param array $resolved_values Pre-resolved component values.
	 * @param array $meta Component metadata.
	 * @return void
	 */
	protected function generate_simple_background( $resolved_values, $meta ) {
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( empty( $resolved_value['value'] ) ) {
				continue;
			}
			
			$css_value = $this->process_background_value( $key, $resolved_value['value'] );
			if ( $css_value ) {
				$resolved_value['value'] = $css_value;
				$this->apply_property( $key, $resolved_value, $meta );
			}
		}
	}
	
	/**
	 * Process a single background layer
	 *
	 * @param array    $layer The layer data.
	 * @param int      $index The layer index.
	 * @param array    $meta Component metadata.
	 * @param array    $attributes The block attributes.
	 * @param WP_Block $block_instance The block instance.
	 * @param array    $global_styles_ids Global style IDs.
	 * @return void
	 */
	protected function process_background_layer( $layer, $index, $meta, $attributes, $block_instance, $global_styles_ids ) {
		$current_selector = $this->get_current_selector();
		$meta_class_prefix = isset( $meta['classPrefix'] ) ? $meta['classPrefix'] : 'kbs-bg-style-';
		
		// Background type can't change per device so we just get the desktop value
		$background_type = $this->get_layer_device_value( $layer, 'type', 'desktop' ) ?: 'color';
		$has_effects = false;
		$has_forced_layer_type = false;
		
		if ( $index === 0 ) {
			if ( $this->has_layer_value( $layer, 'opacity', '100%' ) || 
				 $this->has_layer_value( $layer, 'opacityHover', '100%' ) || 
				 $this->has_layer_value( $layer, 'blendMode', 'normal' ) || 
				 $this->has_layer_value( $layer, 'blendModeHover', 'normal' ) || 
				 apply_filters( 'kbs_always_use_bg_layers', false ) ) {
				$has_effects = true;
			}
			if ( $background_type === 'video' || $background_type === 'mask' ) {
				$has_forced_layer_type = true;
			}
		}
		
		// Determine selector for this layer
		$temp_selector = $current_selector;
		if ( $index === 0 && ! $has_forced_layer_type && ! $has_effects ) {
			$this->set_selector( $current_selector );
		} else {
			$temp_selector = $current_selector . ' > .' . $meta_class_prefix . $index;
			$this->set_selector( $temp_selector );
		}
		
		// Process each device
		foreach ( $this->css_engine->device_options as $device_option ) {
			$device_name = isset( $device_option['key'] ) ? $device_option['key'] : '';
			if ( ! $device_name || ! isset( $layer[ $device_name ] ) || ! is_array( $layer[ $device_name ] ) ) {
				continue;
			}
			
			$this->set_media_state( $device_name );
			$device_attributes = $layer[ $device_name ];
			
            // Process opacity and blend mode
            $this->apply_opacity_and_blend( $device_attributes );
			
			// Process based on background type
			switch ( $background_type ) {
                case 'color':
                    $this->process_color_background( $device_attributes );
                    break;
                case 'image':
                    $this->process_image_background( $device_attributes );
                    break;
                case 'gradient':
                    $this->process_gradient_background( $device_attributes );
                    break;
				case 'mask':
					$this->process_mask_background( $layer, $device_name, $temp_selector, $meta_class_prefix, $index );
					break;
				case 'backdrop':
					$this->process_backdrop_background( $layer, $device_name );
					break;
				case 'video':
					// Video backgrounds are handled in HTML output
					if ( ! empty( $device_attributes['color'] ) ) {
						$this->add_property( 'background-color', $this->css_engine->sanitize_color( $device_attributes['color'] ) );
					}
					break;
			}
			
			// Handle hover states
			if ( $index === 0 && ! $has_forced_layer_type && ! $has_effects ) {
				$this->set_selector( $current_selector . ':hover' );
			} else {
				$this->set_selector( $current_selector . ':hover > .' . $meta_class_prefix . $index );
			}
			
			// Process hover properties
            $this->apply_opacity_and_blend( $device_attributes, true );
			
			// Process hover colors based on type
			if ( ! empty( $device_attributes['colorHover'] ) && 
				 ( $background_type === 'color' || $background_type === 'image' || 
				   $background_type === 'video' || $background_type === 'gradient' ) ) {
				$this->add_property( 'background-color', $this->css_engine->sanitize_color( $device_attributes['colorHover'] ) );
			}
			
			// Handle backdrop hover
			if ( $background_type === 'backdrop' ) {
				$this->process_backdrop_hover( $layer, $device_name );
			}
			
			// Reset selector for next iteration
			$this->set_selector( $temp_selector );
		}
		
		// Reset to original selector and media state
		$this->set_selector( $current_selector );
		$this->set_media_state( 'desktop' );
	}
	
	/**
	 * Process color background
	 *
	 * @param array $attributes Device-specific attributes.
	 * @return void
	 */
	protected function process_color_background( $attributes ) {
		if ( ! empty( $attributes['color'] ) ) {
			$this->add_property( 'background-color', $this->css_engine->sanitize_color( $attributes['color'] ) );
		}
	}

    /**
     * Shared: apply opacity and blend mode
     */
    protected function apply_opacity_and_blend( $attributes, $is_hover = false ) {
		$suffix = $is_hover ? 'Hover' : '';
		
        if ( ! empty( $attributes['opacity' . $suffix] ) ) {
            $this->add_property( 'opacity', $attributes['opacity' . $suffix] );
        }
        if ( ! empty( $attributes['blendMode' . $suffix] ) ) {
            $this->add_property( 'mix-blend-mode', $attributes['blendMode' . $suffix] );
        }
    }
	
	/**
	 * Process image background
	 *
	 * @param array $attributes Device-specific attributes.
	 * @return void
	 */
	protected function process_image_background( $attributes ) {
		if ( ! empty( $attributes['color'] ) ) {
			$this->add_property( 'background-color', $this->css_engine->sanitize_color( $attributes['color'] ) );
		}
		
		if ( ! empty( $attributes['image'] ) ) {
			$this->add_property( 'background-image', 'url(' . $attributes['image'] . ')' );
			
			if ( ! empty( $attributes['position'] ) ) {
				$this->add_property( 'background-position', $attributes['position'] );
			}
			if ( ! empty( $attributes['size'] ) ) {
				$this->add_property( 'background-size', $attributes['size'] );
			}
			if ( ! empty( $attributes['repeat'] ) ) {
				$this->add_property( 'background-repeat', $attributes['repeat'] );
			}
			if ( ! empty( $attributes['attachment'] ) ) {
				$attachment = $attributes['attachment'] === 'parallax' ? 'fixed' : $attributes['attachment'];
				$this->add_property( 'background-attachment', $attachment );
			}
		}
	}
	
	/**
	 * Process gradient background
	 *
	 * @param array $attributes Device-specific attributes.
	 * @return void
	 */
	protected function process_gradient_background( $attributes ) {
		if ( ! empty( $attributes['color'] ) ) {
			$this->add_property( 'background-color', $this->css_engine->sanitize_color( $attributes['color'] ) );
		}
		if ( ! empty( $attributes['gradient'] ) ) {
			$this->add_property( 'background-image', $attributes['gradient'] );
		}
	}
	
	/**
	 * Process mask background
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_name The device name.
	 * @param string $temp_selector The temporary selector.
	 * @param string $meta_class_prefix The meta class prefix.
	 * @param int    $index The layer index.
	 * @return void
	 */
	protected function process_mask_background( $layer, $device_name, $temp_selector, $meta_class_prefix, $index ) {
		$current_selector = $this->get_current_selector();
		$mask_type = $this->get_layer_device_value( $layer, 'maskType', $device_name ) ?: 'mask';
		$device_attributes = isset( $layer[ $device_name ] ) ? $layer[ $device_name ] : array();
		
		if ( ! empty( $device_attributes['color'] ) ) {
			$this->add_property( 'background-color', $this->css_engine->sanitize_color( $device_attributes['color'] ) );
			$this->add_property( '--kbs-mask-bg', $this->css_engine->sanitize_color( $device_attributes['color'] ) );
		}
		
		if ( ! empty( $device_attributes['maskColor'] ) ) {
			$this->add_property( '--kbs-mask-color', $this->css_engine->sanitize_color( $device_attributes['maskColor'] ) );
		}
		
		// Process different mask types
		switch ( $mask_type ) {
			case 'pattern':
				$this->process_pattern_mask( $layer, $device_name, $temp_selector, $device_attributes );
				break;
			case 'divider':
				$this->process_divider_mask( $layer, $device_name, $temp_selector, $device_attributes );
				break;
			default:
				// Standard mask handling
				$mask_slug = ! empty( $device_attributes['mask'] ) ? $device_attributes['mask'] : '';
				if ( ! empty( $mask_slug ) ) {
					$this->set_selector( $current_selector . ' > .' . $meta_class_prefix . $index . ' .kbs-pattern-mask-svg' );
					$mask_inverted = ! empty( $device_attributes['maskInverted'] ) ? $device_attributes['maskInverted'] : '';
					$mask_size = ! empty( $device_attributes['maskSize'] ) ? $device_attributes['maskSize'] : '';
					$mask_ratio = $mask_size === 'stretch' ? 'none' : 'xMidYMid meet';
					$mask_subset = $mask_inverted === 'enabled' ? 'inverted' : 'normal';
					$mask_data = Mask_Options::get_mask( $mask_slug, $mask_subset );
					
					if ( ! empty( $mask_data['path'] ) ) {
						if ( ! empty( $device_attributes['maskColor'] ) ) {
							$this->add_property( 'background', $this->css_engine->sanitize_color( $device_attributes['maskColor'] ) );
						} else if ( $device_name === 'desktop' ) {
							$this->add_property( 'background', 'var(--kbs-colors-palette3)' );
						}
						
						$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . rawurlencode( '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="' . esc_attr( $mask_ratio ) . '" viewBox="0 0 1920 1200" fill="black"><path d="' . esc_attr( $mask_data['path'] ) . '" /></svg>' ) . '")' );
						$this->add_property( 'mask-repeat', 'no-repeat' );
						
						if ( $mask_size === 'contain' ) {
							$this->add_property( 'mask-size', 'contain' );
						} else {
							$this->add_property( 'mask-size', 'cover' );
						}
						
						// Handle mask position
						$position_x = 'center';
						$position_y = 'center';
						if ( ! empty( $device_attributes['alignX'] ) ) {
							if ( $device_attributes['alignX'] === 'min' ) {
								$position_x = 'left';
							} else if ( $device_attributes['alignX'] === 'max' ) {
								$position_x = 'right';
							}
						}
						if ( ! empty( $device_attributes['alignY'] ) ) {
							if ( $device_attributes['alignY'] === 'min' ) {
								$position_y = 'top';
							} else if ( $device_attributes['alignY'] === 'max' ) {
								$position_y = 'bottom';
							}
						}
						$this->add_property( 'mask-position', $position_x . ' ' . $position_y );
						
						// Handle flipping
						$flip_x = ! empty( $device_attributes['flipX'] ) && $device_attributes['flipX'] === 'enabled';
						$flip_y = ! empty( $device_attributes['flipY'] ) && $device_attributes['flipY'] === 'enabled';
						if ( $flip_x || $flip_y ) {
							$scale_x = $flip_x ? '-1' : '1';
							$scale_y = $flip_y ? '-1' : '1';
							$this->add_property( 'transform', 'scaleX(' . $scale_x . ') scaleY(' . $scale_y . ')' );
						}
					}
					$this->set_selector( $temp_selector );
				}
				break;
		}
	}
	
	/**
	 * Process backdrop filter background
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_name The device name.
	 * @return void
	 */
	protected function process_backdrop_background( $layer, $device_name ) {
		$device_attributes = isset( $layer[ $device_name ] ) ? $layer[ $device_name ] : array();
		$backdrop_filter = ! empty( $device_attributes['backdropFilter'] ) ? $device_attributes['backdropFilter'] : '';
		
		if ( $backdrop_filter && $backdrop_filter !== 'none' ) {
			$unit = $backdrop_filter === 'blur' ? 'px' : ( $backdrop_filter === 'hue-rotate' ? 'deg' : '%' );
			$backdrop_size = ! empty( $device_attributes['backdropSize'] ) ? $device_attributes['backdropSize'] : '1';
			if ( $backdrop_filter === 'hue-rotate' ) {
				$backdrop_size = $backdrop_size * 3.6;
			}
			$this->add_property( 'backdrop-filter', $backdrop_filter . '(' . $backdrop_size . $unit . ')' );
		}
	}
	
	/**
	 * Process backdrop hover state
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_name The device name.
	 * @return void
	 */
	protected function process_backdrop_hover( $layer, $device_name ) {
		$device_attributes = isset( $layer[ $device_name ] ) ? $layer[ $device_name ] : array();
		$backdrop_filter_hover = ! empty( $device_attributes['backdropFilterHover'] ) ? $device_attributes['backdropFilterHover'] : '';
		
		if ( $backdrop_filter_hover ) {
			if ( $backdrop_filter_hover === 'none' ) {
				$this->add_property( 'backdrop-filter', 'none' );
			} else {
				$hover_unit = $backdrop_filter_hover === 'blur' ? 'px' : ( $backdrop_filter_hover === 'hue-rotate' ? 'deg' : '%' );
				$backdrop_size = ! empty( $device_attributes['backdropSize'] ) ? $device_attributes['backdropSize'] : '1';
				$backdrop_size_hover = ! empty( $device_attributes['backdropSizeHover'] ) ? $device_attributes['backdropSizeHover'] : $backdrop_size;
				
				if ( $backdrop_filter_hover === 'hue-rotate' ) {
					$backdrop_size_hover = $backdrop_size_hover * 3.6;
				}
				$this->add_property( 'backdrop-filter', $backdrop_filter_hover . '(' . $backdrop_size_hover . $hover_unit . ')' );
			}
		}
	}
	
	/**
	 * Process pattern mask
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_name The device name.
	 * @param string $temp_selector The temporary selector.
	 * @param array  $device_attributes Device-specific attributes.
	 * @return void
	 */
	protected function process_pattern_mask( $layer, $device_name, $temp_selector, $device_attributes ) {
		$current_selector = $this->get_current_selector();
		$background_pattern = ! empty( $device_attributes['pattern'] ) ? $device_attributes['pattern'] : '';
		
		if ( ! $background_pattern ) {
			return;
		}
		
		$pattern_size = ! empty( $device_attributes['patternSize'] ) ? $device_attributes['patternSize'] : '20';
		$pattern_position = ! empty( $device_attributes['patternPosition'] ) ? $device_attributes['patternPosition'] : 'top left';
		$mask_color = ! empty( $device_attributes['maskColor'] ) ? $device_attributes['maskColor'] : '';
		
		// Set the pattern size CSS variable
		$this->add_property( '--kbs-pattern-size', $pattern_size );
		
		// Get the pattern data
		$pattern = Pattern_Options::get_pattern( $background_pattern );
		
		if ( $pattern && ! empty( $pattern['svg'] ) ) {
			// Target the pattern SVG element
			$this->set_selector( $temp_selector . ' .kbs-pattern-svg' );
			
			// Set the background color
			if ( $mask_color ) {
				$this->add_property( 'background', $this->css_engine->sanitize_color( $mask_color ) );
			} else {
				$this->add_property( 'background', 'var(--kbs-colors-palette3, #1A202C)' );
			}
			
			// Set the mask properties
			$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . rawurlencode( $pattern['svg'] ) . '")' );
			$this->add_property( 'mask-repeat', 'repeat' );
			
			// Calculate mask size based on pattern size
			$pattern_base_size = ! empty( $pattern['size'] ) ? $pattern['size'] : 10;
			$this->add_property( 'mask-size', 'calc( (1px * ' . $pattern_base_size . ') * (var(--kbs-pattern-size) / 20))' );
			$this->add_property( 'mask-position', $pattern_position );
			
			// Reset selector
			$this->set_selector( $temp_selector );
		}
	}
	
	/**
	 * Process divider mask
	 *
	 * @param array  $layer The layer data.
	 * @param string $device_name The device name.
	 * @param string $temp_selector The temporary selector.
	 * @param array  $device_attributes Device-specific attributes.
	 * @return void
	 */
	protected function process_divider_mask( $layer, $device_name, $temp_selector, $device_attributes ) {
		$current_selector = $this->get_current_selector();
		$background_divider = ! empty( $device_attributes['divider'] ) ? $device_attributes['divider'] : '';
		$divider_width = ! empty( $device_attributes['dividerWidth'] ) ? $device_attributes['dividerWidth'] : '';
		$divider_height = ! empty( $device_attributes['dividerHeight'] ) ? $device_attributes['dividerHeight'] : '';
		$divider_position = ! empty( $device_attributes['dividerPosition'] ) ? $device_attributes['dividerPosition'] : 'bottom';
		$mask_color = ! empty( $device_attributes['maskColor'] ) ? $device_attributes['maskColor'] : '';
		
		// Determine if it's a vertical or horizontal divider
		$divider_side = ( $divider_position === 'left' || $divider_position === 'right' ) ? 'vertical' : 'horizontal';
		
		// Set CSS variables for width and height if provided
		if ( $divider_width ) {
			$this->add_property( '--kbs-divider-width', $divider_width );
		}
		if ( $divider_height ) {
			$this->add_property( '--kbs-divider-height', $divider_height );
		}
		
		if ( $background_divider ) {
			// Get the divider data
			$divider_object = Divider_Options::get_divider( $background_divider, $divider_side );
			
			if ( $divider_object && ! empty( $divider_object['svg'] ) ) {
				// Target the divider SVG element
				$this->set_selector( $temp_selector . ' .kbs-divider-svg-wrapper .kbs-divider-svg' );
				
				// Set the background color
				if ( $mask_color ) {
					$this->add_property( 'background', $this->css_engine->sanitize_color( $mask_color ) );
				} else {
					$this->add_property( 'background', 'var(--kbs-colors-palette3, #1A202C)' );
				}
				
				// Set the mask properties
				$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . rawurlencode( $divider_object['svg'] ) . '")' );
				$this->add_property( 'mask-repeat', 'no-repeat' );
				
				// Reset selector
				$this->set_selector( $temp_selector );
			}
		}
	}
	
	/**
	 * Process simple background value
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The value.
	 * @return string
	 */
	protected function process_background_value( $key, $value ) {
		switch ( $key ) {
			case 'color':
				return $this->css_engine->sanitize_color( $value );
			case 'image':
				return 'url(' . $value . ')';
			default:
				return $value;
		}
	}
	
	/**
	 * Override getCssProperty for background-specific mappings
	 *
	 * @param string $key The attribute key.
	 * @param array  $meta Component metadata.
	 * @return string The CSS property name.
	 */
	protected function get_css_property( $key, $meta ) {
		// Background component has special mappings where 'color' maps to 'background-color'
		$property_map = array(
			'color'      => 'background-color',
			'image'      => 'background-image',
			'size'       => 'background-size',
			'position'   => 'background-position',
			'repeat'     => 'background-repeat',
			'attachment' => 'background-attachment',
			'gradient'   => 'background-image',
		);
		
		if ( isset( $property_map[ $key ] ) ) {
			// Handle CSS variables with varPrefix
			if ( ! empty( $meta['varPrefix'] ) ) {
				$suffix = ! empty( $meta['varSuffix'] ) ? $meta['varSuffix'] : '';
				return $meta['varPrefix'] . $property_map[ $key ] . $suffix;
			}
			return $property_map[ $key ];
		}
		
		return parent::get_css_property( $key, $meta );
	}
	
	/**
	 * Get device value from layer
	 *
	 * @param array  $layer The layer data.
	 * @param string $attribute_name The attribute name.
	 * @param string $device_name The device name.
	 * @return mixed
	 */
	protected function get_layer_device_value( $layer, $attribute_name, $device_name ) {
		if ( empty( $layer ) || ! is_array( $layer ) ) {
			return '';
		}
		return ! empty( $layer[ $device_name ][ $attribute_name ] ) ? $layer[ $device_name ][ $attribute_name ] : '';
	}
	
	/**
	 * Check if layer has a value
	 *
	 * @param array  $layer The layer data.
	 * @param string $attribute_name The attribute name.
	 * @param string $default_value The default value to check against.
	 * @return bool
	 */
	protected function has_layer_value( $layer, $attribute_name, $default_value = '' ) {
		if ( empty( $layer ) || ! is_array( $layer ) ) {
			return false;
		}
		
		foreach ( $this->css_engine->device_options as $device_option ) {
			$device_key = isset( $device_option['key'] ) ? $device_option['key'] : '';
			if ( $device_key && isset( $layer[ $device_key ][ $attribute_name ] ) && 
				 '' !== $layer[ $device_key ][ $attribute_name ] && 
				 $default_value !== $layer[ $device_key ][ $attribute_name ] ) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Get component keys for background
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'color',
			'gradient', 
			'image',
			'size',
			'position',
			'repeat',
			'attachment'
		);
	}
}