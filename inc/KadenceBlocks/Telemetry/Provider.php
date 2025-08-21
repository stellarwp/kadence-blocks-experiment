<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Telemetry;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core as Telemetry;

class Provider extends Service_Provider {

	/**
	 * Telemetry library related functionality.
	 *
	 * @return void
	 */
	public function register(): void {
		
		Config::set_container( $this->container );
		Config::set_server_url( 'https://telemetry.stellarwp.com/api/v1' );
		Config::set_hook_prefix( 'kadence-blocks' );
		Config::set_stellar_slug( 'kadence-blocks' );
		Telemetry::instance()->init( KADENCE_BLOCKS_PATH . 'kadence-blocks.php' );
		
		// Register AI-specific usage tracking. Only track if AI is opted in by user.
		$ai_events = new AI_Events();
		$ai_events->register();
	}
}
