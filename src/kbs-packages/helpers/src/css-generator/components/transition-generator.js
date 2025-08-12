import { BaseComponentGenerator } from './base-generator';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Transition component CSS generator
 */
export class TransitionGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for transition component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Process each transition property
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				this.applyTransitionProperty(key, resolvedValue, meta);
			}
		});
	}

	/**
	 * Apply a transition property
	 * @param {string} key - The property key
	 * @param {Object} resolvedValue - The resolved value object
	 * @param {Object} meta - Component metadata
	 */
	applyTransitionProperty(key, resolvedValue, meta) {
		const cssValue = this.processTransitionValue(key, resolvedValue.value);
		if (!cssValue) {
			return;
		}

		// Use the inherited method for applying the property
		this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
	}

	/**
	 * Process transition value based on property type
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @returns {string} - The processed CSS value
	 */
	processTransitionValue(key, value) {
		// Special handling for transitionProperty
		if (key === 'transitionProperty') {
			// Always use 'all' for transition property
			return 'all';
		}

		// All other transition properties are used as-is
		return value;
	}
}