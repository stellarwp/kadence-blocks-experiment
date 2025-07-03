<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Storage;

use KadenceWP\KadenceBlocks\Storage\Contracts\Storage;
use KadenceWP\KadenceBlocks\Storage\Drivers\LocalStorage;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;

class Provider extends Service_Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$base_path = apply_filters( 'kadence_frontend_library_local_data_base_path', trailingslashit( wp_get_upload_dir()['basedir'] ) );
		$this->container->bind( Storage::class, LocalStorage::class );
		$this->container->when( LocalStorage::class )
						->needs( '$storagePath' )
						->give( $base_path );
	}
}
