<?php
/**
 * Plugin Name: Kadence Blocks – Gutenberg Blocks for Page Builder Features
 * Plugin URI: https://www.kadencewp.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts, backgrounds, dual buttons, icons etc.
 * Author: Kadence WP
 * Author URI: https://www.kadencewp.com
 * Version: 4.0.0
 * Requires PHP: 7.4
 * Text Domain: kadence-blocks
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'KADENCE_BLOCKS_PATH', realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'KADENCE_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'KADENCE_BLOCKS_VERSION', '4.0.0' );

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';
require_once plugin_dir_path( __FILE__ ) . '/inc/functions/helper-functions.php';
require_once plugin_dir_path( __FILE__ ) . '/inc/functions/app.php';


// Get the plugin's singleton instance.


add_action(
	'plugins_loaded',
	static function (): void {
		$core = kbs_plugin();
		$core->init();
	},
	1
);

/**
 * Add a check before redirecting.
 */
function kadence_blocks_activate(): void {
	add_option( 'kadence_blocks_redirect_on_activation', true );
}
register_activation_hook( __FILE__, 'kadence_blocks_activate' );

/**
 * Load Plugin.
 */
function kadence_blocks_init(): void {
	$container = kbs_container();

	// require_once KADENCE_BLOCKS_PATH . 'includes/init.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/form-ajax.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/helper-functions.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-editor-assets.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-schema-updater.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-google-fonts.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-helper.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-css.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-frontend.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-table-of-contents.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-duplicate-post.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-cpt-import-export.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-abstract-block.php';

	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-row-layout-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-column-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-accordion-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advancedgallery-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advancedbtn-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-singlebtn-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advanced-heading-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-countdown-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-countup-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-form-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-googlemaps-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-icon-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-single-icon-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-icon-list-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-single-icon-list-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-infobox-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-image-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-lottie-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-identity-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-posts-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-progress-bar-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-search-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-show-more-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-spacer-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-data-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-row-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-of-contents-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-tabs-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonials-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonial-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-navigation-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-navigation-link-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-header-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-videopopup-block.php';

	// require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-settings.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-posts-rest-api.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library-rest-api.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-mailerlite-form-rest-api.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-fluentcrm-form-rest-api.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-get-rest-api.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-post-rest-api.php';
	// // Advanced Form.
	// require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-init.php';
	// // Navigation
	// require_once KADENCE_BLOCKS_PATH . 'includes/navigation/class-kadence-navigation-cpt.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/navigation/class-kadence-navigation-rest.php';
	// // Header
	// require_once KADENCE_BLOCKS_PATH . 'includes/header/class-kadence-header-cpt.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/header/class-kadence-header-rest.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-container-desktop-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-container-tablet-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-section-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-row-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-column-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-off-canvas-block.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-off-canvas-trigger-block.php';

	// // SVG render.
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-svg.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-local-gfonts.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker-rest.php';
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker.php';

	// /**
	// * Site Health.
	// */
	// require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-site-health.php';

	/**
	 * AI-specific usage tracking. Only track if AI is opted in by user.
	 */
	// require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-ai-events.php';
	// $ai_events = new Kadence_Blocks_AI_Events();
	// $ai_events->register();

	do_action( 'kadence_blocks_uplink_loaded' );
}
// add_action( 'plugins_loaded', 'kadence_blocks_init', 2 );

/**
 * Load the plugin textdomain
 */
function kadence_blocks_lang(): void {
	load_plugin_textdomain( 'kadence-blocks', false, basename( __DIR__ ) . '/languages' );
}
// add_action( 'init', 'kadence_blocks_lang' );
