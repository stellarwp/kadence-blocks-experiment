<?php
/**
 * The provider hooking Admin class methods to WordPress events.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The provider for all Admin related functionality.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */
class Provider extends Service_Provider {

	/**
	 * {@inheritdoc}
	 */
	public function register(): void {
		// add_action( 'init', $this->container->callback( CSS_Engine::class, 'register_scripts' ) );
		// add_action( 'wp_enqueue_scripts', $this->container->callback( CSS_Engine::class, 'frontend_inline_css' ), 19 );
		// add_filter( 'kadence_blocks_frontend_build_css', $this->container->callback( CSS_Engine::class, 'output_css_when_rendered_outside_post_content' ) );
	}
}
