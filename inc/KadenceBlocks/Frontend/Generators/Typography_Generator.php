<?php
/**
 * Typography component CSS generator
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Typography component CSS generator
 */
class Typography_Generator extends Base_Generator {
	
	/**
	 * Component type identifier
	 *
	 * @var string
	 */
	protected $component_type = 'typography';
	
	/**
	 * Generate CSS for typography component
	 *
	 * @param string   $attribute_name The attribute name.
	 * @param array    $meta Component metadata.
	 * @param array    $resolved_values Pre-resolved component values.
	 * @param WP_Block $block_instance The block instance.
	 * @return void
	 */
	public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {
		// Process each typography property
        foreach ( $resolved_values as $key => $resolved_value ) {
            if ( $this->should_render_value( $resolved_value, $meta ) ) {
                $this->apply_typography_property( $key, $resolved_value, $meta );
            }
        }
	}
	
	/**
	 * Apply a typography property
	 *
	 * @param string $key The property key.
	 * @param array  $resolved_value The resolved value object.
	 * @param array  $meta Component metadata.
	 * @return void
	 */
    protected function apply_typography_property( $key, $resolved_value, $meta ) {
        $raw_value = isset( $resolved_value['value'] ) ? $resolved_value['value'] : '';
        $source    = isset( $resolved_value['source'] ) ? $resolved_value['source'] : '';
        $preset_key = isset( $resolved_value['presetKey'] ) ? $resolved_value['presetKey'] : null;

        // When value originates from a preset, render via a CSS variable tied to that preset
        if ( $preset_key ) {
            $property = $this->get_css_property( $key, $meta );
            $token    = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $preset_key ) );
            $var_name = '--kbs-' . $this->camel_to_kebab( $key ) . '-' . $token;
            $processed_fallback = $this->process_typography_value( $key, $raw_value );
            $fallback = ! empty( $processed_fallback ) ? $processed_fallback : $raw_value;

            // Use var(--kbs-<prop>-<preset>, <fallback>) so the active global style scope can override preset values
            $this->add_property( $property, sprintf( 'var(%s, %s)', $var_name, $fallback ) );
            return;
        }

        $css_value = $this->process_typography_value( $key, $raw_value );
        // If color produced a palette var but the source is a preset, prefer preset var approach
        if ( $preset_key && is_string( $css_value ) && strpos( $css_value, 'var(--kbs-colors-' ) === 0 && ($key === 'color' || $key === 'backgroundColor') ) {
            $property = $this->get_css_property( $key, $meta );
            $token    = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $preset_key ) );
            $var_name = '--kbs-' . $this->camel_to_kebab( $key ) . '-' . $token;
            $this->add_property( $property, sprintf( 'var(%s, %s)', $var_name, $css_value ) );
            return;
        }
        if ( empty( $css_value ) ) {
            return;
        }

        // Default behavior for non-preset values
        $this->apply_property( $key, array_merge( $resolved_value, array( 'value' => $css_value ) ), $meta );
    }
	
	/**
	 * Process typography value based on property type
	 *
	 * @param string $key The property key.
	 * @param mixed  $value The resolved value.
	 * @return string The processed CSS value.
	 */
	protected function process_typography_value( $key, $value ) {
		switch ( $key ) {
			case 'fontFamily':
				return $value; // Font family is used as-is
				
			case 'fontSize':
				return $this->get_font_size_output( $value );
				
			case 'lineHeight':
				return $this->get_line_height_output( $value );
				
			case 'letterSpacing':
				return $this->get_letter_spacing_output( $value );
				
			case 'color':
			case 'backgroundColor':
				return $this->css_engine->sanitize_color( $value );
				
			case 'fontWeight':
			case 'fontStyle':
			case 'textTransform':
				return $value; // These are used as-is
				
			default:
				return $this->get_sizing_output( $value );
		}
	}
	
	/**
	 * Get font size output value
	 *
	 * @param string $value The font size value.
	 * @return string
	 */
	protected function get_font_size_output( $value ) {
		if ( $this->css_engine->is_variable_font_size_value( $value ) ) {
			return $this->css_engine->get_variable_font_size_value( $value );
		}
		return $value;
	}
	
	/**
	 * Get line height output value
	 *
	 * @param string $value The line height value.
	 * @return string
	 */
	protected function get_line_height_output( $value ) {
		if ( $this->css_engine->is_variable_line_height_value( $value ) ) {
			return $this->css_engine->get_variable_line_height_value( $value );
		}
		return $value;
	}
	
	/**
	 * Get letter spacing output value
	 *
	 * @param string $value The letter spacing value.
	 * @return string
	 */
	protected function get_letter_spacing_output( $value ) {
		if ( $this->css_engine->is_variable_letter_spacing_value( $value ) ) {
			return $this->css_engine->get_variable_letter_spacing_value( $value );
		}
		return $value;
	}
	
	/**
	 * Get sizing output value
	 *
	 * @param string $value The sizing value.
	 * @return string
	 */
	protected function get_sizing_output( $value ) {
		if ( $this->css_engine->is_variable_spacing_value( $value ) ) {
			return $this->css_engine->get_variable_spacing_value( $value );
		}
		return $value;
	}
	
	/**
	 * Get component keys for typography
	 *
	 * @return array List of component property keys.
	 */
	protected function get_component_keys() {
		return array(
			'fontFamily',
			'fontWeight',
			'fontSize',
			'lineHeight',
			'letterSpacing',
			'textTransform',
			'fontStyle',
			'color',
			'backgroundColor',
		);
		}
}