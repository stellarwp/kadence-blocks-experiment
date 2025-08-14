import { BaseComponentGenerator } from './base-generator';
import { getColorOutput, getIconSizeOutput, getSpacingOutput } from '../utils/output-helpers';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Icon component CSS generator
 */
export class IconGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for icon component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				this.applyIconProperty(key, resolvedValue, meta);
			}
		});
	}

	/**
	 * Apply an icon property
	 * @param {string} key - The property key
	 * @param {Object} resolvedValue - The resolved value object
	 * @param {Object} meta - Component metadata
	 */
	applyIconProperty(key, resolvedValue, meta) {
		const cssValue = this.processIconValue(key, resolvedValue.value);
		if (!cssValue) {
			return;
		}

		this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
	}

	/**
	 * Process icon value based on property type
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @returns {string} - The processed CSS value
	 */
	processIconValue(key, value) {
		if (key === 'color' || key === 'colorHover') {
			return getColorOutput(value);
		}

		if (key === 'iconSize' || key === 'iconSizeHover') {
			return getIconSizeOutput(value);
		}

		if (key.includes('padding') || key.includes('margin')) {
			return getSpacingOutput(value);
		}

		if (key === 'iconLineWidth' || key === 'iconLineWidthHover') {
			return value;
		}

		if (key === 'alignItems') {
			return value;
		}

		if (key === 'rotation' || key === 'rotationHover') {
			// Rotation values need to be formatted as rotate transform
			if (typeof value === 'number') {
				return `rotate(${value}deg)`;
			}
			// If value already has deg unit, wrap it in rotate()
			if (typeof value === 'string' && value.includes('deg')) {
				return `rotate(${value})`;
			}
			// If it's already a rotate transform, use as-is
			if (typeof value === 'string' && value.includes('rotate')) {
				return value;
			}
			// Otherwise append deg and wrap in rotate
			return `rotate(${value}deg)`;
		}

		return value;
	}
}