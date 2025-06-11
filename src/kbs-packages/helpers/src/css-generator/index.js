import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { SPACING_SIZES_MAP } from '../constants';
import { merge, kebabCase } from 'lodash';
import { default as getResolvedValue } from '../get-resolved-value';
import { getBasePresetKey } from '../get-inherited-device-value';
import { default as getInheritedValue } from '../get-inherited-value';
import getColorOutput from '../get-color-output';
import { default as getLayerDeviceValue } from '../get-layer-device-value';
import { default as getPatternOptions } from '../get-pattern-options';
import { useMemo } from 'react';
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
				} else if (key === 'image') {
					cssValue = 'url(' + appliedValue + ')';
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
			default:
				return attributeName;
		}
	}

	/**
	 * Get the current selector
	 * @private
	 * @returns {void}
	 */
	getCssSelector() {
		return this.currentSelector;
	}
	/**
	 * Process the layer
	 * @param {string} attributeName - The name of the attribute
	 * @param {Object} layer - The layer object
	 * @param {number} index - The index of the layer
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @param {Object} metadata - The metadata of the block
	 */
	processBackgroundLayer(layer, index, meta, props, metadata) {
		const currentSelector = this.getCssSelector();
		const backgroundType = getLayerDeviceValue('type', layer, props.previewDevice) || 'color';
		const metaClassPrefix = meta?.classPrefix || 'kbs-bg-style-';
		const anyBackgroundOpacity = getLayerDeviceValue('opacity', layer, 'Mobile');
		if (index === 0 && backgroundType !== 'video' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector);
		} else {
			this.setSelector(currentSelector + ' > .' + metaClassPrefix + index);
		}
		const backgroundColor = getLayerDeviceValue('color', layer, props.previewDevice);
		const backgroundHoverColor = getLayerDeviceValue('hoverColor', layer, props.previewDevice);
		const backgroundOpacity = getLayerDeviceValue('opacity', layer, props.previewDevice);
		const backgroundHoverOpacity = getLayerDeviceValue('hoverOpacity', layer, props.previewDevice);
		const backgroundBlendMode = getLayerDeviceValue('blendMode', layer, props.previewDevice);
		const backgroundHoverBlendMode = getLayerDeviceValue('hoverBlendMode', layer, props.previewDevice);
		if (backgroundOpacity || backgroundOpacity === 0) {
			this.add({ opacity: backgroundOpacity });
		}
		if (backgroundBlendMode && backgroundBlendMode !== 'normal') {
			this.add({ 'mix-blend-mode': backgroundBlendMode });
		}
		switch (backgroundType) {
			case 'color':
				if (backgroundColor) {
					this.add({ 'background-color': getColorOutput(backgroundColor) });
				}
				break;
			case 'image':
				const backgroundImage = getLayerDeviceValue('image', layer, props.previewDevice);
				if (backgroundColor) {
					this.add({ 'background-color': getColorOutput(backgroundColor) });
				}
				if (backgroundImage) {
					this.add({ 'background-image': 'url(' + backgroundImage + ')' });
					const backgroundPosition = getLayerDeviceValue('position', layer, props.previewDevice);
					if (backgroundPosition) {
						this.add({ 'background-position': backgroundPosition });
					}
					const backgroundSize = getLayerDeviceValue('size', layer, props.previewDevice);
					if (backgroundSize) {
						this.add({ 'background-size': backgroundSize });
					}
					const backgroundRepeat = getLayerDeviceValue('repeat', layer, props.previewDevice);
					if (backgroundRepeat) {
						this.add({ 'background-repeat': backgroundRepeat });
					}
					const backgroundAttachment = getLayerDeviceValue('attachment', layer, props.previewDevice);
					if (backgroundAttachment) {
						this.add({
							'background-attachment':
								backgroundAttachment === 'parallax' ? 'fixed' : backgroundAttachment,
						});
					}
				}
				break;
			case 'gradient':
				const backgroundGradient = getLayerDeviceValue('gradient', layer, props.previewDevice);
				if (backgroundColor) {
					this.add({ 'background-color': getColorOutput(backgroundColor) });
				}
				if (backgroundGradient) {
					this.add({ 'background-image': backgroundGradient });
				}
				break;
			case 'pattern':
				const patternType = getLayerDeviceValue('patternType', layer, props.previewDevice);
				if (backgroundColor) {
					this.add({ 'background-color': getColorOutput(backgroundColor) });
					this.add({ '--kbs-pattern-bg': getColorOutput(backgroundColor) });
				} else {
					this.add({ '--kbs-pattern-bg': 'transparent' });
				}
				const patternColor = getLayerDeviceValue('patternColor', layer, props.previewDevice);
				if (patternColor) {
					this.add({ '--kbs-pattern-color': getColorOutput(patternColor) });
				} else {
					this.add({ '--kbs-pattern-color': getColorOutput('palette3') });
				}
				if (patternType !== 'pattern' && patternType !== 'divider') {
					const flipX = getLayerDeviceValue('flipX', layer, props.previewDevice);
					let hasXFlip = false;
					if (flipX === 'enabled') {
						hasXFlip = true;
					}
					const flipY = getLayerDeviceValue('flipY', layer, props.previewDevice);
					let hasYFlip = false;
					if (flipY === 'enabled') {
						hasYFlip = true;
					}
					if (hasXFlip || hasYFlip) {
						this.add({ transform: `scaleX(${hasXFlip ? '-1' : '1'}) scaleY(${hasYFlip ? '-1' : '1'})` });
					}
				}
				if (patternType === 'pattern') {
					const backgroundPattern = getLayerDeviceValue('pattern', layer, props.previewDevice);
					if (backgroundPattern) {
						const patternSize = getLayerDeviceValue('patternSize', layer, props.previewDevice);
						if (patternSize) {
							this.add({ '--kbs-pattern-size': patternSize });
						} else {
							this.add({ '--kbs-pattern-size': '20' });
						}
						const pattern = getPatternOptions().find((pattern) => pattern.value === backgroundPattern);
						if (pattern) {
							if (pattern?.['background']) {
								this.add({ background: pattern['background'] });
							}
							if (pattern?.['background-image']) {
								this.add({ 'background-image': pattern['background-image'] });
							}
							if (pattern?.['background-size']) {
								this.add({ 'background-size': pattern['background-size'] });
							}
							if (pattern?.['background-position']) {
								this.add({ 'background-position': pattern['background-position'] });
							}
							if (pattern?.['background-repeat']) {
								this.add({ 'background-repeat': pattern['background-repeat'] });
							} else {
								this.add({ 'background-repeat': 'repeat' });
							}
						}
					}
				}
				break;
			case 'backdrop':
				const backdropFilter = getLayerDeviceValue('backdropFilter', layer, props.previewDevice);
				if (backdropFilter && backdropFilter !== 'none') {
					const unit = backdropFilter === 'blur' ? 'px' : backdropFilter === 'hue-rotate' ? 'deg' : '%';
					let backdropSize = getLayerDeviceValue('backdropSize', layer, props.previewDevice) || '1';
					if (backdropFilter === 'hue-rotate') {
						backdropSize = backdropSize * 3.6;
					}
					this.add({ 'backdrop-filter': backdropFilter + '(' + backdropSize + unit + ')' });
				}
				break;
			case 'video':
				const objectFit = getLayerDeviceValue('objectFit', layer, props.previewDevice);
				const objectPosition = getLayerDeviceValue('objectPosition', layer, props.previewDevice);
				if (backgroundColor) {
					this.add({ 'background-color': getColorOutput(backgroundColor) });
				}
				this.setSelector(currentSelector + ' > .' + metaClassPrefix + index + ' .kbs-bg-video');
				if (objectFit) {
					this.add({ 'object-fit': objectFit });
				}
				if (objectPosition) {
					this.add({ 'object-position': objectPosition });
				}
				break;
		}
		if (index === 0 && backgroundType !== 'video' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector + ':hover');
		} else {
			this.setSelector(currentSelector + ':hover > .' + metaClassPrefix + index);
		}
		if (backgroundHoverOpacity || backgroundHoverOpacity === 0) {
			this.add({ opacity: backgroundHoverOpacity });
		}
		if (backgroundHoverBlendMode && backgroundHoverBlendMode !== 'normal') {
			this.add({ 'mix-blend-mode': backgroundHoverBlendMode });
		}
		switch (backgroundType) {
			case 'color':
				if (backgroundHoverColor) {
					this.add({ 'background-color': getColorOutput(backgroundHoverColor) });
				}
				break;
			case 'image':
			case 'video':
			case 'gradient':
				if (backgroundHoverColor) {
					this.add({ 'background-color': getColorOutput(backgroundHoverColor) });
				}
				break;
			case 'backdrop':
				const backdropFilter = getLayerDeviceValue('backdropFilter', layer, props.previewDevice);
				const hoverBackdropFilter =
					getLayerDeviceValue('hoverBackdropFilter', layer, props.previewDevice) || backdropFilter;
				if (hoverBackdropFilter) {
					if (hoverBackdropFilter === 'none') {
						this.add({ 'backdrop-filter': 'none' });
					} else {
						const hoverUnit =
							hoverBackdropFilter === 'blur' ? 'px' : hoverBackdropFilter === 'hue-rotate' ? 'deg' : '%';
						let backdropSize = getLayerDeviceValue('backdropSize', layer, props.previewDevice) || '1';
						let hoverBackdropSize = getLayerDeviceValue('hoverBackdropSize', layer, props.previewDevice);
						if (!hoverBackdropSize && hoverBackdropSize !== 0) {
							hoverBackdropSize = backdropSize;
						}
						if (hoverBackdropFilter === 'hue-rotate') {
							hoverBackdropSize = hoverBackdropSize * 3.6;
						}
						this.add({
							'backdrop-filter': hoverBackdropFilter + '(' + hoverBackdropSize + hoverUnit + ')',
						});
					}
				}
				break;
			case 'pattern':
				if (backgroundHoverColor) {
					this.add({ 'background-color': getColorOutput(backgroundHoverColor) });
					this.add({ '--kbs-pattern-bg': getColorOutput(backgroundHoverColor) });
				}
				const hoverPatternSize = getLayerDeviceValue('hoverPatternSize', layer, props.previewDevice);
				if (hoverPatternSize) {
					this.add({ '--kbs-pattern-size': hoverPatternSize });
				}
				const hoverPatternColor = getLayerDeviceValue('hoverPatternColor', layer, props.previewDevice);
				if (hoverPatternColor) {
					this.add({ '--kbs-pattern-color': getColorOutput(hoverPatternColor) });
				}
				break;
		}
		this.setSelector(currentSelector);
	}

	/**
	 * Loops through components and add its CSS attributes to their selector
	 * @param {string} key - The key of the attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @param {Object} metadata - The metadata of the block
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	addComponent(attributeName, meta, props, metadata) {
		if (!meta?.component) {
			return this;
		}
		if (meta?.hasLayers) {
			// Add the CSS for the layers.
			const layers = getInheritedValue(
				attributeName,
				props.attributes,
				'none',
				metadata,
				'layers',
				props.globalStylesIds
			);
			if (meta?.component === 'background') {
				const reverseLayers = Array.isArray(layers?.inheritedValue) ? [...layers.inheritedValue].reverse() : [];
				if (reverseLayers.length > 0) {
					reverseLayers.forEach((layer, index) =>
						this.processBackgroundLayer(layer, index, meta, props, metadata)
					);
				}
			}
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
				componentKeys = ['color', 'gradient', 'image', 'size', 'position', 'repeat', 'attachment'];
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
