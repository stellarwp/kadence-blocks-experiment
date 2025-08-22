<?php
/**
 * Helper utility functions.
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;

/**
 * Helper utility class with static methods.
 */
class Helpers {

	/**
	 * Get the asset file produced by wp scripts.
	 *
	 * @param string $filepath the file path.
	 * @return array
	 */
	public static function get_asset_file( $filepath ) {
		$asset_path = KADENCE_BLOCKS_PATH . $filepath . '.asset.php';
		return file_exists( $asset_path )
			? include $asset_path
			: [
				'dependencies' => [ 'lodash', 'react', 'react-dom', 'wp-block-editor', 'wp-blocks', 'wp-data', 'wp-element', 'wp-i18n', 'wp-polyfill', 'wp-primitives', 'wp-api' ],
				'version'      => KADENCE_BLOCKS_VERSION,
			];
	}

	/**
	 * Get the stored Google Fonts data
	 *
	 * @return array Array of Google Fonts data
	 */
	public static function get_google_fonts() {
		$fonts_file = KADENCE_BLOCKS_PATH . 'inc/data/google-fonts.php';
		if ( ! file_exists( $fonts_file ) ) {
			return [];
		}
		
		return include $fonts_file;
	}

	/**
	 * Get the Google Font weights from the variants.
	 *
	 * @param array $variants The variants.
	 * @return array The Google Font weights.
	 */
	public static function get_google_font_weights_from_variants( $variants ) {
		$weights = [];
		
		if ( ! isset( $variants ) || ! is_array( $variants ) ) {
			return $weights;
		}
		
		// Map of Google Font weight names to numeric values.
		$weight_map = [
			'thin'        => '100',
			'extra-light' => '200',
			'ultra-light' => '200',
			'light'       => '300',
			'normal'      => '400',
			'regular'     => '400',
			'medium'      => '500',
			'semi-bold'   => '600',
			'demi-bold'   => '600',
			'bold'        => '700',
			'extra-bold'  => '800',
			'ultra-bold'  => '800',
			'black'       => '900',
			'heavy'       => '900',
			'lighter'     => 'lighter',
			'bolder'      => 'bolder',
		];
		
		foreach ( $variants as $variant ) {
			// Remove 'italic' suffix to get the weight.
			$weight = str_replace( 'italic', '', $variant );
			
			// If the weight is numeric, use it directly.
			if ( is_numeric( $weight ) ) {
				$weights[] = $weight;
			} elseif ( isset( $weight_map[ $weight ] ) ) {
				// Map named weights to numeric values.
				$weights[] = $weight_map[ $weight ];
			} elseif ( in_array( $weight, [ 'lighter', 'bolder' ], true ) ) {
				// Keep relative weights as-is.
				$weights[] = $weight;
			}
		}
		
		// Remove duplicates and sort.
		$weights = array_unique( $weights );
		sort( $weights );
		
		return $weights;
	}

	/**
	 * Get the Google Font styles from the variants.
	 *
	 * @param array $variants The variants.
	 * @return array The Google Font styles.
	 */
	public static function get_google_font_styles_from_variants( $variants ) {
		$styles = [ 'normal' ];
		if ( isset( $variants ) && is_array( $variants ) ) {
			// Use array_filter with strpos to check for italic variants more efficiently.
			$has_italic = array_filter(
				$variants,
				function ( $variant ) {
					return strpos( $variant, 'italic' ) !== false;
				}
			);
			
			if ( ! empty( $has_italic ) ) {
				$styles[] = 'italic';
			}
		}
		return $styles;
	}

	/**
	 * Update Google Fonts data using the Google Fonts API
	 *
	 * @param string $api_key Google Fonts API key
	 * @return bool|\WP_Error True on success, WP_Error on failure
	 */
	public static function update_google_fonts( $api_key ) {
		if ( empty( $api_key ) ) {
			return new \WP_Error( 'missing_api_key', 'Google Fonts API key is required' );
		}

		// Fetch variable fonts
		$fonts_url = add_query_arg(
			[
				'key'        => $api_key,
				'sort'       => 'alpha',
				'capability' => 'VF',
			],
			'https://www.googleapis.com/webfonts/v1/webfonts'
		);

		$response = wp_remote_get( $fonts_url );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );
		
		if ( ! isset( $data['items'] ) || ! is_array( $data['items'] ) ) {
			return new \WP_Error( 'invalid_response', 'Invalid response from Google Fonts API' );
		}

		// Process fonts
		$processed_fonts = [];
		foreach ( $data['items'] as $font ) {        
			$processed_fonts[ $font['family'] ] = [
				'family'      => $font['family'],
				'variants'    => $font['variants'],
				// 'styles'      => self::get_google_font_styles_from_variants( $font['variants'] ),
				'category'    => $font['category'],
				'is_variable' => isset( $font['axes'] ) ? true : false,
				'axes'        => $font['axes'] ?? [],
			];
		}

		// Ensure data directory exists
		$data_dir = KADENCE_BLOCKS_PATH . 'inc/data';
		if ( ! file_exists( $data_dir ) ) {
			wp_mkdir_p( $data_dir );
		}

		// Generate PHP file content
		$php_content = "<?php\n\n// This file is auto-generated. Do not edit manually.\nreturn " . var_export( $processed_fonts, true ) . ";\n";

		// Save to file
		$fonts_file  = $data_dir . '/google-fonts.php';
		$save_result = file_put_contents( $fonts_file, $php_content );

		if ( $save_result === false ) {
			return new \WP_Error( 'save_failed', 'Failed to save Google Fonts data' );
		}

		return true;
	}

	/**
	 * Check if we are in AMP Mode.
	 */
	public static function is_not_amp() {
		$not_amp = true;
		if ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) {
			$not_amp = false;
		}
		return $not_amp;
	}

	/**
	 * Check if we are in a rest api call.
	 */
	public static function is_rest() {
		$prefix = rest_get_url_prefix();
		if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( isset( $_GET['rest_route'] ) && strpos( $_GET['rest_route'], '/', 0 ) === 0 ) ) {
			return true;
		}
		// (#3).
		global $wp_rewrite;
		if ( $wp_rewrite === null ) {
			$wp_rewrite = new \WP_Rewrite();
		}
		// (#4).
		$rest_url    = wp_parse_url( trailingslashit( rest_url() ) );
		$current_url = wp_parse_url( add_query_arg( [] ) );

		if ( isset( $current_url['path'] ) && isset( $rest_url['path'] ) ) {
			return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
		}
		return false;
	}

	/**
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public static function hex2rgba( $hex, $alpha ) {
		if ( empty( $hex ) ) {
			return '';
		}
		if ( 'transparent' === $hex ) {
			return $hex;
		}
		$hex = str_replace( '#', '', $hex );
		if ( strlen( $hex ) == 3 ) {
			$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
			$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
			$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
		} else {
			$r = hexdec( substr( $hex, 0, 2 ) );
			$g = hexdec( substr( $hex, 2, 2 ) );
			$b = hexdec( substr( $hex, 4, 2 ) );
		}
		return 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
	}

	/**
	 * Check to see if variable contains a number including 0.
	 *
	 * @access public
	 *
	 * @param string $value - the css property.
	 * @return boolean
	 */
	public static function is_number( &$value ) {
		return isset( $value ) && is_numeric( $value );
	}

	/**
	 * Adds Animate on Scroll attributes to a wrapper args array, if animation attributes are present
	 *
	 * @param array $attributes The attributes.
	 * @param array $wrapper_args The args array to apply aos data to.
	 */
	public static function apply_aos_wrapper_args( $attributes, &$wrapper_args ) {
		if ( isset( $attributes['kadenceAnimation'] ) && $attributes['kadenceAnimation'] ) {
			$wrapper_args['data-aos'] = $attributes['kadenceAnimation'];
			if ( isset( $attributes['kadenceAOSOptions'] ) && $attributes['kadenceAOSOptions'] && isset( $attributes['kadenceAOSOptions'][0] ) ) {
				$kadence_aos_options = $attributes['kadenceAOSOptions'][0];

				if ( isset( $kadence_aos_options['offset'] ) && $kadence_aos_options['offset'] ) {
					$wrapper_args['data-aos-offset'] = $kadence_aos_options['offset'];
				}
				if ( isset( $kadence_aos_options['duration'] ) && $kadence_aos_options['duration'] ) {
					$wrapper_args['data-aos-duration'] = $kadence_aos_options['duration'];
				}
				if ( isset( $kadence_aos_options['easing'] ) && $kadence_aos_options['easing'] ) {
					$wrapper_args['data-aos-easing'] = $kadence_aos_options['easing'];
				}
				if ( isset( $kadence_aos_options['delay'] ) && $kadence_aos_options['delay'] ) {
					$wrapper_args['data-aos-delay'] = $kadence_aos_options['delay'];
				}
				if ( isset( $kadence_aos_options['once'] ) && '' !== $kadence_aos_options['once'] ) {
					$wrapper_args['data-aos-once'] = $kadence_aos_options['once'];
				}
			}
		}

		return $wrapper_args;
	}

	/**
	 * Clone of WooCommerce wc_clean function.
	 *
	 * @param $var
	 *
	 * @return array|mixed
	 */
	public static function wc_clean( $var ) {
		if ( is_array( $var ) ) {
			return array_map( [ self::class, 'wc_clean' ], $var );
		} else {
			return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
		}
	}

	/**
	 * Get the current license key for the plugin.
	 */
	public static function get_current_license_key() {
		$blocks_pro_key = class_exists( 'Kadence_Blocks_Pro' ) ? get_license_key( 'kadence-blocks-pro' ) : '';
		if ( ! empty( $blocks_pro_key ) ) {
			return $blocks_pro_key;
		}
		$creative_kit_key = class_exists( 'KadenceWP\CreativeKit\Core' ) ? get_license_key( 'kadence-creative-kit' ) : '';
		if ( ! empty( $creative_kit_key ) ) {
			return $creative_kit_key;
		}
		return get_license_key( 'kadence-blocks' );
	}

	/**
	 * Get the current product slug for the plugin.
	 */
	public static function get_current_product_slug() {
		$blocks_pro_key = class_exists( 'Kadence_Blocks_Pro' ) ? get_license_key( 'kadence-blocks-pro' ) : '';
		if ( ! empty( $blocks_pro_key ) ) {
			return 'kadence-blocks-pro';
		}
		$creative_kit_key = class_exists( 'KadenceWP\CreativeKit\Core' ) ? get_license_key( 'kadence-creative-kit' ) : '';
		if ( ! empty( $creative_kit_key ) ) {
			return 'kadence-creative-kit';
		}
		return 'kadence-blocks';
	}

	/**
	 * Get the current license email for the plugin.
	 */
	public static function get_current_license_email() {
		if ( ! empty( get_license_key( 'kadence-blocks-pro' ) ) ) {
			return '';
		} else {
			$license_data = self::get_deprecated_pro_license_data();
			if ( $license_data && ! empty( $license_data['api_email'] ) ) {
				return $license_data['api_email'];
			}
		}

		return '';
	}

	/**
	 * Get the current license data for the plugin.
	 *
	 * @return array{key: string, email: string, product: string}
	 */
	public static function get_current_license_data(): array {
		static $cache;

		if ( is_array( $cache ) ) {
			return $cache;
		}

		$license_data = [
			'key'     => self::get_current_license_key(),
			'email'   => self::get_current_license_email(),
			'product' => self::get_current_product_slug(),
		];

		return $cache = $license_data;
	}

	/**
	 * Check if ai is disabled.
	 */
	public static function is_ai_disabled() {
		if ( defined( 'KADENCE_BLOCKS_AI_DISABLED' ) && KADENCE_BLOCKS_AI_DISABLED ) {
			return true;
		}
		return false;
	}

	/**
	 * Check if network activation is enabled.
	 */
	public static function is_network_authorize_enabled() {
		if ( ! is_multisite() ) {
			return false;
		}
		$network_enabled = ! apply_filters( 'kadence_activation_individual_multisites', true );
		if ( ! $network_enabled && defined( 'KADENCE_ACTIVATION_NETWORK_ENABLED' ) && KADENCE_ACTIVATION_NETWORK_ENABLED ) {
			$network_enabled = true;
		}
		return $network_enabled;
	}

	/**
	 * Get the deprecated pro license data.
	 *
	 * @return array|false
	 */
	public static function get_deprecated_pro_license_data() {
		$data                   = false;
		$current_theme          = wp_get_theme();
		$current_theme_name     = $current_theme->get( 'Name' );
		$current_theme_template = $current_theme->get( 'Template' );
		// Check for a classic theme license.
		if ( 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template || 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template || 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template ) {
			$pro_data = get_option( 'kt_api_manager' );
			if ( $pro_data ) {
				$data['ithemes']  = '';
				$data['username'] = '';
				if ( 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template ) {
					$data['product_id'] = 'pinnacle_premium';
				} elseif ( 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template ) {
					$data['product_id'] = 'ascend_premium';
				} elseif ( 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template ) {
					$data['product_id'] = 'virtue_premium';
				}
				$data['api_key']   = $pro_data['kt_api_key'];
				$data['api_email'] = $pro_data['activation_email'];
			}
		} elseif ( is_multisite() && self::is_network_authorize_enabled() ) {
				$data = get_site_option( 'kt_api_manager_kadence_gutenberg_pro_data' );
		} else {
			$data = get_option( 'kt_api_manager_kadence_gutenberg_pro_data' );
		}
		return $data;
	}
}