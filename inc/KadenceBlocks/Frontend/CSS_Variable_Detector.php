<?php
/**
 * CSS Variable Detector
 *
 * Detects CSS variable usage in block attributes and content.
 *
 * @since 4.0.0
 * @package KadenceWP\KadenceBlocks\Frontend
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Settings\Global_Style_Item;
use KadenceWP\KadenceBlocks\Settings\Global_Styles_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Detects CSS variable usage in blocks.
 *
 * @since 4.0.0
 */
class CSS_Variable_Detector {
	/**
	 * Pattern to match palette color references.
	 */
	const PALETTE_PATTERN = '/^palette(\d+|-.+)$/';

	/**
	 * Mapping of attribute types to CSS variable categories.
	 *
	 * @var array
	 */
	private static $attribute_variable_map = [
		'fontSize' => 'font-size',
		'lineHeight' => 'line-height',
		'letterSpacing' => 'letter-spacing',
		'iconSize' => 'icon-size',
		'gap' => 'gap',
		'rowGap' => 'gap',
		'columnGap' => 'gap',
		'paddingTop' => 'spacing',
		'paddingRight' => 'spacing',
		'paddingBottom' => 'spacing',
		'paddingLeft' => 'spacing',
		'marginTop' => 'spacing',
		'marginRight' => 'spacing',
		'marginBottom' => 'spacing',
		'marginLeft' => 'spacing',
	];

	/**
	 * Detect CSS variables used in a block.
	 *
	 * @param array    $attributes Block attributes.
	 * @param string   $block_name Block name.
	 * @param \WP_Block $block_instance Block instance.
	 * @return array Array of CSS variable names.
	 */
	public static function detect_variables( array $attributes, string $block_name, $block_instance = null ) {
		$variables = [];

		// Detect in attriubtes
		$variables = self::detect_in_attributes( $attributes );

		// Detect in component presets
		if ( $block_instance && isset( $block_instance->block_type->attributes ) ) {
			$variables = array_merge( $variables, self::detect_in_component_presets( $attributes, $block_instance->block_type->attributes ) );
		}

		return array_unique( $variables );
	}

	/**
	 * Detect variables in attributes recursively.
	 *
	 * @param mixed $data The data to search.
	 * @param string $key The current key being processed.
	 * @return array Array of CSS variable names.
	 */
	private static function detect_in_attributes( $data, string $key = '' ) {
		$variables = [];

		if ( is_array( $data ) ) {
			foreach ( $data as $sub_key => $value ) {
				$current_key = is_string( $sub_key ) ? $sub_key : $key;
				$variables = array_merge( $variables, self::detect_in_attributes( $value, $current_key ) );
			}
		} elseif ( is_string( $data ) ) {
			// Check for palette references
			if ( preg_match( self::PALETTE_PATTERN, $data, $match ) ) {
				$variables[] = '--kbs-colors-palette' . $match[1];
			}

			// Check for gradient references
			if ( strpos( $data, 'gradient' ) !== false && preg_match( '/gradient(\d+)/', $data, $match ) ) {
				$variables[] = '--kbs-gradients-gradient' . $match[1];
			}

			// Check for size variable references
			if ( $key && isset( self::$attribute_variable_map[ $key ] ) ) {
				$var_name = self::get_size_variable( $data, self::$attribute_variable_map[ $key ] );
				if ( $var_name ) {
					$variables[] = $var_name;
				}
			}
		}

		return $variables;
	}

	/**
	 * Detect variables in component presets.
	 *
	 * @param array $attributes Block attributes.
	 * @param array $attributes_meta Block attributes metadata.
	 * @return array Array of CSS variable names.
	 */
	private static function detect_in_component_presets( array $attributes, array $attributes_meta ) {
		$variables = [];

		foreach ( $attributes_meta as $attr_name => $meta ) {
			if ( ! isset( $meta['component'] ) || ! isset( $attributes[ $attr_name ] ) ) {
				continue;
			}

			$attr_value = $attributes[ $attr_name ];
			
			// Check for preset
			if ( is_array( $attr_value ) && isset( $attr_value['preset'] ) ) {
				$preset_key = $attr_value['preset'];
				$component = $meta['component'];
				
				// Get variables from preset
				$preset_vars = self::get_preset_variables( $preset_key, $component, $attributes['globalStyleIds'] ?? [] );
				$variables = array_merge( $variables, $preset_vars );
			}
		}

		return $variables;
	}

	/**
	 * Get variables used in a preset.
	 *
	 * @param string $preset_key The preset key.
	 * @param string $component The component name.
	 * @param array  $global_style_ids Global style IDs.
	 * @return array Array of CSS variable names.
	 */
	private static function get_preset_variables( string $preset_key, string $component, array $global_style_ids ) {
		$variables = [];
		
		// Add base to global style IDs
		$all_style_ids = array_merge( $global_style_ids, [ 'kbs-base' ] );
		
		// Load global styles
		$global_styles = Global_Styles_Manager::get_global_styles_by_ids( $all_style_ids );
		
		// Find the preset in global styles
		foreach ( $all_style_ids as $style_id ) {
			if ( isset( $global_styles[ $style_id ] ) ) {
				$style_item = new Global_Style_Item( $style_id, $global_styles[ $style_id ] );
				$preset_data = $style_item->get_component_preset( $component, $preset_key );
				
				if ( $preset_data ) {
					// Extract variables from preset attributes
					$variables = array_merge( $variables, self::detect_in_attributes( $preset_data['attributes'] ?? [] ) );
					break; // Use first found preset
				}
			}
		}

		return $variables;
	}

	/**
	 * Get the CSS variable name for a size value.
	 *
	 * @param mixed  $value The size value.
	 * @param string $type The variable type.
	 * @return string|null The CSS variable name or null.
	 */
	private static function get_size_variable( $value, string $type ) {
		if ( ! is_string( $value ) ) {
			return null;
		}

		// Map of size values to variable suffixes
		$size_map = [
			'font-size' => [ 'sm', 'md', 'lg', 'xl', 'xxl', '3xl' ],
			'line-height' => [ 'sm', 'md', 'lg' ],
			'letter-spacing' => [ 'sm', 'md', 'lg' ],
			'icon-size' => [ 'xs', 'sm', 'md', 'lg', 'xl' ],
			'spacing' => [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ],
			'gap' => [ 'none', 'xs', 'sm', 'md', 'lg' ],
		];

		if ( isset( $size_map[ $type ] ) && in_array( $value, $size_map[ $type ], true ) ) {
			return '--kbs-' . $type . '-' . $value;
		}

		return null;
	}

	/**
	 * Extract all CSS variables from a global style item.
	 *
	 * @param Global_Style_Item $style_item The global style item.
	 * @return array Array of CSS variable names defined in this style.
	 */
	public static function get_style_defined_variables( Global_Style_Item $style_item ) {
		$variables = [];

		// Get variables from mappings
		foreach ( $style_item->get_mappings() as $category => $tokens ) {
			foreach ( $tokens as $token => $data ) {
				if ( isset( $data['value'] ) ) {
					$var_name = self::get_mapping_variable_name( $category, $token );
					$variables[] = $var_name;
				}
			}
		}

		return $variables;
	}

	/**
	 * Get CSS variable name from category and token.
	 *
	 * @param string $category The category.
	 * @param string $token The token.
	 * @return string The CSS variable name.
	 */
	private static function get_mapping_variable_name( string $category, string $token ) {
		// Convert to kebab case
		$category_slug = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $category ) );
		$token_slug = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $token ) );
		
		return '--kbs-' . $category_slug . '-' . $token_slug;
	}
}