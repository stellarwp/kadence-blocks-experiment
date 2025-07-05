<?php

namespace KadenceWP\KadenceBlocks;

use KadenceWP\KadenceBlocks\lucatume\DI52\Container as DI52Container;
use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;
/**
 * A local container implementation.
 *
 * @since 0.1.0
 *
 * @package KadenceWP\KadenceBlocks
 *
 * @method mixed getVar(string $key, mixed|null $default = null)
 * @method void setVar(string $key, mixed $value)
 * @method void register(string $serviceProviderClass, string ...$alias)
 * @method self when(string $class)
 * @method self needs(string $id)
 * @method void give(mixed $implementation)
 * @method void callback(string|class-string|object $id, string $method)
 */
class Container implements ContainerInterface {

	/**
	 * @since 0.1.0
	 *
	 * @var DI52Container
	 */
	protected $container;

	/**
	 * Container constructor.
	 *
	 * @since 0.1.0
	 *
	 * @param object $container The container to use.
	 */
	public function __construct( $container = null ) {
		$this->container = $container ?: new DI52Container();
	}
	
	public function container(): DI52Container {
		return $this->container;
	}
	/**
	 * {@inheritdoc}
	 */
	public function bind( string $id, $implementation = null, array $after_build_methods = null ) {
		$this->container->bind( $id, $implementation, $after_build_methods );
	}

	/**
	 * {@inheritdoc}
	 */
	public function get( string $id ) {
		return $this->container->get( $id );
	}

	/**
	 * @since 0.1.0
	 *
	 * @return DI52Container
	 */
	public function get_container() {
		return $this->container;
	}

	/**
	 * {@inheritdoc}
	 */
	public function has( string $id ) {
		return $this->container->has( $id );
	}

	/**
	 * {@inheritdoc}
	 */
	public function singleton( string $id, $implementation = null, array $after_build_methods = null ) {
		$this->container->singleton( $id, $implementation, $after_build_methods );
	}

	/**
	 * {@inheritDoc}
	 */
	public function register( string $serviceProviderClass, ...$alias ): void {
		$this->container->register( $serviceProviderClass, ...$alias );
	}

	/**
	 * {@inheritDoc}
	 */
	public function when( string $class ): Container {
		$this->container->when( $class );

		return $this;
	}

	/**
	 * {@inheritDoc}
	 */
	public function needs( string $id ): Container {
		$this->container->needs( $id );

		return $this;
	}

	/**
	 * @param mixed $implementation
	 */
	public function give( $implementation ): void {
		$this->container->give( $implementation );
	}

	/**
	 * @param mixed $id
	 */
	public function instance( $id, array $buildArgs = [], ?array $afterBuildMethods = null ): Closure {
		// @phpstan-ignore-next-line invalid DocBlock comments in DI52
		return $this->container->instance( $id, $buildArgs, $afterBuildMethods );
	}

	/**
	 * @param class-string|string|object $id
	 *
	 * @throws ContainerException
	 */
	public function callback( $id, string $method ): callable {
		return $this->container->callback( $id, $method );
	}

	/**
	 * Defer all other calls to the container object.
	 *
	 * @since 0.1.0
	 *
	 * @param string $name The name of the method to call.
	 * @param array  $args The arguments to pass to the method.
	 */
	public function __call( $name, $args ) {
		return $this->container->{$name}( ...$args );
	}
}
