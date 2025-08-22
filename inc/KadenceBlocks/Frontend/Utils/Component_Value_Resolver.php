<?php
/**
 * Component value resolver utility
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Component value resolver utility class
 */
class Component_Value_Resolver {
	
	/**
	 * Get all component keys for a given component type
	 *
	 * @param string $component_type The component type.
	 * @return array List of component keys.
	 */
	public static function get_component_keys( $component_type ) {
		$component_keys_map = array(
			'color'       => array( 'color', 'colorHover' ),
			'border'      => array(
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
			),
			'background'  => array( 'color', 'gradient', 'image', 'size', 'position', 'repeat', 'attachment' ),
			'boxShadow'   => array( 'boxShadow' ),
			'textShadow'  => array( 'textShadow' ),
			'textAlign'   => array( 'textAlign' ),
			'flexBox'     => array( 'flexDirection', 'justifyContent', 'alignItems', 'alignContent', 'flexWrap', 'rowGap', 'columnGap' ),
			'padding'     => array( 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft' ),
			'margin'      => array( 'marginTop', 'marginRight', 'marginBottom', 'marginLeft' ),
			'typography'  => array(
				'fontFamily',
				'fontWeight',
				'fontSize',
				'lineHeight',
				'letterSpacing',
				'textTransform',
				'fontStyle',
				'color',
				'backgroundColor',
			),
			'icon'        => array(
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
			),
			'linkStyle'   => array( 'textDecoration' ),
			'textOrientation' => array( 'textOrientation', 'writingMode' ),
			'maxWidth'    => array( 'maxWidth' ),
			'maxHeight'   => array( 'maxHeight' ),
			'minHeight'   => array( 'minHeight' ),
			'minWidth'    => array( 'minWidth' ),
			'width'       => array( 'width' ),
			'height'      => array( 'height' ),
			'transition'  => array( 'transitionProperty', 'transitionDuration', 'transitionTimingFunction' ),
			'transform'   => array( 'scale', 'translate', 'rotate', 'skew', 'origin' ),
		);
		
		return isset( $component_keys_map[ $component_type ] ) ? $component_keys_map[ $component_type ] : array( $component_type );
	}
	
	/**
	 * Resolve all values for a component at once, merging global styles efficiently
	 *
	 * @param string $attribute_name The name of the attribute (e.g., 'typography').
	 * @param array  $attributes The block's attributes.
	 * @param string $device The current preview device.
	 * @param array  $metadata The block's metadata.
	 * @param array  $global_styles_ids Array of global style IDs (priority: later = higher).
	 * @param string $component_type The component type (e.g., 'typography', 'flexBox').
	 * @param object $css_engine The CSS engine instance for accessing helper methods.
	 * @return array Merged values for all component sub-attributes.
	 */
	public static function resolve_component_values( $attribute_name, $attributes, $device, $metadata, $global_styles_ids, $component_type, $css_engine ) {
		// Ensure metadata is an array once
		if ( ! is_array( $metadata ) ) {
			$metadata = array();
		}
		
		$component_keys = self::get_component_keys( $component_type ) ?? array( $component_type );
		$resolved_values = array();
		
		// Process each sub-attribute with simplified resolution
		foreach ( $component_keys as $key ) {
			$resolved = self::resolve_single_value(
				$attribute_name,
				$attributes,
				$device,
				$metadata,
				$key,
				$global_styles_ids,
				$css_engine
			);
			
			if ( $resolved ) {
				$resolved_values[ $key ] = $resolved;
			}
		}
		
		return $resolved_values;
	}
	
	/**
	 * Resolve a single value with clear priority order
	 * Priority: Direct > Parent Device > Preset > Bundle Preset > Initial
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The current device.
	 * @param array  $metadata The block metadata.
	 * @param string $key The sub-attribute key.
	 * @param array  $global_styles_ids Global style IDs.
	 * @param object $css_engine The CSS engine instance.
	 * @return array|null Resolved value with source information.
	 */
	protected static function resolve_single_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine ) {
		// Special handling for border radius stored as array
		if ( $attribute_name === 'border' && strpos( $key, 'Radius' ) !== false ) {
			$is_hover = strpos( $key, 'Hover' ) !== false;
			$array_key = $is_hover ? 'borderRadiusHover' : 'borderRadius';
			
			// Check if borderRadius is stored as an array at the attribute level
			$border_radius_array = self::get_device_value( $attribute_name, $attributes, $device, $array_key );
			
			if ( is_array( $border_radius_array ) ) {
				$corner_value = null;
				// Map individual corner keys to array indices
				if ( $key === 'borderTopLeftRadius' || $key === 'borderTopLeftRadiusHover' ) {
					$corner_value = isset( $border_radius_array[0] ) ? $border_radius_array[0] : null;
				} elseif ( $key === 'borderTopRightRadius' || $key === 'borderTopRightRadiusHover' ) {
					$corner_value = isset( $border_radius_array[1] ) ? $border_radius_array[1] : null;
				} elseif ( $key === 'borderBottomRightRadius' || $key === 'borderBottomRightRadiusHover' ) {
					$corner_value = isset( $border_radius_array[2] ) ? $border_radius_array[2] : null;
				} elseif ( $key === 'borderBottomLeftRadius' || $key === 'borderBottomLeftRadiusHover' ) {
					$corner_value = isset( $border_radius_array[3] ) ? $border_radius_array[3] : null;
				}
				
				if ( $corner_value !== null && $corner_value !== '' ) {
					return array(
						'value'     => $corner_value,
						'source'    => 'direct',
						'inherited' => false,
					);
				}
			}
		}
		
		// Priority 1: Direct value from current device
		$direct_value = self::get_device_value( $attribute_name, $attributes, $device, $key );
		if ( $direct_value !== null && $direct_value !== '' ) {
			return array(
				'value'     => $direct_value,
				'source'    => 'direct',
				'inherited' => false,
			);
		}
		
		// Priority 2: Parent device value (responsive inheritance)
		if ( $device !== 'desktop' ) {
			$parent_value = self::get_parent_device_value( $attribute_name, $attributes, $device, $key );
			if ( $parent_value !== null ) {
				return array(
					'value'     => $parent_value,
					'source'    => 'parent',
					'inherited' => true,
					'inheritedType' => 'responsive',
				);
			}
		}

		// Priority 3: Direct value from no device
		$no_device_value = self::get_device_value( $attribute_name, $attributes, 'none', $key );
		if ( $no_device_value !== null && $no_device_value !== '' ) {
			return array(
				'value'     => $no_device_value,
				'source'    => 'direct',
				'inherited' => false,
			);
		}
		
        // Priority 4: Preset value
        $preset_value = self::get_preset_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine );
        if ( $preset_value !== null ) {
            // Capture the preset key used on this attribute for downstream variable naming
            $preset_key = ! empty( $attributes[ $attribute_name ]['preset'] ) ? $attributes[ $attribute_name ]['preset'] : null;
            return array(
                'value'     => $preset_value,
                'source'    => 'preset',
                'inherited' => true,
                'inheritedType' => 'preset',
                'presetKey' => $preset_key,
            );
        }
		
		// Priority 5: Bundle preset value
        $bundle_preset_value = self::get_bundle_preset_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine );
        if ( $bundle_preset_value !== null ) {
            // Discover bundle preset key for variable naming
            $bundle_preset_key = null;
            if ( ! empty( $metadata['attributes'] ) ) {
                foreach ( $metadata['attributes'] as $attr_key => $attr_meta ) {
                    if ( ! empty( $attr_meta['bundlePreset'] ) && $attr_meta['bundlePreset'] === true ) {
                        if ( isset( $attributes[ $attr_key ] ) ) {
                            $bundle_preset_key = $attributes[ $attr_key ];
                        } elseif ( isset( $attr_meta['initial'] ) ) {
                            $bundle_preset_key = $attr_meta['initial'];
                        }
                        if ( $bundle_preset_key ) {
                            break;
                        }
                    }
                }
            }
            return array(
                'value'     => $bundle_preset_value,
                'source'    => 'bundle-preset',
                'inherited' => true,
                'inheritedType' => 'preset',
                'presetKey' => $bundle_preset_key,
            );
        }
		
		// Priority 6: Initial value from metadata
		$initial_value = self::get_initial_value( $attribute_name, $device, $metadata, $key );
		if ( $initial_value !== null ) {
			return array(
				'value'     => $initial_value,
				'source'    => 'initial',
				'inherited' => true,
				'inheritedType' => 'initial',
			);
		}
		
		return null;
	}
	
	/**
	 * Get device-specific value from attributes
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The device name.
	 * @param string $key The sub-attribute key.
	 * @return mixed The device value or null.
	 */
	protected static function get_device_value( $attribute_name, $attributes, $device, $key ) {
		// For empty attribute name (used by preset data), work directly with attributes
		if ( empty( $attribute_name ) ) {
			// Check for device-specific value
			if ( isset( $attributes[ $device ] ) && isset( $attributes[ $device ][ $key ] ) ) {
				return $attributes[ $device ][ $key ];
			}
			// Check for non-responsive value
			if ( isset( $attributes[ $key ] ) ) {
				return $attributes[ $key ];
			}
			return null;
		}
		
		if ( ! isset( $attributes[ $attribute_name ] ) ) {
			return null;
		}
		
		$attribute = $attributes[ $attribute_name ];
		
		// Check for device-specific value
		if ( isset( $attribute[ $device ] ) && isset( $attribute[ $device ][ $key ] ) ) {
			return $attribute[ $device ][ $key ];
		}
		
		// Check for non-responsive value
		if ( isset( $attribute[ $key ] ) ) {
			return $attribute[ $key ];
		}
		
		return null;
	}
	
	/**
	 * Get parent device value for responsive inheritance
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The current device.
	 * @param string $key The sub-attribute key.
	 * @return mixed The parent device value or null.
	 */
	protected static function get_parent_device_value( $attribute_name, $attributes, $device, $key ) {
		$device_hierarchy = self::get_device_hierarchy( $device );
		
		// Special handling for border radius arrays
		if ( $attribute_name === 'border' && strpos( $key, 'Radius' ) !== false ) {
			$is_hover = strpos( $key, 'Hover' ) !== false;
			$array_key = $is_hover ? 'borderRadiusHover' : 'borderRadius';
			
			foreach ( $device_hierarchy as $parent_device ) {
				$border_radius_array = self::get_device_value( $attribute_name, $attributes, $parent_device, $array_key );
				
				if ( is_array( $border_radius_array ) ) {
					$corner_value = null;
					// Map individual corner keys to array indices
					if ( $key === 'borderTopLeftRadius' || $key === 'borderTopLeftRadiusHover' ) {
						$corner_value = isset( $border_radius_array[0] ) ? $border_radius_array[0] : null;
					} elseif ( $key === 'borderTopRightRadius' || $key === 'borderTopRightRadiusHover' ) {
						$corner_value = isset( $border_radius_array[1] ) ? $border_radius_array[1] : null;
					} elseif ( $key === 'borderBottomRightRadius' || $key === 'borderBottomRightRadiusHover' ) {
						$corner_value = isset( $border_radius_array[2] ) ? $border_radius_array[2] : null;
					} elseif ( $key === 'borderBottomLeftRadius' || $key === 'borderBottomLeftRadiusHover' ) {
						$corner_value = isset( $border_radius_array[3] ) ? $border_radius_array[3] : null;
					}
					
					if ( $corner_value !== null && $corner_value !== '' ) {
						return $corner_value;
					}
				}
			}
		}
		
		foreach ( $device_hierarchy as $parent_device ) {
			$parent_value = self::get_device_value( $attribute_name, $attributes, $parent_device, $key );
			if ( $parent_value !== null ) {
				return $parent_value;
			}
		}
		
		return null;
	}
	
	/**
	 * Get preset value
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The current device.
	 * @param array  $metadata The block metadata.
	 * @param string $key The sub-attribute key.
	 * @param array  $global_styles_ids Global style IDs.
	 * @param object $css_engine The CSS engine instance.
	 * @return mixed The preset value or null.
	 */
	protected static function get_preset_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine ) {
		// Check if preset is defined
		if ( empty( $attributes[ $attribute_name ]['preset'] ) ) {
			return null;
		}
		
		$preset_key = $attributes[ $attribute_name ]['preset'];
		$component_type = isset( $metadata['attributes'][ $attribute_name ]['component'] ) ? 
			$metadata['attributes'][ $attribute_name ]['component'] : $attribute_name;
		
		$preset_data = $css_engine->get_preset_data( $preset_key, $component_type, $global_styles_ids );
		
		if ( ! empty( $preset_data['attributes'] ) ) {
			// First check current device
			$preset_value = self::get_device_value( '', $preset_data['attributes'], $device, $key );
			if ( $preset_value !== null ) {
				return $preset_value;
			}
			
			// Then check parent devices for preset
			if ( $device !== 'desktop' ) {
				$device_hierarchy = self::get_device_hierarchy( $device );
				foreach ( $device_hierarchy as $parent_device ) {
					$preset_parent_value = self::get_device_value( '', $preset_data['attributes'], $parent_device, $key );
					if ( $preset_parent_value !== null ) {
						return $preset_parent_value;
					}
				}
			}
		}
		
		return null;
	}
	
	/**
	 * Get bundle preset value
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The current device.
	 * @param array  $metadata The block metadata.
	 * @param string $key The sub-attribute key.
	 * @param array  $global_styles_ids Global style IDs.
	 * @param object $css_engine The CSS engine instance.
	 * @return mixed The bundle preset value or null.
	 */
	protected static function get_bundle_preset_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine ) {
		// Look for bundlePreset attributes in the metadata
		if ( empty( $metadata['attributes'] ) ) {
			return null;
		}
		
		foreach ( $metadata['attributes'] as $attr_key => $attr_meta ) {
			if ( ! empty( $attr_meta['bundlePreset'] ) && $attr_meta['bundlePreset'] === true ) {
				// Get the bundle preset key from attributes or initial value
				$bundle_preset_key = null;
				if ( isset( $attributes[ $attr_key ] ) ) {
					$bundle_preset_key = $attributes[ $attr_key ];
				} elseif ( isset( $attr_meta['initial'] ) ) {
					$bundle_preset_key = $attr_meta['initial'];
				}
				
				if ( empty( $bundle_preset_key ) ) {
					continue;
				}
				
				// Get the component type for the bundle preset
				$bundle_preset_component = isset( $attr_meta['component'] ) ? $attr_meta['component'] : '';
				if ( empty( $bundle_preset_component ) ) {
					continue;
				}
				
				// Get the preset data from CSS engine
				$preset_data = $css_engine->get_preset_data( $bundle_preset_key, $bundle_preset_component, $global_styles_ids );
				
				// Check if we got preset data and extract the specific attribute value
				if ( ! empty( $preset_data['attributes'] ) && isset( $preset_data['attributes'][ $attribute_name ] ) ) {
					// Special handling for border radius stored as array inside bundle presets
					if ( $attribute_name === 'border' && strpos( $key, 'Radius' ) !== false ) {
						$is_hover  = strpos( $key, 'Hover' ) !== false;
						$array_key = $is_hover ? 'borderRadiusHover' : 'borderRadius';
						// First check current device
						$border_radius_array = self::get_device_value( $attribute_name, $preset_data['attributes'], $device, $array_key );
						if ( is_array( $border_radius_array ) ) {
							$corner_value = null;
							if ( $key === 'borderTopLeftRadius' || $key === 'borderTopLeftRadiusHover' ) {
								$corner_value = isset( $border_radius_array[0] ) ? $border_radius_array[0] : null;
							} elseif ( $key === 'borderTopRightRadius' || $key === 'borderTopRightRadiusHover' ) {
								$corner_value = isset( $border_radius_array[1] ) ? $border_radius_array[1] : null;
							} elseif ( $key === 'borderBottomRightRadius' || $key === 'borderBottomRightRadiusHover' ) {
								$corner_value = isset( $border_radius_array[2] ) ? $border_radius_array[2] : null;
							} elseif ( $key === 'borderBottomLeftRadius' || $key === 'borderBottomLeftRadiusHover' ) {
								$corner_value = isset( $border_radius_array[3] ) ? $border_radius_array[3] : null;
							}
							if ( $corner_value !== null && $corner_value !== '' ) {
								return $corner_value;
							}
						}
						// Then check parent devices
						if ( $device !== 'desktop' ) {
							$device_hierarchy = self::get_device_hierarchy( $device );
							foreach ( $device_hierarchy as $parent_device ) {
								$border_radius_array = self::get_device_value( $attribute_name, $preset_data['attributes'], $parent_device, $array_key );
								if ( is_array( $border_radius_array ) ) {
									$corner_value = null;
									if ( $key === 'borderTopLeftRadius' || $key === 'borderTopLeftRadiusHover' ) {
										$corner_value = isset( $border_radius_array[0] ) ? $border_radius_array[0] : null;
									} elseif ( $key === 'borderTopRightRadius' || $key === 'borderTopRightRadiusHover' ) {
										$corner_value = isset( $border_radius_array[1] ) ? $border_radius_array[1] : null;
									} elseif ( $key === 'borderBottomRightRadius' || $key === 'borderBottomRightRadiusHover' ) {
										$corner_value = isset( $border_radius_array[2] ) ? $border_radius_array[2] : null;
									} elseif ( $key === 'borderBottomLeftRadius' || $key === 'borderBottomLeftRadiusHover' ) {
										$corner_value = isset( $border_radius_array[3] ) ? $border_radius_array[3] : null;
									}
									if ( $corner_value !== null && $corner_value !== '' ) {
										return $corner_value;
									}
								}
							}
						}
					}

					// Standard path: check direct key in preset attributes
					$preset_value = self::get_device_value( $attribute_name, $preset_data['attributes'], $device, $key );
					if ( $preset_value !== null ) {
						return $preset_value;
					}
					if ( $device !== 'desktop' ) {
						$device_hierarchy = self::get_device_hierarchy( $device );
						foreach ( $device_hierarchy as $parent_device ) {
							$preset_parent_value = self::get_device_value( $attribute_name, $preset_data['attributes'], $parent_device, $key );
							if ( $preset_parent_value !== null ) {
								return $preset_parent_value;
							}
						}
					}
				}
			}
		}
		
		return null;
	}
	
	/**
	 * Get initial value from metadata
	 *
	 * @param string $attribute_name The attribute name.
	 * @param string $device The current device.
	 * @param array  $metadata The block metadata.
	 * @param string $key The sub-attribute key.
	 * @return mixed The initial value or null.
	 */
	protected static function get_initial_value( $attribute_name, $device, $metadata, $key ) {
		if ( empty( $metadata['attributes'][ $attribute_name ]['initial'] ) ) {
			return null;
		}
		
		$initial = $metadata['attributes'][ $attribute_name ]['initial'];
		
		// Check device-specific initial value
		if ( isset( $initial[ $device ] ) && isset( $initial[ $device ][ $key ] ) ) {
			return $initial[ $device ][ $key ];
		}
		
		// Check non-responsive initial value
		if ( isset( $initial[ $key ] ) ) {
			return $initial[ $key ];
		}
		
		return null;
	}
	
	/**
	 * Get inherited device value including global styles
	 * 
	 * @deprecated Use resolve_single_value() instead
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array  $attributes The block attributes.
	 * @param string $device The device name.
	 * @param array  $metadata The block metadata.
	 * @param string $key The sub-attribute key.
	 * @param array  $global_styles_ids Global style IDs.
	 * @param object $css_engine The CSS engine instance.
	 * @return array Inherited value data.
	 */
	protected static function get_inherited_device_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine ) {
		// This method is kept for backward compatibility but now uses the new resolution logic
		$resolved = self::resolve_single_value( $attribute_name, $attributes, $device, $metadata, $key, $global_styles_ids, $css_engine );
		
		if ( $resolved ) {
			return array(
				'inheritedValue'  => $resolved['value'],
				'inheritedSource' => $resolved['source'],
				'inheritedType'   => isset( $resolved['inheritedType'] ) ? $resolved['inheritedType'] : $resolved['source'],
			);
		}
		
		return array(
			'inheritedValue'  => null,
			'inheritedSource' => '',
			'inheritedType'   => '',
		);
	}
	
	/**
	 * Get device hierarchy for responsive inheritance
	 *
	 * @param string $device The current device.
	 * @return array Parent devices in order of precedence.
	 */
	protected static function get_device_hierarchy( $device ) {
		$hierarchies = array(
			'mobile'  => array( 'tablet', 'desktop' ),
			'tablet'  => array( 'desktop' ),
			'desktop' => array(),
		);
		
		return isset( $hierarchies[ $device ] ) ? $hierarchies[ $device ] : array();
	}
	
	/**
	 * Check if a resolved value should be rendered based on inheritance rules
	 *
	 * @param array $resolved_value The resolved value array.
	 * @param array $meta Component metadata.
	 * @return bool
	 */
	public static function should_render_value( $resolved_value, $meta ) {
		if ( empty( $resolved_value ) ) {
			return false;
		}
		
		$value = isset( $resolved_value['value'] ) ? $resolved_value['value'] : '';
		$source = isset( $resolved_value['source'] ) ? $resolved_value['source'] : '';
		$inherited = isset( $resolved_value['inherited'] ) ? $resolved_value['inherited'] : false;
		
		// Always render direct values and parent device values
		if ( $source === 'direct' || $source === 'parent' ) {
			return true;
		}
		
		// For non-inheritable properties, render preset values
		if ( ! empty( $meta['nonInheritable'] ) && ( $source === 'preset' || $source === 'preset-parent' ) ) {
			return true;
		}
		
		// Don't render inherited preset values (they're handled by class names)
		if ( $inherited && ( $source === 'preset' || $source === 'preset-parent' ) && empty( $meta['nonInheritable'] ) ) {
			return false;
		}
		
		return ! empty( $value );
	}
}