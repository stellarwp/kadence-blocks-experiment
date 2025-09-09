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
use KadenceWP\KadenceBlocks\Blocks\KBS\Text;
use KadenceWP\KadenceBlocks\Blocks\KBS\Buttons;
use KadenceWP\KadenceBlocks\Blocks\KBS\Button;
use KadenceWP\KadenceBlocks\Blocks\KBS\Image;
use KadenceWP\KadenceBlocks\Frontend\CSS_Engine;
use KadenceWP\KadenceBlocks\Frontend\Font_Engine;
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
		$this->container->singleton( CSS_Engine::class, CSS_Engine::class );
		$this->container->singleton( Font_Engine::class, Font_Engine::class );


		// Register Container block.
		$this->container->singleton( Container::class, Container::class );
		add_action( 'init', $this->container->callback( Container::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Container::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/container', $this->container->callback( Container::class, 'output_head_data' ), 10, 2 );
		
		// Register Text block.
		$this->container->singleton( Text::class, Text::class );
		add_action( 'init', $this->container->callback( Text::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Text::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/text', $this->container->callback( Text::class, 'output_head_data' ), 10, 2 );

		// // Register Row block.
		// $this->container->singleton( Row::class, Row::class );
		// add_action( 'init', $this->container->callback( Row::class, 'on_init' ), 20 );
		// add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Row::class, 'register_blocks_to_generate_post_css' ) );
		// add_action( 'kbs_blocks_generate_post_css_kbs/row', $this->container->callback( Row::class, 'output_head_data' ), 10, 2 );

		// Register Buttons block.
		$this->container->singleton( Buttons::class, Buttons::class );
		add_action( 'init', $this->container->callback( Buttons::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Buttons::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/buttons', $this->container->callback( Buttons::class, 'output_head_data' ), 10, 2 );

		// Register Button block.
		$this->container->singleton( Button::class, Button::class );
		add_action( 'init', $this->container->callback( Button::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Button::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/button', $this->container->callback( Button::class, 'output_head_data' ), 10, 2 );

		// Register Image block.
		$this->container->singleton( Image::class, Image::class );
		add_action( 'init', $this->container->callback( Image::class, 'on_init' ), 20 );
		add_filter( 'kbs_blocks_to_generate_post_css', $this->container->callback( Image::class, 'register_blocks_to_generate_post_css' ) );
		add_action( 'kbs_blocks_generate_post_css_kbs/image', $this->container->callback( Image::class, 'output_head_data' ), 10, 2 );
		
		// Register Editor Global Styles for preventing unstyled content while page is loading.
		$this->container->singleton( Editor_Global_Styles::class, Editor_Global_Styles::class );
		add_action( 'init', $this->container->callback( Editor_Global_Styles::class, 'on_init' ), 10 );
		
		// Register the editor scripts.
		add_action( 'init', $this->container->callback( Editor_Assets::class, 'on_init_editor_assets' ), 10 );
		add_action( 'enqueue_block_editor_assets', $this->container->callback( Editor_Assets::class, 'editor_plugin_enqueue' ), 10 );
		add_filter( 'kbs_editor_global_styles_css', $this->container->callback( Editor_Assets::class, 'editor_global_styles' ), 10 );
	}
}
