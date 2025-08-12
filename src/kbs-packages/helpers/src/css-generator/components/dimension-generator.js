import { BaseComponentGenerator } from './base-generator';
import { getContentWidthOutput } from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Dimension component CSS generator (handles width, height, min/max dimensions)
 */
export class DimensionGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for dimension component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// For dimension components, we typically have a single value
		// The component type itself is the key (e.g., 'maxWidth', 'minHeight')
		const componentType = meta.component;
		const resolvedValue = resolvedValues[componentType];

		if (resolvedValue && shouldRenderValue(resolvedValue, meta)) {
			const cssValue = getContentWidthOutput(resolvedValue.value);
			if (cssValue) {
				this.applyProperty(componentType, { ...resolvedValue, value: cssValue }, meta);
			}
		}
	}
}