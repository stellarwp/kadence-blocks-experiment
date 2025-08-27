import { BaseComponentGenerator } from './base-generator';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Filter component CSS generator
 * Handles combining dropShadow and simple filter values into a single CSS filter property
 */
export class FilterGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for filter component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Check if debugging is enabled for this component
		if (meta?.debug === true) {
			this.outputGeneratorDebug(meta, resolvedValues);
		}

		// Collect all filter values
		const filterValues = [];

		// Process dropShadow values
		const dropShadowValue = resolvedValues.dropShadow;
		if (dropShadowValue && shouldRenderValue(dropShadowValue, meta)) {
			const dropShadowCss = this.processDropShadowValue(dropShadowValue.value);
			if (dropShadowCss) {
				filterValues.push(dropShadowCss);
			}
		}

		// Process simple filter values
		const simpleFilterValue = resolvedValues.simple;
		if (simpleFilterValue && shouldRenderValue(simpleFilterValue, meta)) {
			const simpleFilterCss = this.processSimpleFilterValue(simpleFilterValue.value);
			if (simpleFilterCss) {
				filterValues.push(simpleFilterCss);
			}
		}

		// Apply combined filter if we have any values
		if (filterValues.length > 0) {
			const combinedFilter = filterValues.join(' ');
			this.applyProperty('filter', { value: combinedFilter }, meta);
		}
	}

	/**
	 * Process dropShadow value to generate CSS drop-shadow filter
	 * @param {string} value - The dropShadow value (assumed to be a valid shadow string)
	 * @returns {string|null} - The processed CSS value or null if invalid
	 */
	processDropShadowValue(value) {
		// Assume value is already a valid shadow string
		if (typeof value === 'string' && value.trim()) {
			return value;
		}

		return null;
	}

	/**
	 * Process simple filter value
	 * @param {string} value - The simple filter value
	 * @returns {string|null} - The processed CSS value or null if invalid
	 */
	processSimpleFilterValue(value) {
		// If value is already a string and not empty, return as-is
		if (typeof value === 'string' && value.trim()) {
			return value;
		}

		return null;
	}
}
