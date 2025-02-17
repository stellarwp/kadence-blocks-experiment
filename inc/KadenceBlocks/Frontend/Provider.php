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
		$this->container->singleton( CSS_Engine::class, CSS_Engine::class );
		$this->container->bind( Assets::class, new Assets( $this->container ) );
		add_action( 'wp_enqueue_scripts', $this->container->callback( Assets::class, 'post_blocks_css' ), 19 );
		add_action( 'wp_enqueue_scripts', $this->container->callback( CSS_Engine::class, 'frontend_block_css' ), 180 );
	}
}
