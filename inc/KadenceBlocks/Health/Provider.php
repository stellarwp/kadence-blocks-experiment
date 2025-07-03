<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Health;

use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Uplink;
use KadenceWP\KadenceBlocks\Contracts\Service_Provider;
/**
 * Check the Health aka the status of requirements, dependencies or anything that
 * could affect the running of the plugin.
 */
class Provider extends Service_Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		// Only register health checks if Uplink is enabled
		// This ensures the View interface is available for Notice_Controller
		if ( ! Uplink::is_enabled() ) {
			return;
		}

		/*
		 * An array indexed by PHP function names to check are enabled and the Notice
		 * type to render if they aren't.
		 *
		 * Adjust as needed.
		 */
		$this->container->when( Required_Function_Verifier::class )
						->needs( '$function_map' )
						->give(
							static function (): array {
								return [
									'error_log'       => Notice::ERROR,
									'curl_multi_exec' => Notice::WARNING,
								];
							} 
						);

		add_action(
			'admin_notices',
			$this->container->callback( Required_Function_Verifier::class, 'verify_functions' )
		);
	}
}
