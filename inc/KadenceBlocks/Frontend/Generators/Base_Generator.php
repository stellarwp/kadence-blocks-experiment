<?php
/**
 * Base class for component CSS generators
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Base class for all component CSS generators
 */
abstract class Base_Generator {
	
	/**
	 * Reference to the main CSS Engine instance
	 *
	 * @var object
	 */
	protected $css_engine;
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = '';
	
	/**
	 * Constructor
	 *
	 * @param object $css_engine The main CSS Engine instance.
	 */
	public function __construct( $css_engine ) {
		$this->css_engine = $css_engine;
	}
	
	/**
	 * Generate CSS for this component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	abstract public function generate( $attribute_name, $meta, $resolved_values, $block_instance );
	
	/**
	 * Get the current selector from the main CSS engine
	 *
	 * @return string
	 */
	protected function get_current_selector() {
		return $this->css_engine->get_current_selector();
	}
	
	/**
	 * Set selector on the main CSS engine
	 *
	 * @param string $selector The CSS selector.
	 * @return $this
	 */
	protected function set_selector( $selector ) {
		$this->css_engine->set_selector( $selector );
		return $this;
	}
	
	/**
	 * Add CSS properties to the main CSS engine
	 *
	 * @param string $property The CSS property.
	 * @param string $value The CSS value.
	 * @return $this
	 */
	protected function add_property( $property, $value ) {
		if ( ! empty( $value ) ) {
			$this->css_engine->add_property( $property, $value );
		}
		return $this;
	}
	
	/**
	 * Set media state on the main CSS engine
	 *
	 * @param string $state The media state (desktop, tablet, mobile).
	 * @return $this
	 */
	protected function set_media_state( $state ) {
		$this->css_engine->set_media_state( $state );
		return $this;
	}
	
	/**
	 * Get mapped CSS property for components
	 *
	 * @param string $key The attribute key.
	 * @return string The CSS property name.
	 */
	protected function get_mapped_css_property( $key ) {
		// Universal property mappings for all components
		$property_map = array(
			// Typography properties
			'fontSize'        => 'font-size',
			'fontFamily'      => 'font-family',
			'fontWeight'      => 'font-weight',
			'fontStyle'       => 'font-style',
			'lineHeight'      => 'line-height',
			'letterSpacing'   => 'letter-spacing',
			'textTransform'   => 'text-transform',
			'textAlign'       => 'text-align',
			'textDecoration'  => 'text-decoration',
			'textOrientation' => 'text-orientation',
			'writingMode'     => 'writing-mode',
			'textIndent'      => 'text-indent',
			'textOverflow'    => 'text-overflow',
			'whiteSpace'      => 'white-space',
			'wordBreak'       => 'word-break',
			'wordWrap'        => 'word-wrap',
			'overflowWrap'    => 'overflow-wrap',
			'verticalAlign'   => 'vertical-align',
			'direction'       => 'direction',
			
			// Color properties
			'color'           => 'color',
			'colorHover'      => 'color',
			'backgroundColor' => 'background-color',
			
			// Spacing properties
			'paddingTop'      => 'padding-top',
			'paddingRight'    => 'padding-right',
			'paddingBottom'   => 'padding-bottom',
			'paddingLeft'     => 'padding-left',
			'marginTop'       => 'margin-top',
			'marginRight'     => 'margin-right',
			'marginBottom'    => 'margin-bottom',
			'marginLeft'      => 'margin-left',
			
			// Spacing hover variants
			'paddingHoverTop'    => 'padding-top',
			'paddingHoverRight'  => 'padding-right',
			'paddingHoverBottom' => 'padding-bottom',
			'paddingHoverLeft'   => 'padding-left',
			'marginHoverTop'     => 'margin-top',
			'marginHoverRight'   => 'margin-right',
			'marginHoverBottom'  => 'margin-bottom',
			'marginHoverLeft'    => 'margin-left',
			
			// FlexBox properties
			'flexDirection'   => 'flex-direction',
			'flexWrap'        => 'flex-wrap',
			'justifyContent'  => 'justify-content',
			'alignItems'      => 'align-items',
			'alignContent'    => 'align-content',
			'rowGap'          => 'row-gap',
			'columnGap'       => 'column-gap',
			
			// Border properties
			'borderTopLeftRadius'     => 'border-top-left-radius',
			'borderTopRightRadius'    => 'border-top-right-radius',
			'borderBottomRightRadius' => 'border-bottom-right-radius',
			'borderBottomLeftRadius'  => 'border-bottom-left-radius',
			'borderTop'               => 'border-top',
			'borderLeft'              => 'border-left',
			'borderRight'             => 'border-right',
			'borderBottom'            => 'border-bottom',
			
			// Border hover variants
			'borderTopLeftRadiusHover'     => 'border-top-left-radius',
			'borderTopRightRadiusHover'    => 'border-top-right-radius',
			'borderBottomRightRadiusHover' => 'border-bottom-right-radius',
			'borderBottomLeftRadiusHover'  => 'border-bottom-left-radius',
			'borderTopHover'               => 'border-top',
			'borderLeftHover'              => 'border-left',
			'borderRightHover'             => 'border-right',
			'borderBottomHover'            => 'border-bottom',
			
			// General border properties
			'borderWidth'     => 'border-width',
			'borderStyle'     => 'border-style',
			'borderColor'     => 'border-color',
			
			// Shadow properties
			'boxShadow'       => 'box-shadow',
			'textShadow'      => 'text-shadow',
			
			// Dimension properties
			'maxWidth'        => 'max-width',
			'maxHeight'       => 'max-height',
			'minHeight'       => 'min-height',
			'minWidth'        => 'min-width',
			'width'           => 'width',
			'height'          => 'height',
			
			// Icon properties
			'iconSize'        => 'font-size',
			'iconLineWidth'   => 'stroke-width',
			'iconSizeHover'   => 'font-size',
			'iconLineWidthHover' => 'stroke-width',
			
			// Transform properties
			'scale'           => 'scale',
			'translate'       => 'translate',
			'rotate'          => 'rotate',
			'skew'            => 'skew',
			'origin'          => 'transform-origin',
			
			// Transition properties
			'transitionProperty'       => 'transition-property',
			'transitionDuration'       => 'transition-duration',
			'transitionTimingFunction' => 'transition-timing-function',
			'transitionDelay'          => 'transition-delay',
			'transition'               => 'transition',
			
			// Background properties
			'backgroundImage'      => 'background-image',
			'backgroundSize'       => 'background-size',
			'backgroundPosition'   => 'background-position',
			'backgroundRepeat'     => 'background-repeat',
			'backgroundAttachment' => 'background-attachment',
			
			// Background component sub-properties
			'image'       => 'background-image',
			'size'        => 'background-size',
			'position'    => 'background-position',
			'repeat'      => 'background-repeat',
			'attachment'  => 'background-attachment',
			'gradient'    => 'background-image',
		);
		
		// Check for hover variants
		$base_key = $key;
		if ( substr( $key, -5 ) === 'Hover' ) {
			$base_key = substr( $key, 0, -5 );
			if ( isset( $property_map[ $base_key ] ) ) {
				return $property_map[ $base_key ];
			}
		}
		
		// Check for active variants
		if ( substr( $key, -6 ) === 'Active' ) {
			$base_key = substr( $key, 0, -6 );
			if ( isset( $property_map[ $base_key ] ) ) {
				return $property_map[ $base_key ];
			}
		}
		
		// Return mapped property or fall back to key
		return isset( $property_map[ $key ] ) ? $property_map[ $key ] : $this->camel_to_kebab( $key );
	}
	
	/**
	 * Get CSS property name for a given key
	 *
	 * @param string $key The attribute key.
	 * @param array  $meta Component metadata.
	 * @return string The CSS property name.
	 */
	protected function get_css_property( $key, $meta ) {
		// Get the mapped property name
		$property = $this->get_mapped_css_property( $key );
		
		// If nonInheritable is true, output direct CSS property
		if ( ! empty( $meta['nonInheritable'] ) && $meta['nonInheritable'] === true ) {
			return $property;
		}
		
		// Otherwise, handle CSS variables with varPrefix
		if ( ! empty( $meta['varPrefix'] ) ) {
			$suffix = ! empty( $meta['varSuffix'] ) ? $meta['varSuffix'] : '';
			return $meta['varPrefix'] . $property . $suffix;
		}
		
		return $property;
	}
	
	/**
	 * Get the CSS selector for a component property
	 *
	 * @param string $key The property key.
	 * @param array  $meta Component metadata.
	 * @return string The CSS selector.
	 */
	protected function get_selector( $key, $meta ) {
		$selector = $this->get_current_selector();
		
		if ( ! empty( $meta['nonInheritable'] ) && ! empty( $meta['selectorSuffix'] ) ) {
			$processed_suffix = str_replace( '%selector%', $this->get_current_selector(), $meta['selectorSuffix'] );
			$selector = $this->get_current_selector() . $processed_suffix;
		}
		
		// Handle hover states
		if ( substr( $key, -5 ) === 'Hover' ) {
			$selector = $selector . ':hover';
		} elseif ( substr( $key, -6 ) === 'Active' ) {
			$selector = $selector . ':active, ' . $selector . ':focus';
		}
		
		return $selector;
	}
	
	/**
	 * Apply a single CSS property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @return void
	 */
	protected function apply_property( $key, $resolved_value, $meta ) {
		if ( ! $this->should_render_value( $resolved_value, $meta ) ) {
			return;
		}
		
		$css_value = $this->process_value( $key, $resolved_value['value'], $meta );
		if ( empty( $css_value ) ) {
			return;
		}
		
		$selector = $this->get_selector( $key, $meta );
		$property = $this->get_css_property( $key, $meta );
		
		$current_selector_backup = $this->get_current_selector();
		$this->set_selector( $selector );
		$this->add_property( $property, $css_value );
		$this->set_selector( $current_selector_backup );
	}
	
	/**
	 * Process CSS value based on component type
	 * To be implemented by subclasses
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @param array  $meta Component metadata.
	 * @return string The processed CSS value.
	 */
	protected function process_value( $key, $value, $meta ) {
		// Base implementation - subclasses can override
		return $value;
	}
	
	/**
	 * Check if a resolved value should be rendered based on inheritance rules
	 *
	 * @param array $resolved_value The resolved value array.
	 * @param array $meta Component metadata.
	 * @return bool
	 */
	protected function should_render_value( $resolved_value, $meta ) {
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
	
	/**
	 * Convert camelCase to kebab-case
	 *
	 * @param string $string The camelCase string.
	 * @return string The kebab-case string.
	 */
	protected function camel_to_kebab( $string ) {
		return strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $string ) );
	}
	
	/**
	 * Get component keys for this generator
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		// To be implemented by subclasses
		return array();
	}
	
	/**
	 * Generic implementation for simple generators
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param callable $output_function Optional function to process values.
	 * @return void
	 */
	protected function generate_simple( $attribute_name, $meta, $resolved_values, $output_function = null ) {
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$css_value = $output_function ? call_user_func( $output_function, $resolved_value['value'] ) : $resolved_value['value'];
				if ( ! empty( $css_value ) ) {
					$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
				}
			}
		}
	}
}