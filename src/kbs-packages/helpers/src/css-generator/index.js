import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { SPACING_SIZES_MAP } from '../constants';
import { merge } from 'lodash';
import { default as getResolvedValue } from '../get-resolved-value';

const deviceOptions = kadence_blocks_params.responsive_device_options || [];

/**
 * CSS Generator class for building CSS strings
 */
class CSSGenerator {
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
	addComponent(attributeName, meta, props, metadata, mergedGlobalStyle = {}) {
		const { attributes, previewDevice } = props;
		const mergedAttribute = this.mergeInitialAttribute(meta, attributes?.[attributeName] || {});

		if (!mergedAttribute) {
			return this;
		}

		if (!meta?.component) {
			return this;
		}

		switch (meta.component) {
			case 'typography':
				const typographyProperties = [
					{ key: 'fontFamily', selector: meta.selector + '-font-family' },
					{ key: 'fontWeight', selector: meta.selector + '-font-weight' },
				];

				// Process each typography property
				typographyProperties.forEach(({ key, selector }) => {

					const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue } = getResolvedValue(
						attributeName,
						attributes,
						previewDevice,
						metadata,
						key,
						mergedGlobalStyle
					);
					
					if( appliedValue) {
						this.add({ [selector]: this.getSizingOutput(appliedValue) });
					}
				});
				break;
			default:
				// For other complex properties, add specific handling here
				break;
		}

		return this;
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
		const currentDevice = deviceOptions.find(device => device.name === previewDevice);
		if (!currentDevice) {
			// Default to desktop if device not found
			const desktop = deviceOptions.find(device => device.key === 'desktop')?.attributeSlug || 'desktop';
			return attributeValue?.[desktop] || '';
		}
		
		// Get the attribute slug for the current device
		const currentDeviceSlug = currentDevice.attributeSlug;
		
		// Check if we have a value for the current device
		if (attributeValue?.[currentDeviceSlug] !== undefined && 
			attributeValue?.[currentDeviceSlug] !== '' && 
			attributeValue?.[currentDeviceSlug] !== null) {
			return attributeValue[currentDeviceSlug];
		}
		
		// Find the current device index in the array
		const currentDeviceIndex = deviceOptions.findIndex(device => device.name === previewDevice);
		
		// Implement inheritance based on device order
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const inheritFromSlug = deviceOptions[i].attributeSlug;
			
			if (attributeValue?.[inheritFromSlug] !== undefined && 
				attributeValue?.[inheritFromSlug] !== '' && 
				attributeValue?.[inheritFromSlug] !== null) {
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
}

export default CSSGenerator;
