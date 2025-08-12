import { BaseComponentGenerator } from './base-generator';
import { getSpacingOutput } from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * FlexBox component CSS generator
 */
export class FlexBoxGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for flexbox component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Process each flexbox property
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				// Gap properties need spacing output
				const cssValue = (key === 'rowGap' || key === 'columnGap') 
					? getSpacingOutput(resolvedValue.value)
					: resolvedValue.value;
				
				if (cssValue) {
					this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
				}
			}
		});
	}
}