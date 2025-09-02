import { BaseComponentGenerator } from './base-generator';
import { getColorOutput, getSpacingOutput, getContentWidthOutput } from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Simple component CSS generator
 * Handles components that just need a simple output function applied
 */
export class SimpleGenerator extends BaseComponentGenerator {
	/**
	 * Map of component types to their output functions
	 */
	static outputFunctions = {
		// Color components
		color: getColorOutput,
		backgroundColor: getColorOutput,

		// Spacing components
		padding: getSpacingOutput,
		margin: getSpacingOutput,

		// FlexBox gap properties
		rowGap: getSpacingOutput,
		columnGap: getSpacingOutput,

		// Dimension components
		maxWidth: getContentWidthOutput,
		maxHeight: getContentWidthOutput,
		minWidth: getContentWidthOutput,
		minHeight: getContentWidthOutput,
		width: getContentWidthOutput,
		height: getContentWidthOutput,
	};

	/**
	 * Generate CSS for simple component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// For flexBox and dimension components, we need to check each resolved value
		// for its specific output function
		if (meta.component === 'flexBox') {
			// FlexBox has multiple properties with different handlers
			Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
				const outputFn = SimpleGenerator.outputFunctions[key];
				if (resolvedValue && shouldRenderValue(resolvedValue, meta)) {
					const cssValue = outputFn ? outputFn(resolvedValue.value) : resolvedValue.value;
					if (cssValue) {
						this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
					}
				}
			});
		} else if (['maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'width', 'height'].includes(meta.component)) {
			// Dimension components - the component type itself is the key
			const resolvedValue = resolvedValues[meta.component];
			if (resolvedValue && shouldRenderValue(resolvedValue, meta)) {
				const outputFn = SimpleGenerator.outputFunctions[meta.component];
				const cssValue = outputFn ? outputFn(resolvedValue.value) : resolvedValue.value;
				if (cssValue) {
					this.applyProperty(meta.component, { ...resolvedValue, value: cssValue }, meta);
				}
			}
		} else {
			// Standard simple component handling
			const outputFn = SimpleGenerator.outputFunctions[meta.component];

			if (!outputFn) {
				// Fall back to no processing (for transition and other pass-through components)
				this.generateSimple(resolvedValues, meta);
			} else {
				this.generateSimple(resolvedValues, meta, outputFn);
			}
		}
	}
}
