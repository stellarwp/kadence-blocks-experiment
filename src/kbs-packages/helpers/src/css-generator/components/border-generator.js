import { BaseComponentGenerator } from './base-generator';
import { getBorderRadiusOutput } from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';
import parseBorderStyle from '../../parse-border-style';
import { BORDER_STYLES_DEFAULTS } from '../../constants/borders';

/**
 * Border component CSS generator
 */
export class BorderGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for border component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Process each border property
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				this.applyBorderProperty(key, resolvedValue, meta);
			}
		});
	}

	/**
	 * Apply a border property
	 * @param {string} key - The property key
	 * @param {Object} resolvedValue - The resolved value object
	 * @param {Object} meta - Component metadata
	 */
	applyBorderProperty(key, resolvedValue, meta) {
		const cssValue = this.processBorderValue(key, resolvedValue.value);
		if (cssValue === null || cssValue === undefined || cssValue === '') {
			return;
		}

		// Use the inherited method for applying the property
		this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
	}

	/**
	 * Process CSS value based on property type
	 * Override base class to handle border-specific processing
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @param {Object} meta - Component metadata
	 * @returns {string} - The processed CSS value
	 */
	processValue(key, value, meta) {
		const isBorderRadius = key.includes('border') && key.includes('Radius');
		const isBorderStyle = key.includes('border') && !key.includes('Radius');

		if (isBorderRadius) {
			// Handle border radius values - use getBorderRadiusOutput to convert size names to CSS variables
			return getBorderRadiusOutput(value);
		}

		if (isBorderStyle) {
			// Handle border style values
			const { color, style, width } = parseBorderStyle(value);
			
			// Don't render if width is empty or default
			if (width === '' || width === BORDER_STYLES_DEFAULTS.width.var) {
				return '';
			}
			
			return value;
		}

		return value;
	}

	/**
	 * Process border value based on property type
	 * Kept for backward compatibility
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @returns {string} - The processed CSS value
	 */
	processBorderValue(key, value) {
		// Delegate to processValue for consistency
		return this.processValue(key, value, {});
	}

}