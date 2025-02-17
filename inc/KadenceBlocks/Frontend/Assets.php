<?php
/**
 * Creates minified css via PHP.
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use WP_Block_Type_Registry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to create a minified css output.
 */
class Assets {
	/**
	 * Outputs css for blocks in the post content when using a classic theme.
	 */
	public function post_blocks_css() {
		if ( has_blocks( get_the_ID() ) ) {
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
	 * @param $post_object object of WP_Post.
	 */
	public function build_css_from_object( $post_object ) {
		if ( ! is_object( $post_object ) ) {
			return;
		}
		if ( ! method_exists( $post_object, 'post_content' ) ) {
			$post_content = apply_filters( 'kadence_blocks_pre_render_post_content', $post_object->post_content );
			$blocks = parse_blocks( $post_content );
			$this->css_parse( $blocks );
		}
	}
	/**
	 * Parse blocks for css.
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
					$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
					$block_class_instance = $this->container->get( $kbs_blocks[ $block['blockName'] ] );
					//$block_class_instance = $kbs_blocks[ $block['blockName'] ]::get_instance();
					$block_class_instance->output_head_data( $block, $block_type );
				}
			}
		}
	}
}
