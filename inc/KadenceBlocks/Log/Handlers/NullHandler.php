<?php declare(strict_types=1);

namespace KadenceWP\KadenceBlocks\Log\Handlers;

use KadenceWP\KadenceBlocks\Monolog\Handler\AbstractHandler;

/**
 * Black hole.
 *
 * Any record it can handle will be thrown away.
 */
final class NullHandler extends AbstractHandler {

	public function handle( array $record ): bool {
		return $record['level'] >= $this->level;
	}
}
