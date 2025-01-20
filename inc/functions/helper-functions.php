<?php
/**
 * Handles all functionality related to the A/B Testing Block
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

/**
 * Get the asset file produced by wp scripts.
 *
 * @param string $filepath the file path.
 * @return array
 */
function kbs_get_asset_file( $filepath ) {
	$asset_path = KADENCE_BLOCKS_PATH . $filepath . '.asset.php';
	return file_exists( $asset_path )
		? include $asset_path
		: [
			'dependencies' => [ 'lodash', 'react', 'react-dom', 'wp-block-editor', 'wp-blocks', 'wp-data', 'wp-element', 'wp-i18n', 'wp-polyfill', 'wp-primitives', 'wp-api' ],
			'version'      => KADENCE_BLOCKS_VERSION,
		];
}