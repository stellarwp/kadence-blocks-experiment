<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Uplink;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Config as UplinkConfig;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Register as UplinkRegister;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Uplink;

class Provider extends Service_Provider {

	/**
	 * Uplink library related functionality.
	 *
	 * @return void
	 */
	public function register(): void {
		$this->register_multisite_configuration();
		add_filter( 'stellarwp/uplink/kadence-blocks/prevent_update_check', '__return_true' );
		add_filter(
			'stellarwp/uplink/kadence-blocks/api_get_base_url',
			static function () {
				return 'https://licensing.kadencewp.com';
			},
			10,
			0
		);
		add_action( 'plugins_loaded', $this->container->callback( $this, 'register_configuration' ), 10 );
	}
	/**
	 * Register the Uplink configuration.
	 *
	 * @return void
	 */
	public function register_configuration(): void {
		/**
		 * Uplink.  
		 */
		UplinkConfig::set_container( $this->container );
		UplinkConfig::set_hook_prefix( 'kadence-blocks' );
		UplinkConfig::set_token_auth_prefix( 'kadence' );
		UplinkConfig::set_auth_cache_expiration( WEEK_IN_SECONDS );
		Uplink::init();

		UplinkRegister::plugin(
			'kadence-blocks',
			'Kadence Blocks',
			KADENCE_BLOCKS_VERSION,
			'kadence-blocks/kadence-blocks.php',
			Kadence_Blocks::class
		);
	}

	/**
	 * Store tokens/license keys at the network level if the "kadence individual multisites" setting is disabled.
	 *
	 * @return void
	 */
	private function register_multisite_configuration(): void {
		add_action(
			'init',
			static function (): void {
				$network_enabled = kbs_is_network_authorize_enabled();
				add_filter(
					'stellarwp/uplink/kadence-blocks/allows_network_subfolder_license',
					static function () use ( $network_enabled ): bool {
						return $network_enabled;
					},
					10 
				);

				add_filter(
					'stellarwp/uplink/kadence-blocks/allows_network_subdomain_license',
					static function () use ( $network_enabled ): bool {
						return $network_enabled;
					},
					10 
				);

				add_filter(
					'stellarwp/uplink/kadence-blocks/allows_network_domain_mapping_license',
					static function () use ( $network_enabled ): bool {
						return $network_enabled;
					},
					10 
				);
			} 
		);
	}
}
