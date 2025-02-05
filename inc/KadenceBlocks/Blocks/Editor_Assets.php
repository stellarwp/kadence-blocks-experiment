<?php
/**
 * Handles all functionality related to the A/B Testing Block
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Blocks;

use function kbs_get_asset_file;
/**
 * Handles all functionality related to the A/B Testing Block.
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */
class Editor_Assets {
	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 1.0.0
	 */
	public function on_init_editor_assets() {
		// If in the frontend, bail out.
		if ( ! is_admin() ) {
			return;
		}
		// Icons Scripts & Styles.
		$kadence_icons_meta = kbs_get_asset_file( 'dist/icons' );
		wp_register_script( 'kadence-icons', KADENCE_BLOCKS_URL . 'dist/icons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-icons', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/helpers' );
		wp_register_script( 'kadence-helpers', KADENCE_BLOCKS_URL . 'dist/helpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-helpers', 'kadence-blocks' );

		$kadence_base = kbs_get_asset_file( 'dist/extension-kadence-base' );
		wp_register_script( 'kadence-blocks-js', KADENCE_BLOCKS_URL . 'dist/extension-kadence-base.js', array_merge( $kadence_base['dependencies'], [ 'wp-api' ] ), $kadence_base['version'], true );
		// // Block CSS Scripts & Styles.
		$kadence_stores_meta = kbs_get_asset_file( 'dist/extension-stores' );
		wp_register_script( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension-stores.js', array_merge( $kadence_stores_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_stores_meta['version'], true );
		wp_register_style( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension/stores.css', [ 'wp-edit-blocks' ], $kadence_stores_meta['version'] );
		wp_set_script_translations( 'kadence-extension-stores', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/components' );
		wp_register_script( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-components', 'kadence-blocks' );

		// Block CSS Scripts & Styles.
		$kadence_block_css_meta = kbs_get_asset_file( 'dist/extension-block-css' );
		wp_register_script( 'kadence-extension-block-css', KADENCE_BLOCKS_URL . 'dist/extension-block-css.js', array_merge( $kadence_block_css_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_block_css_meta['version'], true );
		wp_set_script_translations( 'kadence-extension-block-css', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/kbsHelpers' );
		wp_register_script( 'kadence-kbsHelpers', KADENCE_BLOCKS_URL . 'dist/kbsHelpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-kbsHelpers', 'kadence-blocks' );
		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/kbsComponents' );
		wp_register_script( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-kbsComponents', 'kadence-blocks' );

		$blocks = [
			'container',
		];
		foreach ( $blocks as $block ) {
			$meta   = kbs_get_asset_file( sprintf( 'dist/kbs-%s', $block ) );
			$handle = sprintf( 'kbs-%s', $block );

			wp_register_style( $handle, sprintf( '%sdist/kbs-%s.css', KADENCE_BLOCKS_URL, $block ), [ 'wp-edit-blocks', 'kadence-components', 'kadence-kbsComponents' ], $meta['version'] );
			wp_set_script_translations( $handle, 'kadence-blocks' );
		}
	}
}
