<?php
/**
 * Generates CSS for Global Styles.
 */

namespace KadenceWP\KadenceBlocks\Frontend;

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
	private $global_styles = [];
	/**
	 * Responsive device options.
	 *
	 * @var array
	 */
	private $device_options;

	/**
	 * Special typography presets handled differently.
	 *
	 * @var array
	 */
	private static $special_typography_presets = [
		'body',
		'heading',
		'heading-1',
		'heading-2',
		'heading-3',
		'heading-4',
		'heading-5',
		'heading-6',
	];

	/**
	 * Constructor
	 *
	 * @param CSS_Engine $css_engine The CSS Engine instance.
	 * @param array      $device_options Responsive device options.
	 */
	public function __construct( CSS_Engine $css_engine, $device_options ) {
		$this->css = $css_engine;
		$this->device_options = $device_options;
        $this->global_styles = $this->fetch_global_styles();
	}

	/**
	 * Fetches global styles from the REST API endpoint.
	 */
	private function fetch_global_styles() {
		$request = new \WP_REST_Request( 'GET', '/kadence-blocks/v1/global-styles/get-demo' );
		$response = rest_do_request( $request );

		if ( $response->is_error() || $response->get_status() !== 200 ) {
			return [];
		}

		$data = $response->get_data();

		if ( ! is_array( $data ) ) {
			return [];
		}

		return $data;
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
	 * Generates the CSS variables.
	 */
	public function generate_css() {
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

			// Components
			if ( ! empty( $style_data['components'] ) && is_array( $style_data['components'] ) ) {
				foreach ( $style_data['components'] as $component => $component_data ) {
					if ( 'typography' === $component && ! empty( $component_data['presets'] ) && is_array( $component_data['presets'] ) ) {
						foreach ( $component_data['presets'] as $preset => $preset_data ) {
							if ( in_array( $preset, self::$special_typography_presets ) && ! empty( $preset_data['attributes'] ) && is_array( $preset_data['attributes'] ) ) {
								
								$all_device_attributes = [];
								foreach ( $this->device_options as $device_info ) {
									$device_key = strtolower( $device_info['key'] ?? $device_info['name'] );
									if ( ! empty( $preset_data['attributes'][ $device_key ] ) && is_array( $preset_data['attributes'][ $device_key ] ) ) {
										$all_device_attributes[ $device_key ] = $preset_data['attributes'][ $device_key ];
									}
								}
								
								// Generate CSS per device
								foreach ( $this->device_options as $device_info ) {
									$device_key = strtolower( $device_info['key'] ?? $device_info['name'] );
									$attributes = $all_device_attributes[ $device_key ] ?? null;

									if ( ! empty( $attributes ) && is_array( $attributes ) ) {
										$this->css->set_media_state( $device_key );

										foreach ( $attributes as $key => $value ) {
											$kebab_case_key = strtolower(preg_replace( '/(?<!^)[A-Z]/', '-$0', $key ));
											$variable_name = self::get_mapping_variable_name( $kebab_case_key, $preset );
											$return_value = $value;

											if (
												'fontSize' === $key &&
												is_string( $value ) && // Mappings for sm, md, lg, xl
												! empty( $style_data['mappings']['fontSize'][ $value ] ) &&
												isset( $style_data['mappings']['fontSize'][ $value ]['value'] )
											) {
												$return_value = $style_data['mappings']['fontSize'][ $value ]['value'];
											}

											// Add rule using CSS Engine
											if ( 'kbs-base' === $style_id ) {
												$this->css->set_selector( ':root' );
												$this->css->add_property( $variable_name, $return_value );
											} else {
												$selector = $this->get_style_selector( $style_id );
												$this->css->set_selector( $selector );
												$this->css->add_property( $variable_name, $return_value );
											}
										}
										$this->css->set_media_state( 'desktop' );
									}
								}
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Get the CSS selector for a given style ID.
	 *
	 * @param string $style_id The style ID (e.g., 'kbs-style-abc').
	 * @return string The CSS selector (e.g., '.kbs-global-style-abc').
	 */
	private function get_style_selector( $style_id ) {
		$style_slug = str_replace( 'kbs-', '', $style_id );
		$style_slug = preg_replace( '/[^a-zA-Z0-9-_]/', '-', $style_slug );
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
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', (string) $category ) );
		$category_slug = trim( $category_slug, '-' );

		$type_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', (string) $type ) );
		$type_slug = trim( $type_slug, '-' );

		return sprintf( '--kbs-%s-%s', $category_slug, $type_slug );
	}

} 