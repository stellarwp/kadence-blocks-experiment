/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getFontWeightOptions, useFontOptions, getDeviceAttributeSlug } from '@kadence/kbsHelpers';

/**
 * Find an option by its value in either flat or grouped options
 *
 * @param {string} value The value to find
 * @param {string} type The type of options (fontFamily or fontWeight)
 * @param {Array} options The options array to search in
 * @return {Object|null} The found option or null
 */
export const findOptionByValue = (value, type, options) => {
	if (!value || !options?.length) return null;
	
	if (type === 'fontFamily') {
		return options.flatMap(group => group.options).find(option => option.value === value);
	}
	
	return options.find(option => option.value === value);
};

/**
 * Get the placeholder label based on current and inherited values
 *
 * @param {string} currentValue The current value
 * @param {Object} inheritedValue The inherited value object
 * @param {string} type The type of options
 * @param {Array} options The options array
 * @return {string} The placeholder label
 */
export const getPlaceholderLabel = (currentValue, inheritedValue, type, options) => {
	if (currentValue) {
		return findOptionByValue(currentValue, type, options)?.label || currentValue;
	}
	return findOptionByValue(inheritedValue?.fontFamily, type, options)?.label || __('Default', 'kadence-blocks');
};

/**
 * Get options based on the select type
 *
 * @param {Object} params The parameters object
 * @param {string} params.type The type of options to get
 * @param {Object} params.attributes The attributes object
 * @param {string} params.attributeName The attribute name
 * @param {string} params.previewDevice The preview device
 * @return {Object} The options and loading state
 */
export const useSelectOptions = ({ type, attributes, attributeName, previewDevice }) => {
	let isLoadingOptions = false;
	let loadingMessage = __('Loading options...', 'kadence-blocks');
	let options = [];

	switch (type) {
		case 'fontFamily': {
			const { fontOptions, isLoadingFonts } = useFontOptions();
			isLoadingOptions = isLoadingFonts;
			loadingMessage = __('Loading fonts...', 'kadence-blocks');
			options = fontOptions;
			break;
		}
		case 'fontWeight': {
			const previewDeviceSlug = getDeviceAttributeSlug(previewDevice);
			const fontFamily = attributes?.[attributeName]?.[previewDeviceSlug]?.fontFamily;
			options = getFontWeightOptions(fontFamily);
			break;
		}
	}

	return {
		options,
		isLoadingOptions,
		loadingMessage,
	};
}; 