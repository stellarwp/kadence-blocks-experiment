<?php
/**
 * Application/Plugin specific functions.
 */

declare( strict_types=1 );

use KadenceWP\KadenceBlocks\Container;
use KadenceWP\KadenceBlocks\Core;

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
