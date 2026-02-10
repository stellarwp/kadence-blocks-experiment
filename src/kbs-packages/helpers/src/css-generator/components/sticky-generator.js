import { BaseComponentGenerator } from './base-generator';

/**
 * Sticky component CSS generator
 * Handles enabling `position: sticky` and setting a `top` offset
 */
export class StickyGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for sticky component
	 * @param {string} attributeName
	 * @param {Object} meta
	 * @param {Object} resolvedValues
	 */
	generate(attributeName, meta, resolvedValues) {
		const position = resolvedValues?.position?.value;
		const offset = resolvedValues?.offset?.value;

		// Only apply sticky if position is 'top'
		if (position === 'top') {
			this.add({ position: 'sticky' });

			// Apply top offset if provided
			if (offset !== undefined && offset !== null && offset !== '') {
				// Add px unit to numeric values, preserve values with units
				let cssTop = offset;
				if (typeof offset === 'number' || !isNaN(Number(offset))) {
					cssTop = `${offset}px`;
				}
				this.add({ top: cssTop });
			}
		}
	}
}
