<?php
/**
 * Creates minified css via PHP.
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Container;
use WP_Block_Type_Registry;
use KadenceWP\KadenceBlocks\Blocks\KBS\Container as KBS_Container;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to create a minified css output.
 */
class Assets {
	/**
	 * The container instance.
	 *
	 * @var Container
	 */
	protected Container $container;

	/**
	 * @param  Container $container The container instance.
	 */
	public function __construct( Container $container ) {
		$this->container = $container;
	}
	/**
	 * Outputs css for blocks in the post content when using a classic theme.
	 */
	public function post_blocks_css() {
		if ( ! wp_is_block_theme() && has_blocks( get_the_ID() ) ) {
			global $post;
			if ( ! is_object( $post ) ) {
				return;
			}
			$this->build_css_from_object( $post );
		}
	}
	/**
	 * Outputs css for blocks from a post object.
	 *
	 * @param object $post_object object of WP_Post.
	 */
	public function build_css_from_object( $post_object ) {
		if ( ! is_object( $post_object ) ) {
			return;
		}
		if ( ! method_exists( $post_object, 'post_content' ) ) {
			$post_content = apply_filters( 'kadence_blocks_pre_render_post_content', $post_object->post_content );
			$blocks       = parse_blocks( $post_content );
			$this->css_parse( $blocks );
		}
	}
	/**
	 * Parse blocks for css.
	 *
	 * @param array $blocks array of blocks.
	 */
	public function css_parse( $blocks ) {
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return;
		}
		$kbs_blocks = apply_filters( 'kbs_blocks_to_generate_post_css', [] );
		foreach ( $blocks as $indexkey => $block ) {
			if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
				if ( isset( $kbs_blocks[ $block['blockName'] ] ) ) {
					$block_type           = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
					do_action( 'kbs_blocks_generate_post_css_' . $block['blockName'], $block, $block_type );
				}
			}
			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$this->css_parse_inner_blocks( $block['innerBlocks'], $kbs_blocks );
			}
		}
	}
	/**
	 * Parse blocks for css.
	 *
	 * @param array $blocks array of blocks.
	 * @param array $kbs_blocks array of kbs blocks.
	 */
	public function css_parse_inner_blocks( $blocks, $kbs_blocks ) {
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return;
		}
		foreach ( $blocks as $indexkey => $block ) {
			if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
				if ( isset( $kbs_blocks[ $block['blockName'] ] ) ) {
					$block_type           = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
					do_action( 'kbs_blocks_generate_post_css_' . $block['blockName'], $block, $block_type );
				}
			}
			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$this->css_parse_inner_blocks( $block['innerBlocks'], $kbs_blocks );
			}
		}
	}
}
