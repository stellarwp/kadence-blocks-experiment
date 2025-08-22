<?php
/**
 * Application/Plugin specific functions.
 */

declare( strict_types=1 );

use KadenceWP\KadenceBlocks\Container;
use KadenceWP\KadenceBlocks\Core;
use KadenceWP\KadenceBlocks\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Initialize the plugin singleton and ensure we only have a single
 * instance of our container.
 *
 * @return Core
 */
function kbs_plugin(): Core {
	// This singleton will not use a new container if one is already set.
	return Core::instance();
}

/**
 * Log to the error log if WP_DEBUG is set to true.
 *
 * @param string|mixed[] $data The data to log.
 *
 * @return void
 */
function kbs_log( $data ): void {
	if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG || ! function_exists( 'error_log' ) ) {
		return;
	}

	if ( is_array( $data ) ) {
		$data = print_r( $data, true );
	}

	error_log( $data );
}
/**
 * The Kadence Blocks Application Container.
 *
 * @see kbs_plugin()
 *
 * @note kbs_plugin() must be called before this one.
 *
 * @return Container
 * @throws InvalidArgumentException
 */
function kbs_container() {
	$core = Core::instance();
	if ( ! $core ) {
		throw new InvalidArgumentException( 'Core instance not initialized. Make sure kbs_plugin() is called first.' );
	}
	
	$container = $core->container();
	if ( ! $container ) {
		throw new InvalidArgumentException( 'Container not initialized.' );
	}
	
	return $container;
}

// Wrapper functions for backwards compatibility with existing code
// These call the static methods in the Helpers class

/**
 * @see Helpers::get_asset_file()
 */
function kbs_get_asset_file( $filepath ) {
	return Helpers::get_asset_file( $filepath );
}

/**
 * @see Helpers::get_google_fonts()
 */
function kbs_get_google_fonts() {
	return Helpers::get_google_fonts();
}

/**
 * @see Helpers::get_google_font_weights_from_variants()
 */
function kbs_get_google_font_weights_from_variants( $variants ) {
	return Helpers::get_google_font_weights_from_variants( $variants );
}

/**
 * @see Helpers::get_google_font_styles_from_variants()
 */
function kbs_get_google_font_styles_from_variants( $variants ) {
	return Helpers::get_google_font_styles_from_variants( $variants );
}

/**
 * @see Helpers::update_google_fonts()
 */
function kbs_update_google_fonts( $api_key ) {
	return Helpers::update_google_fonts( $api_key );
}

/**
 * @see Helpers::is_not_amp()
 */
function kbs_is_not_amp() {
	return Helpers::is_not_amp();
}

/**
 * @see Helpers::is_rest()
 */
function kbs_is_rest() {
	return Helpers::is_rest();
}

/**
 * @see Helpers::hex2rgba()
 */
function kbs_hex2rgba( $hex, $alpha ) {
	return Helpers::hex2rgba( $hex, $alpha );
}

/**
 * @see Helpers::is_number()
 */
function kbs_is_number( &$value ) {
	return Helpers::is_number( $value );
}

/**
 * @see Helpers::apply_aos_wrapper_args()
 */
function kbs_apply_aos_wrapper_args( $attributes, &$wrapper_args ) {
	return Helpers::apply_aos_wrapper_args( $attributes, $wrapper_args );
}

/**
 * @see Helpers::wc_clean()
 */
function kbs_wc_clean( $var ) {
	return Helpers::wc_clean( $var );
}

/**
 * @see Helpers::get_current_license_key()
 */
function kbs_get_current_license_key() {
	return Helpers::get_current_license_key();
}

/**
 * @see Helpers::get_current_product_slug()
 */
function kbs_get_current_product_slug() {
	return Helpers::get_current_product_slug();
}

/**
 * @see Helpers::get_current_license_email()
 */
function kbs_get_current_license_email() {
	return Helpers::get_current_license_email();
}

/**
 * @see Helpers::get_current_license_data()
 */
function kbs_get_current_license_data() {
	return Helpers::get_current_license_data();
}

/**
 * @see Helpers::is_ai_disabled()
 */
function kbs_is_ai_disabled() {
	return Helpers::is_ai_disabled();
}

/**
 * @see Helpers::is_network_authorize_enabled()
 */
function kbs_is_network_authorize_enabled() {
	return Helpers::is_network_authorize_enabled();
}

/**
 * @see Helpers::get_deprecated_pro_license_data()
 */
function kbs_get_deprecated_pro_license_data() {
	return Helpers::get_deprecated_pro_license_data();
}
