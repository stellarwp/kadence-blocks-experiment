<?php
/**
 * Text component CSS generator (text-align, text-decoration, text-orientation)
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Text component CSS generator
 */
class Text_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'text';
	
	/**
	 * Generate CSS for text component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Determine text component type from attribute name
		$text_type = strtolower( $attribute_name );
		
		// Process each text property
		foreach ( $resolved_values as $key => $resolved_value ) {
			if ( $this->should_render_value( $resolved_value, $meta ) ) {
				$this->apply_text_property( $key, $resolved_value, $meta, $text_type );
			}
		}
	}
	
	/**
	 * Apply a text property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @param string $text_type The type of text property.
	 * @return void
	 */
	protected function apply_text_property( $key, $resolved_value, $meta, $text_type ) {
		$css_value = $this->process_text_value( $key, $resolved_value['value'], $text_type );
		if ( empty( $css_value ) ) {
			return;
		}
		
		// Apply the primary property
		$this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );

		// If setting textOrientation, ensure we also output a matching writing-mode
		if ( $key === 'textOrientation' ) {
			$writing_mode = $this->process_text_value( 'writingMode', $resolved_value['value'], $text_type );
			if ( ! empty( $writing_mode ) ) {
				$this->apply_property( 'writingMode', array_merge( $resolved_value, array( 'value' => $writing_mode ) ), $meta );
			}
		}
	}
	
	/**
	 * Process text value based on property type
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @param string $text_type The type of text property.
	 * @return string The processed CSS value.
	 */
	protected function process_text_value( $key, $value, $text_type ) {
		switch ( $key ) {
			case 'textAlign':
				// Text align values are used as-is
				return $value;
				
			case 'textDecoration':
				// Handle text decoration
				return $this->format_text_decoration( $value );
				
				case 'textOrientation':
					// Map UI values to valid CSS values
					if ( $value === 'stacked' ) {
						return 'upright';
					}
					if ( $value === 'sideways-down' || $value === 'sideways-up' ) {
						return 'sideways';
					}
					return '';
				
				case 'writingMode':
					// Map UI values to valid CSS writing-mode values
					if ( $value === 'stacked' || $value === 'sideways-down' ) {
						return 'vertical-lr';
					} elseif ( $value === 'sideways-up' ) {
						return 'sideways-lr';
					}
					return '';
				
			case 'textIndent':
				// Add unit if numeric
				if ( is_numeric( $value ) ) {
					return $value . 'px';
				}
				return $value;
				
			case 'textOverflow':
				// Text overflow values are used as-is
				return $value;
				
			case 'whiteSpace':
				// White space values are used as-is
				return $value;
				
			case 'wordBreak':
				// Word break values are used as-is
				return $value;
				
			case 'wordWrap':
			case 'overflowWrap':
				// Word wrap/overflow wrap values are used as-is
				return $value;
				
			default:
				return $value;
		}
	}
	
	/**
	 * Format text decoration value
	 *
	 * @param mixed $value The text decoration value.
	 * @return string The formatted text decoration.
	 */
	protected function format_text_decoration( $value ) {
		// If it's an array, format as space-separated values
		if ( is_array( $value ) ) {
			$parts = array();
			
			if ( isset( $value['line'] ) ) {
				$parts[] = $value['line'];
			}
			if ( isset( $value['style'] ) ) {
				$parts[] = $value['style'];
			}
			if ( isset( $value['color'] ) ) {
				$parts[] = $this->css_engine->sanitize_color( $value['color'] );
			}
			if ( isset( $value['thickness'] ) ) {
				$thickness = is_numeric( $value['thickness'] ) ? $value['thickness'] . 'px' : $value['thickness'];
				$parts[] = $thickness;
			}
			
			return implode( ' ', $parts );
		}
		
		// Return string value as-is
		return $value;
	}
	
	/**
	 * Get component keys based on text type
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		// Return all possible text-related keys
		// The actual keys used will depend on the specific component
		return array(
			'textAlign',
			'textDecoration',
			'textOrientation',
			'writingMode',
			'textIndent',
			'textOverflow',
			'whiteSpace',
			'wordBreak',
			'wordWrap',
			'overflowWrap',
			'verticalAlign',
			'direction',
		);
		}
}