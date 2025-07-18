<?php
/**
 * Generates CSS for Global Styles.
 */

namespace KadenceWP\KadenceBlocks\Frontend;
use KadenceWP\KadenceBlocks\Settings\Global_Style;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to generate CSS for Global Styles.
 */
class Global_Style_Css {

	/**
	 * CSS Engine instance.
	 *
	 * @var CSS_Engine
	 */
	private $css;

	/**
	 * Global Styles data.
	 *
	 * @var array
	 */
	private $global_styles = null;
	/**
	 * Responsive device options.
	 *
	 * @var array
	 */
	private $device_options;

	/**
	 * Constructor
	 *
	 * @param CSS_Engine $css_engine The CSS Engine instance.
	 * @param array      $device_options Responsive device options.
	 */
	public function __construct( CSS_Engine $css_engine, $device_options ) {
		$this->css = $css_engine;
		$this->device_options = $device_options;
	}

	/**
	 * Fetches global styles from the REST API endpoint.
	 */
	private function fetch_global_styles() {
		$global_style_data = Global_Style::get_global_styles();
		if ( ! $global_style_data ) {
			return [];
		}

		return $global_style_data;
	}

	/**
	 * Check if global styles data was successfully loaded.
	 *
	 * @return bool
	 */
	public function has_data() {
		return ! empty( $this->global_styles );
	}

	/**
	 * Get the non inheritable attribute for a component.
	 *
	 * @param string $component The component name.
	 * @return bool
	 */
	private function get_non_inheritable_attribute( $component ) {
		switch ( $component ) {
			case 'typography':
				return false;
			default:
				return true;
		}
	}
	/**
	 * Get the component selector.
	 *
	 * @param string $component The component name.
	 * @return string
	 */
	private function get_component_selector( $component ) {
		switch ( $component ) {
			case 'typography':
				return '--kbs-typo-';
			default:
				return '';
		}
	}
	/**
	 * Generates the CSS variables.
	 */
	public function generate_css() {
        if( null === $this->global_styles ) {
            $this->global_styles = $this->fetch_global_styles();
        }

		if ( empty( $this->global_styles ) || ! is_array( $this->global_styles ) ) {
			return;
		}
		$this->css->set_style_id( 'kbs-global-styles' );

		foreach ( $this->global_styles as $style_id => $style_data ) {
			$current_root_css_block = '';
			$current_scoped_css_blocks = []; // [selector => [prop => value]]

			// --- Mappings --- 
			if ( ! empty( $style_data['mappings'] ) && is_array( $style_data['mappings'] ) ) {
				foreach ( $style_data['mappings'] as $category => $tokens ) {
					if ( ! empty( $tokens ) && is_array( $tokens ) ) {
						foreach ( $tokens as $token => $token_data ) {
							if ( isset( $token_data['value'] ) && $token_data['value'] !== '' ) {
								$variable_name = self::get_mapping_variable_name( $category, $token );
								// Mappings apply globally, no media queries needed here.
								if ( 'kbs-base' === $style_id ) {
									$this->css->set_selector( ':root' );
									if ( 'colors' === $category ) {
										// Add the base global variable for colors.
										$this->css->add_property( '--global-' . strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', (string) $token ) ), $token_data['value'] );
									}
									$this->css->add_property( $variable_name, $token_data['value'] );
								} else {
									$selector = $this->get_style_selector( $style_id );
									$this->css->set_selector( $selector );
									$this->css->add_property( $variable_name, $token_data['value'] );
								}
							}
						}
					}
				}
			}

			// // Components
			// if ( ! empty( $style_data['components'] ) && is_array( $style_data['components'] ) ) {
			// 	foreach ( $style_data['components'] as $component => $component_data ) {
			// 		if ( ! empty( $component_data['presets'] ) && is_array( $component_data['presets'] ) ) {
			// 			foreach ( $component_data['presets'] as $preset => $preset_data ) {
			// 				$component_attributes = $preset_data['attributes'] ?? [];
			// 				$component_meta = [
			// 					'component' => $component,
			// 					'nonInheritable' => $this->get_non_inheritable_attribute( $component ),
			// 					'selector' => $this->get_component_selector( $component ),
			// 				];
			// 				$this->css->set_selector( '.' . $preset );
			// 				$this->css->add_component( $component, [$component => $component_attributes], $component_meta );
			// 			}
			// 		}					
			// 	}
			// }
		}
		$this->css->css_output();
	}

	/**
	 * Get the CSS selector for a given style ID.
	 *
	 * @param string $style_id The style ID (e.g., 'kbs-style-abc').
	 * @return string The CSS selector (e.g., '.kbs-global-style-abc').
	 */
	private function get_style_selector( $style_id ) {
		$style_slug = preg_replace( '/[^a-zA-Z0-9-_]/', '-', $style_id );
		$style_slug = trim( $style_slug, '-' );
		return '.kbs-global-style-' . $style_slug;
	}

    /**
	 * Gets variable name from category and type (PHP equivalent of JS function).
	 *
	 * @param string $category The style category (e.g., 'color', 'typography').
	 * @param string $type The style type or token name (e.g., 'primary', 'body').
	 * @return string The CSS variable name.
	 */
	public static function get_mapping_variable_name( $category, $type ) {
		// First convert camelCase to kebab-case, then clean up
		$category_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $category );
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $category_slug ) );
		$category_slug = trim( $category_slug, '-' );

		$type_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $type );
		$type_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $type_slug ) );
		$type_slug = trim( $type_slug, '-' );

		return sprintf( '--kbs-%s-%s', $category_slug, $type_slug );
	}

} 