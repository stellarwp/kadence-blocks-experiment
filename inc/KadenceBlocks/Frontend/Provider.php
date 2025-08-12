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
		$this->container->bind( Assets::class, new Assets( $this->container ) );
		$this->container->singleton( CSS_Engine::class, CSS_Engine::class );
		$this->container->singleton( Font_Engine::class, Font_Engine::class );
		$this->container->singleton( Svg_Render::class, Svg_Render::class );
		$this->container->singleton( Global_Style_Css::class, Global_Style_Css::class );
		$this->container->singleton( CSS_Variable_Detector::class, CSS_Variable_Detector::class );
		add_action( 'wp_enqueue_scripts', $this->container->callback( Assets::class, 'post_blocks_css' ), 19 );
		add_action( 'wp_enqueue_scripts', $this->container->callback( CSS_Engine::class, 'frontend_block_css' ), 180 );
		add_action( 'wp_head', $this->container->callback( Global_Style_Css::class, 'output_style_usage' ), 999 );
	}
}
