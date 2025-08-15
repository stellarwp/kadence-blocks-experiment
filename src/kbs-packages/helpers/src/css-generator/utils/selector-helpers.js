import { kebabCase } from 'lodash';

/**
 * Get the CSS selector for a component property
 * @param {string} baseSelector - The base CSS selector
 * @param {string} key - The property key
 * @param {Object} meta - Component metadata
 * @returns {string} - The CSS selector
 */
export function getCssSelector(baseSelector, key = '', meta = {}) {
	let selector = baseSelector;

	if (meta?.nonInheritable && meta?.selectorSuffix) {
		const processedSelectorSuffix = meta.selectorSuffix.replaceAll('%selector%', baseSelector);
		selector = baseSelector + processedSelectorSuffix;
	}

	// Handle pseudo states
	if (key.endsWith('Hover')) {
		selector = selector + ':hover';
	} else if (key.endsWith('Active')) {
		selector = selector + ':active, ' + selector + ':focus';
	}

	return selector;
}

/**
 * Get the attribute selector/CSS property name
 * @param {string} attributeName - The name of the attribute
 * @param {Object} meta - The meta of the attribute
 * @param {string} appliedValue - The current applied value (for special cases)
 * @return {string}
 */
export function getAttributeSelector(attributeName, meta = {}, appliedValue = '') {
	if (!attributeName) {
		return '';
	}

	const useVariableName = meta?.nonInheritable ? false : true;
	const selectorPrefix = meta?.varPrefix || '';
	const selectorSuffix = meta?.varSuffix || '';
	const componentName = meta?.component || '';

	// Special case for text decoration hover
	const attributeNameSlug =
		attributeName === 'textDecoration' && appliedValue === 'hover-underline'
			? kebabCase('textDecorationHover')
			: kebabCase(attributeName);

	if (useVariableName) {
		return selectorPrefix + attributeNameSlug + selectorSuffix;
	}

	return getCssPropertyForComponent(attributeNameSlug, componentName);
}

/**
 * Map the attribute for the component
 * @param {string} attributeName - The name of the attribute
 * @param {string} componentName - The name of the component
 * @return {string}
 */
export function getCssPropertyForComponent(attributeName, componentName) {
	if (!componentName) {
		return attributeName;
	}

	switch (componentName) {
		case 'background':
			switch (attributeName) {
				case 'color':
					return 'background-color';
				case 'image':
					return 'background-image';
				case 'size':
					return 'background-size';
				case 'position':
					return 'background-position';
				case 'repeat':
					return 'background-repeat';
				case 'attachment':
					return 'background-attachment';
			}
			return attributeName;

		case 'transition':
			switch (attributeName) {
				case 'transition-property':
					return 'transition-property';
				case 'transition-duration':
					return 'transition-duration';
				case 'transition-ease':
				case 'transition-timing-function':
					return 'transition-timing-function';
			}
			return attributeName;

		default:
			return attributeName;
	}
}

/**
 * Generate a CSS variable name for global styles
 * @param {string} componentId - The component ID
 * @param {string} attributeKey - The attribute key
 * @returns {string} - The CSS variable name
 */
export function getGlobalStyleVariableName(componentId, attributeKey) {
	const componentSlug = String(componentId)
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/^-+|-+$/g, '');
	const attributeKeySlug = String(attributeKey)
		.replace(/([A-Z])/g, '-$1')
		.replace(/^-+|-+$/g, '');

	return `--kbs-${attributeKeySlug}-${componentSlug}`.toLowerCase();
}
