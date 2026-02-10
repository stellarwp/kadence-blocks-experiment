import { BaseComponentGenerator } from './base-generator';
import {
	getFontSizeOutput,
	getLineHeightOutput,
	getLetterSpacingOutput,
	getSizingOutput,
	getColorOutput,
} from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Typography component CSS generator
 */
export class TypographyGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for typography component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Process each typography property
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				this.applyTypographyProperty(key, resolvedValue, meta);
			}
		});
	}

	/**
	 * Apply a typography property
	 * @param {string} key - The property key
	 * @param {Object} resolvedValue - The resolved value object
	 * @param {Object} meta - Component metadata
	 */
	applyTypographyProperty(key, resolvedValue, meta) {
		const cssValue = this.processTypographyValue(key, resolvedValue.value);
		if (!cssValue) {
			return;
		}

		// Use the inherited method for applying the property
		this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
	}

	/**
	 * Process typography value based on property type
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @returns {string} - The processed CSS value
	 */
	processTypographyValue(key, value) {
		switch (key) {
			case 'fontFamily':
				return value; // Font family is used as-is

			case 'fontSize':
				return getFontSizeOutput(value);

			case 'lineHeight':
				return getLineHeightOutput(value);

			case 'letterSpacing':
				return getLetterSpacingOutput(value);

			case 'color':
			case 'backgroundColor':
				return getColorOutput(value);

			case 'fontWeight':
			case 'fontStyle':
			case 'textTransform':
				return value; // These are used as-is

			default:
				return getSizingOutput(value);
		}
	}
}
