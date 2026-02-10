<?php
/**
 * Handles outputting global styles in the editor on page load to prevent unstyled content while page is loading.
 *
 * @package KadenceWP\KadenceBlocks\Blocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Blocks;

use KadenceWP\KadenceBlocks\Settings\Global_Style;
use KadenceWP\KadenceBlocks\Settings\Global_Styles_Manager;
use KadenceWP\KadenceBlocks\Settings\Global_Style_Item;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Editor Global Styles class
 */
class Editor_Global_Styles {

	/**
	 * Initialize the editor global styles output
	 */
	public function on_init() {
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_global_styles' ], 15 );
	}

	/**
	 * Enqueue global styles for the editor
	 */
	public function enqueue_editor_global_styles() {
		$css = $this->generate_editor_global_styles_css();
		
		if ( ! empty( $css ) ) {
			// Add inline styles to an existing editor stylesheet
			// Using wp-edit-blocks as it's always loaded in the editor
			wp_add_inline_style( 'wp-edit-blocks', $css );
		}
	}


	/**
	 * Generate CSS for editor global styles
	 *
	 * @return string
	 */
	private function generate_editor_global_styles_css() {
		// Get base global style
		$base_style = Global_Styles_Manager::get_global_style( 'kbs-base' );
		
		if ( empty( $base_style ) ) {
			return '';
		}

		$css = '';
		$root_css = '';

		// Process base style mappings
		if ( ! empty( $base_style['mappings'] ) && is_array( $base_style['mappings'] ) ) {
			foreach ( $base_style['mappings'] as $category => $tokens ) {
				if ( ! is_array( $tokens ) ) {
					continue;
				}

				foreach ( $tokens as $token => $token_data ) {
					if ( empty( $token_data['value'] ) ) {
						continue;
					}

					$variable_name = $this->get_mapping_variable_name( $category, $token );
					$value = $token_data['value'];
					
					// Add kbs variable
					$root_css .= "  {$variable_name}: {$value};\n";
					
					// For colors and gradients in base style, also add global variables
					if ( ( 'colors' === $category || 'gradients' === $category ) && 'kbs-base' === 'kbs-base' ) {
						$global_variable_name = $this->get_mapping_variable_name( $category, $token, true );
						$root_css .= "  {$global_variable_name}: {$value};\n";
					}
				}
			}
		}

		if ( ! empty( $base_style['components']['typography']['presets'] ) && is_array( $base_style['components']['typography']['presets'] ) ) {
			foreach ( $base_style['components']['typography']['presets'] as $preset_key => $preset_data ) {
				// Get desktop attributes (default)
				$attributes = [];
				if ( ! empty( $preset_data['attributes']['desktop'] ) && is_array( $preset_data['attributes']['desktop'] ) ) {
					$attributes = $preset_data['attributes']['desktop'];
				} elseif ( ! empty( $preset_data['attributes'] ) && is_array( $preset_data['attributes'] ) && ! isset( $preset_data['attributes']['desktop'] ) ) {
					// Fallback to direct attributes if no device-specific ones
					$attributes = $preset_data['attributes'];
				}

				if ( empty( $attributes ) ) {
					continue;
				}

				// Process each typography attribute
				foreach ( $attributes as $attr_key => $attr_value ) {
					if ( empty( $attr_value ) ) {
						continue;
					}

					// Check if fontSize has a mapping
					$mapped_value = $attr_value;
					if ( 'fontSize' === $attr_key && ! empty( $base_style['mappings']['fontSize'][ $attr_value ]['value'] ) ) {
						$mapped_value = $base_style['mappings']['fontSize'][ $attr_value ]['value'];
					}

					// Convert camelCase to kebab-case for CSS variable
					$kebab_key = strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $attr_key ) );
					$variable_name = "--kbs-{$kebab_key}-{$preset_key}";
					
					$root_css .= "  {$variable_name}: {$mapped_value};\n";
				}
			}
		}

		// Wrap in :root selector
		if ( ! empty( $root_css ) ) {
			$css .= ":root {\n{$root_css}}\n";
		}

		return $css;
	}

	/**
	 * Get CSS variable name from category and token
	 *
	 * @param string $category The category name
	 * @param string $token The token name
	 * @param bool   $is_base Whether this is for base global variables
	 * @return string
	 */
	private function get_mapping_variable_name( $category, $token, $is_base = false ) {
		$prefix = 'kbs-';
		
		// Clean and convert category to slug
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $category ) );
		$category_slug = trim( $category_slug, '-' );
		
		// For base colors/gradients, use 'global' prefix
		if ( $is_base && ( 'colors' === $category_slug || 'gradients' === $category_slug ) ) {
			$category_slug = 'global';
			$prefix = '';
		}
		
		// Clean and convert token to slug
		$token_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $token ) );
		$token_slug = trim( $token_slug, '-' );
		
		return "--{$prefix}{$category_slug}-{$token_slug}";
	}
}