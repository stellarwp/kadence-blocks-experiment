<?php
/**
 * The provider hooking Admin class methods to WordPress events.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\Blocks;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;
use KadenceWP\KadenceBlocks\Blocks\KBS\Container;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The provider for all Block related functionality.
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
		$this->container->singleton( Container::class, Container::class );
		add_action( 'init', $this->container->callback( Container::class, 'on_init' ), 20 );
		// Register the editor scripts.
		add_action( 'init', $this->container->callback( Editor_Assets::class, 'on_init_editor_assets' ), 10 );
	}
}
