import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { SPACING_SIZES_MAP } from '../constants';
import { merge, kebabCase } from 'lodash';
import { default as getResolvedValue } from '../get-resolved-value';
import { getBasePresetKey } from '../get-inherited-device-value';
import getColorOutput from '../get-color-output';

const deviceOptions = window?.kbs_params?.responsive_device_options || [];

/**
 * CSS Generator class for building CSS strings
 */
class CSSGenerator {
	/**
	 * The current applied value
	 * @type {string}
	 */
	currentAppliedValue = '';

	constructor(selector = '') {
		this.rules = new Map();
		this.currentSelector = selector;
	}

	/**
	 * Set the current selector for subsequent property additions
	 * @param {string} selector - The CSS selector
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	setSelector(selector) {
		this.currentSelector = selector;
		return this;
	}
	/**
	 * Add a CSS attribute to the current selector
	 * @param {string} key - The key of the attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	addAttribute(key, meta, props) {
		const { attributes, previewDevice } = props;
		const mergedAttribute = this.mergeInitialAttribute(meta, attributes?.[key] || {});

		// Check if the attribute exists in the attributes object
		if (mergedAttribute) {
			if (!meta?.property) {
				return this;
			}
			if (!meta?.selector) {
				return this;
			}
			switch (meta.property) {
				case 'flex-direction':
				case 'flex-wrap':
				case 'align-content':
				case 'align-items':
				case 'justify-content':
				case 'row-gap':
				case 'column-gap':
					this.renderStringProperty(mergedAttribute, meta.selector, previewDevice);
					break;
			}
		}
		return this;
	}

	/**
	 * Loops through components and add its CSS attributes to their selector
	 * @param {string} key - The key of the attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	// addComponent(attributeName, meta, props, metadata) {
	// 	const { attributes, previewDevice, globalStylesIds } = props;
	// 	// const mergedAttribute = this.mergeInitialAttribute(meta, attributes?.[attributeName] || {});

	processComponentKey(attributeName, meta, props, metadata, key) {
		//get the components for the line to add
		const cssValue = this.getCssValue(attributeName, meta, props, metadata, key);
		const cssSelector = this.getCssSelector(meta, key);
		const attributeSelector = this.getAttributeSelector(key, meta);

		if (cssValue && cssSelector && attributeSelector) {
			const currentSelectorBackup = this.currentSelector;
			this.setSelector(cssSelector);
			this.add({ [attributeSelector]: cssValue });
			this.setSelector(currentSelectorBackup);
		}
		this.currentAppliedValue = '';
	}
	/**
	 * Process and format a CSS value based on the property type
	 */
	getCssValue(attributeName, meta, props, metadata, key) {
		const { attributes, previewDevice, globalStylesIds } = props;
		const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue } = getResolvedValue(
			attributeName,
			attributes,
			previewDevice,
			metadata,
			key,
			globalStylesIds
		);

		this.currentAppliedValue = appliedValue;
		const isDirectOrParent = inheritedSource === 'direct' || inheritedSource === 'parent';
		const isPresetOrPresetParent = inheritedSource === 'preset' || inheritedSource === 'preset-parent';
		const isNonInheritable = meta?.nonInheritable;

		let cssValue;
		switch (meta.component) {
			case 'flexBox':
				if (isDirectOrParent || (isNonInheritable && isPresetOrPresetParent)) {
					cssValue = appliedValue;
				}
				if (cssValue && (key === 'rowGap' || key === 'columnGap')) {
					cssValue = this.getSpacingOutput(cssValue);
				}
				break;
			case 'typography':
				if (isDirectOrParent || (isNonInheritable && isPresetOrPresetParent)) {
					cssValue = this.getSizingOutput(appliedValue);
				} else if (inheritedSource) {
					// const basePresetKey = getBasePresetKey(attributeName, meta, attributes);
					const variableName = this.getGlobalStyleVariableName(
						'heading-1', // inheritedSource
						key // attributeKey
					);
					cssValue = `var(${variableName})`;
				}
				break;
			case 'linkStyle':
				if (key === 'textDecoration' && appliedValue === 'hover-underline') {
					cssValue = 'underline';
				} else {
					cssValue = appliedValue;
				}
				break;
			case 'maxWidth':
			case 'maxHeight':
				cssValue = appliedValue;
				break;
			case 'background':
				if (key === 'color') {
					cssValue = getColorOutput(appliedValue);
				} else {
					cssValue = appliedValue;
				}
				break;
			default:
				cssValue = appliedValue;
				break;
		}
		return cssValue;
	}
	/**
	 * Get the attribute selector.
	 *
	 * @param {string} attributeName The name of the attribute.
	 * @param {Object} attributesMeta The meta of the attribute.
	 * @return {string}
	 */
	getAttributeSelector(attributeName, attributesMeta) {
		if (!attributeName) {
			return '';
		}
		const useVariableName = attributesMeta?.nonInheritable ? false : true;
		const selectorPrefix = attributesMeta?.selector || '';
		const componentName = attributesMeta?.component || '';
		const attributeNameSlug =
			attributeName === 'textDecoration' && this.currentAppliedValue === 'hover-underline'
				? kebabCase('textDecorationHover')
				: kebabCase(attributeName);
		if (useVariableName) {
			return selectorPrefix + attributeNameSlug;
		}
		const attributeNameForComponent = this.getCssPropertyForComponent(attributeNameSlug, componentName);
		return attributeNameForComponent;
	}
	/**
	 * Map the attribute for the component.
	 *
	 * @param {string} attributeName The name of the attribute.
	 * @param {string} componentName The name of the component.
	 * @return {string}
	 */
	getCssPropertyForComponent(attributeName, componentName) {
		if (!componentName) {
			return attributeName;
		}
		switch (componentName) {
			case 'background':
				if (attributeName === 'color') {
					return 'background-color';
				}
				return attributeName;
			default:
				return attributeName;
		}
	}

	/**
	 * Apply a CSS property to the current selector
	 * @private
	 * @param {Object} meta - The metadata object
	 * @param {string} key - The original property key
	 * @returns {void}
	 */
	getCssSelector(meta, key) {
		return this.currentSelector;
	}

	/**
	 * Loops through components and add its CSS attributes to their selector
	 * @param {string} key - The key of the attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	addComponent(attributeName, meta, props, metadata) {
		if (!meta?.component) {
			return this;
		}

		const componentKeys = this.getComponentKeys(meta.component);
		componentKeys.forEach((key) => this.processComponentKey(attributeName, meta, props, metadata, key));

		return this;
	}

	getComponentKeys(component) {
		let componentKeys = [];
		switch (component) {
			case 'background':
				componentKeys = [
					'color',
					'gradient',
					'image',
					'pattern',
					'size',
					'position',
					'repeat',
					'attachment',
					'blendMode',
				];
				break;
			case 'flexBox':
				componentKeys = [
					'flexDirection',
					'justifyContent',
					'alignItems',
					'alignContent',
					'flexWrap',
					'rowGap',
					'columnGap',
				];
				break;
			case 'typography':
				componentKeys = [
					'fontFamily',
					'fontWeight',
					'fontSize',
					'lineHeight',
					'letterSpacing',
					'textTransform',
				];
				break;
			case 'linkStyle':
				componentKeys = ['textDecoration'];
				break;
			case 'maxWidth':
			case 'maxHeight':
				componentKeys = [component];
				break;
		}
		return componentKeys;
	}
	/**
	 * Merge the initial attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} attributeValue - The value of the attribute
	 * @returns {Object} - The merged attribute
	 */
	mergeInitialAttribute(meta, attributeValue) {
		if (!meta || !attributeValue) {
			return null;
		}
		if (meta?.initial) {
			const initialAttribute = this.getInitialWithDeviceSlugs(meta.initial);
			return merge(initialAttribute, attributeValue);
		}
		return attributeValue;
	}
	/**
	 * Get the initial attribute with device slugs
	 * @param {Object} initialAttribute - The initial attribute
	 * @returns {Object} - The initial attribute with device slugs
	 */
	getInitialWithDeviceSlugs(initialAttribute) {
		if (!initialAttribute) {
			return {};
		}
		// Loop through initialAttribute object and replace the device key with the device slugs.
		const initialAttributeWithDeviceSlugs = {};
		Object.keys(initialAttribute).forEach((key) => {
			const deviceSlug = getDeviceAttributeSlug(key);
			initialAttributeWithDeviceSlugs[deviceSlug] = initialAttribute[key];
		});

		return initialAttributeWithDeviceSlugs;
	}
	/**
	 * Get the preview property
	 * @param {string} attributeValue - The value of the attribute
	 * @param {string} previewDevice - The preview device
	 * @returns {string} - The preview property
	 */
	getPreviewProperty(attributeValue, previewDevice) {
		// Get the current device option
		const currentDevice = deviceOptions.find((device) => device.name === previewDevice);
		if (!currentDevice) {
			// Default to desktop if device not found
			const desktop = deviceOptions.find((device) => device.key === 'desktop')?.attributeSlug || 'desktop';
			return attributeValue?.[desktop] || '';
		}

		// Get the attribute slug for the current device
		const currentDeviceSlug = currentDevice.attributeSlug;

		// Check if we have a value for the current device
		if (
			attributeValue?.[currentDeviceSlug] !== undefined &&
			attributeValue?.[currentDeviceSlug] !== '' &&
			attributeValue?.[currentDeviceSlug] !== null
		) {
			return attributeValue[currentDeviceSlug];
		}

		// Find the current device index in the array
		const currentDeviceIndex = deviceOptions.findIndex((device) => device.name === previewDevice);

		// Implement inheritance based on device order
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const inheritFromSlug = deviceOptions[i].attributeSlug;

			if (
				attributeValue?.[inheritFromSlug] !== undefined &&
				attributeValue?.[inheritFromSlug] !== '' &&
				attributeValue?.[inheritFromSlug] !== null
			) {
				return attributeValue[inheritFromSlug];
			}
		}

		return '';
	}
	/**
	 * Render the property as a string
	 * @param {string} attributeValue - The value of the attribute
	 * @param {string} selector - The CSS selector
	 * @param {string} previewDevice - The preview device
	 */
	renderStringProperty(attributeValue, selector, previewDevice) {
		const propertyValue = String(this.getPreviewProperty(attributeValue, previewDevice));
		if (!propertyValue) {
			return this;
		}
		this.add({ [selector]: this.getSizingOutput(propertyValue) });
	}
	/**
	 * Add CSS properties to the current selector
	 * @param {Object} properties - Object containing CSS properties and values
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	add(properties) {
		if (!this.currentSelector || !properties || Object.keys(properties).length === 0) {
			return this;
		}

		const existingProperties = this.rules.get(this.currentSelector) || {};
		this.rules.set(this.currentSelector, { ...existingProperties, ...properties });
		return this;
	}

	/**
	 * Add CSS rules for a specific selector
	 * @param {string} selector - The CSS selector
	 * @param {Object} properties - Object containing CSS properties and values
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	addRule(selector, properties) {
		this.setSelector(selector);
		return this.add(properties);
	}

	/**
	 * Generate the final CSS string
	 * @returns {string} - The generated CSS string
	 */
	generate() {
		let css = '';
		this.rules.forEach((properties, selector) => {
			css += this._generateRuleString(selector, properties);
		});
		return css;
	}
	/**
	 * Get the spacing option output
	 * @param {string} value - The value of the attribute
	 * @returns {string} - The spacing option output
	 */
	getSpacingOutput(value) {
		if (undefined === value) {
			return '';
		}
		if (!SPACING_SIZES_MAP) {
			return value;
		}
		if (value === '0') {
			return '0';
		}
		if (value === 0) {
			return '0';
		}
		const found = SPACING_SIZES_MAP.find((option) => option.value === value);
		if (!found) {
			return value;
		}
		return found.output;
	}
	/**
	 * Get the font sizing option output
	 * @param {string} value - The value of the attribute
	 * @returns {string} - The font sizing option output
	 */
	getSizingOutput(value) {
		if (undefined === value) {
			return '';
		}
		if (!SPACING_SIZES_MAP) {
			return value;
		}
		if (value === '0') {
			return '0';
		}
		if (value === 0) {
			return '0';
		}
		const found = SPACING_SIZES_MAP.find((option) => option.value === value);
		if (!found) {
			return value;
		}
		return found.output;
	}

	/**
	 * Generate a CSS rule string for a selector and its properties
	 * @private
	 * @param {string} selector - The CSS selector
	 * @param {Object} properties - Object containing CSS properties and values
	 * @returns {string} - The generated CSS rule string
	 */
	_generateRuleString(selector, properties) {
		if (!properties || Object.keys(properties).length === 0) {
			return '';
		}

		let ruleString = `${selector} {\n`;
		Object.entries(properties).forEach(([property, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				ruleString += `    ${property}: ${value};\n`;
			}
		});
		ruleString += '}\n';
		return ruleString;
	}

	// Helper function to generate CSS variable names for global styles (Simplified)
	getGlobalStyleVariableName(componentId, attributeKey) {
		const componentSlug = String(componentId)
			.replace(/[^a-zA-Z0-9-_]/g, '-')
			.replace(/^-+|-+$/g, '');
		const attributeKeySlug = String(attributeKey)
			.replace(/([A-Z])/g, '-$1')
			.replace(/^-+|-+$/g, '');
		const response = `--kbs-${attributeKeySlug}-${componentSlug}`;

		return response.toLowerCase(); // --kbs-fontfamily-heading-1
	}
}

export default CSSGenerator;
