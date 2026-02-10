<?php
/**
 * A base class all service providers should extend.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\Contracts;

use KadenceWP\KadenceBlocks\Container;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A local instance to prevent coupling directly to Di52.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 */
abstract class Service_Provider {

	/**
	 * Whether this service provider will be a deferred one or not.
	 *
	 * @var bool
	 */
	protected bool $deferred = false;

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
	 * Registers the service provider container bindings.
	 *
	 * @return void
	 */
	abstract public function register(): void;

	/**
	 * Whether the service provider will be a deferred one or not.
	 *
	 * @return bool
	 */
	public function isDeferred(): bool {
		return $this->deferred;
	}

	/**
	 * Returns an array of the class or interfaces bound and provided by the service provider.
	 *
	 * @return string[] A list of fully-qualified implementations provided by the service provider.
	 */
	public function provides(): array {
		return [];
	}

	/**
	 * Binds and sets up implementations at boot time.
	 *
	 * @return void
	 */
	public function boot(): void {
	}

	/**
	 * Register all action hooks for the provider.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public function register_actions(): void {}

	/**
	 * Register all filter hooks for the provider.
	 *
	 * @since 0.1.0
	 *
	 * @return void
	 */
	public function register_filters(): void {}
}
