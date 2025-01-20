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
		// Register the Blocks.
		add_action( 'init', $this->container->callback( AB_Block::class, 'ab_testing_block' ) );
		add_action( 'init', $this->container->callback( AB_Block::class, 'register_scripts' ) );
		add_action( 'wp_footer', $this->container->callback( AB_Block::class, 'ab_test_data_enqueue' ), 9 );
		add_action( 'wp_enqueue_scripts', $this->container->callback( AB_Block::class, 'frontend_inline_css' ), 19 );
		add_filter( 'kadence_blocks_frontend_build_css', $this->container->callback( AB_Block::class, 'output_css_when_rendered_outside_post_content' ) );
	}
}
