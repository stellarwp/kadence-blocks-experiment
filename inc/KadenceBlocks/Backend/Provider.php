<?php
/**
 * The provider hooking Admin class methods to WordPress events.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\Backend;

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
		add_action( 'init', function() {
			$gs_cpt = new Global_Style_CPT();
		});
	}
}
