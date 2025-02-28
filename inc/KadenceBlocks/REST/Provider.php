<?php
/**
 * REST Provider
 *
 * @package KadenceWP\KadenceBlocks\REST
 */

namespace KadenceWP\KadenceBlocks\REST;

use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;

/**
 * Provider class
 */
class Provider {
	/**
	 * Register the REST controllers.
	 *
	 * @param ContainerInterface $container The container.
	 */
	public function register( ContainerInterface $container ): void {
		add_action( 'rest_api_init', function() {
			$fonts_controller = new FontsController();
			$fonts_controller->register_routes();

			$global_styles_controller = new GlobalStylesController();
			$global_styles_controller->register_routes();
		});
	}
} 