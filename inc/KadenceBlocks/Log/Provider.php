<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Log;

use KadenceWP\KadenceBlocks\lucatume\DI52\Container;
use KadenceWP\KadenceBlocks\Monolog\Formatter\LineFormatter;
use KadenceWP\KadenceBlocks\Monolog\Handler\ErrorLogHandler;
use KadenceWP\KadenceBlocks\Monolog\Handler\StreamHandler;
use KadenceWP\KadenceBlocks\Monolog\Logger;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use RuntimeException;
use KadenceWP\KadenceBlocks\Log\Formatters\ColoredLineFormatter;
use KadenceWP\KadenceBlocks\Log\Handlers\NullHandler;

use KadenceWP\KadenceBlocks\Contracts\Service_Provider;

class Provider extends Service_Provider {

	public const LOG_LEVEL = 'prophecy.log.log_level';
	public const CHANNELS  = [
		'console'  => [
			'class'     => StreamHandler::class,
			'formatter' => ColoredLineFormatter::class,
		],
		'errorlog' => [
			'class'     => ErrorLogHandler::class,
			'formatter' => LineFormatter::class,
		],
		'stack'    => [
			'console',
			'errorlog',
		],
		'null'     => [
			'class' => NullHandler::class,
		],
	];
	public const CONFIG    = [
		'log' => [
			'level'    => 'debug',
			'channel'  => 'null', // console, errorlog, stack (both console and errorlog) or null
			'channels' => [
				'errorlog' => [],
				'console'  => [
					'with' => [
						'stream' => 'php://stdout',
					],
				],
				'stack'    => [
					'with' => [
						'stream' => 'php://stdout',
					],
				],
			],
		],
	];

	/**
	 * {@inheritDoc}
	 */
	public function register(): void {
		$this->container->singleton( self::LOG_LEVEL, Log_Level::fromName( self::CONFIG['log']['level'] ) );

		$this->container->when( ColoredLineFormatter::class )
						->needs( '$dateFormat' )
						->give( 'Y-m-d H:i:s.v e' );

		$channel = self::CONFIG['log']['channel'];

		$this->container->singleton(
			StreamHandler::class,
			function ( $c ) use ( $channel ) {
				return new StreamHandler(
					( ! empty( self::CONFIG['log']['channels'][ $channel ]['with']['stream'] ) ? self::CONFIG['log']['channels'][ $channel ]['with']['stream'] : 'php://stdout' ),
					$c->get( self::LOG_LEVEL )
				);
			}
		);

		$this->container->bind(
			LoggerInterface::class,
			static function ( Container $c ) use ( $channel ): LoggerInterface {
				$handler = self::CHANNELS[ $channel ] ?? false;

				if ( ! $handler ) {
					throw new RuntimeException(
						sprintf(
							'Invalid log channel. Valid options are: %s',
							implode( ',', array_keys( self::CHANNELS ) )
						)
					);
				}

				$logger = new Logger( $channel );

				/**
				 * @var array{handler: \KadenceWP\FrontendWizards\Monolog\Handler\AbstractProcessingHandler, formatter: string|class-string} $handlers
				 */
				$handlers = [];

				// Single handler channel.
				if ( ! empty( $handler['class'] ) ) {
					$handlers[] = [
						'handler'   => $c->get( $handler['class'] ),
						'formatter' => $handler['formatter'] ?? '',
					];
				} else {
					// We are on a stack channel, which uses multiple existing handlers.
					foreach ( $handler as $stackChannel ) {
						$handlers[] = [
							'handler'   => $c->get( self::CHANNELS[ $stackChannel ]['class'] ),
							'formatter' => self::CHANNELS[ $stackChannel ]['formatter'] ?? '',
						];
					}
				}

				/** @var array{handler: \KadenceWP\FrontendWizards\Monolog\Handler\AbstractProcessingHandler, formatter: string|class-string} $registeredHandler */
				foreach ( $handlers as $registeredHandler ) {
					if ( ! empty( $registeredHandler['formatter'] ) ) {
						$registeredHandler['handler']->setFormatter( $c->get( $registeredHandler['formatter'] ) );
					}

					// Set the configured log level for each handler.
					$registeredHandler['handler']->setLevel( $c->get( self::LOG_LEVEL ) );

					$logger->pushHandler( $registeredHandler['handler'] );
				}

				return $logger;
			}
		);
	}
}
