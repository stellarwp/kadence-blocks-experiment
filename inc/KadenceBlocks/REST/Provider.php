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
		add_action(
			'rest_api_init',
			function () {
				$fonts_controller = new Fonts_Controller();
				$fonts_controller->register_routes();

				$icons_controller = new Icons_Controller();
				$icons_controller->register_routes();

				$global_styles_controller = new Global_Styles_Controller();
				$global_styles_controller->register_routes();

				$ai_admin_controller = new Ai_Admin_Controller();
				$ai_admin_controller->register_routes();

				// Prebuilt Library Controllers
				$prebuilt_patterns_controller = new Prebuilt_Patterns_Controller();
				$prebuilt_patterns_controller->register_routes();

				$prebuilt_templates_controller = new Prebuilt_Templates_Controller();
				$prebuilt_templates_controller->register_routes();

				$prebuilt_cloud_controller = new Prebuilt_Cloud_Controller();
				$prebuilt_cloud_controller->register_routes();

				$prebuilt_ai_controller = new Prebuilt_AI_Controller();
				$prebuilt_ai_controller->register_routes();
			}
		);
	}
}
