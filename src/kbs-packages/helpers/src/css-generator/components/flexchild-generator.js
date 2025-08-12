import { BaseComponentGenerator } from './base-generator';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * FlexChild component CSS generator
 * Handles flex child properties: flex, justifySelf, alignSelf
 */
export class FlexChildGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for flexChild component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Process each flex child property
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				// Apply the property directly - no special processing needed
				if (resolvedValue.value) {
					this.applyProperty(key, resolvedValue, meta);
				}
			}
		});
	}
}