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
use KadenceWP\KadenceBlocks\Frontend\CSS_Engine;
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
		$this->container->when( Container::class )
			->needs( CSS_Engine::class )
			->give( $this->container->get( CSS_Engine::class ) );
		$this->container->singleton( Container::class, Container::class );
		add_action( 'init', $this->container->callback( Container::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Container::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/container', $this->container->callback( Container::class, 'output_head_data' ), 10, 2 );
		// Register the editor scripts.
		add_action( 'init', $this->container->callback( Editor_Assets::class, 'on_init_editor_assets' ), 10 );
	}
}
