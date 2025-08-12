import { BaseComponentGenerator } from './base-generator';
import { getColorOutput, getSpacingOutput } from '../utils/output-helpers';

/**
 * Simple component CSS generator
 * Handles components that just need a simple output function applied
 */
export class SimpleGenerator extends BaseComponentGenerator {
	/**
	 * Map of component types to their output functions
	 */
	static outputFunctions = {
		color: getColorOutput,
		padding: getSpacingOutput,
		margin: getSpacingOutput,
	};

	/**
	 * Generate CSS for simple component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		const outputFn = SimpleGenerator.outputFunctions[meta.component];
		
		if (!outputFn) {
			console.warn(`No output function defined for simple component type: ${meta.component}`);
			// Fall back to no processing
			this.generateSimple(resolvedValues, meta);
		} else {
			this.generateSimple(resolvedValues, meta, outputFn);
		}
	}
}