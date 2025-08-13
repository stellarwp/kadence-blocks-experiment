import { merge } from 'lodash';
import { mergeInitialAttribute, getPreviewProperty } from './utils/attribute-helpers';
import { 
	getSizingOutput,
	getFontSizeOutput,
	getLineHeightOutput,
	getLetterSpacingOutput,
	getIconSizeOutput,
	getSpacingOutput,
	getColorOutput
} from './utils/output-helpers';
import { resolveComponentValues } from './utils/component-value-resolver';
import getBundlePresetValue from '../get-bundle-preset-value';
import { select } from '@wordpress/data';

import { TypographyGenerator } from './components/typography-generator';
import { FlexBoxGenerator } from './components/flexbox-generator';
import { BorderGenerator } from './components/border-generator';
import { TransformGenerator } from './components/transform-generator';
import { SimpleGenerator } from './components/simple-generator';
import { DimensionGenerator } from './components/dimension-generator';
import { BackgroundGenerator } from './components/background-generator';
import { ShadowGenerator } from './components/shadow-generator';
import { IconGenerator } from './components/icon-generator';
import { TransitionGenerator } from './components/transition-generator';
import { TextGenerator } from './components/text-generator';

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

	constructor(selector = '', props = {}, metadata = {}) {
		this.rules = new Map();
		this.currentSelector = selector;
		this.props = props;
		this.metadata = metadata;

		const simpleGenerator = new SimpleGenerator(this);
		
		this.generators = {
			typography: new TypographyGenerator(this),
			flexBox: new FlexBoxGenerator(this),
			flexChild: simpleGenerator,
			border: new BorderGenerator(this),
			transform: new TransformGenerator(this),
			background: new BackgroundGenerator(this),
			boxShadow: new ShadowGenerator(this),
			textShadow: new ShadowGenerator(this),
			icon: new IconGenerator(this),
			transition: new TransitionGenerator(this),
			textAlign: new TextGenerator(this),
			linkStyle: new TextGenerator(this),
			textOrientation: new TextGenerator(this),
			
			maxWidth: new DimensionGenerator(this),
			maxHeight: new DimensionGenerator(this),
			minWidth: new DimensionGenerator(this),
			minHeight: new DimensionGenerator(this),
			width: new DimensionGenerator(this),
			height: new DimensionGenerator(this),
			
			color: simpleGenerator,
			padding: simpleGenerator,
			margin: simpleGenerator,
		};
	}

	build() {
		if (this.metadata?.attributes) {
			Object.entries(this.metadata.attributes).forEach(([attributeName, value]) => {
				if (value.renderCSS) {
					if (value?.component) {
						this.addComponent(attributeName, value, this.props, this.metadata);
					} else {
						this.addAttribute(attributeName, value, this.props);
					}
				}
			});
			
			// Second pass: Process bundle presets
			Object.entries(this.metadata.attributes).forEach(([attributeName, value]) => {
				if (value?.bundlePreset && !value.renderCSS) {
					// Get the bundle preset value (e.g., "primary", "secondary", etc.)
					const bundlePresetValue = this.props.attributes?.[attributeName] || value?.initial;
					
					if (bundlePresetValue) {
						// Get the resolved preset data from global styles
						const bundlePresetComponent = value?.component;
						const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
							this.props.globalStylesIds || [],
							bundlePresetComponent,
							'presets.' + bundlePresetValue
						);
						
						// If we have preset data, process each attribute it contains
						if (rawPresetData?.attributes) {
							Object.entries(rawPresetData.attributes).forEach(([presetAttributeName, presetAttributeValue]) => {
								// Check if this attribute exists in the metadata and should render CSS
								const presetAttributeMeta = this.metadata.attributes?.[presetAttributeName];
								if (presetAttributeMeta && presetAttributeMeta.renderCSS !== false) {
									// Create a modified props with the preset values
									const modifiedProps = {
										...this.props,
										attributes: {
											...this.props.attributes,
											[presetAttributeName]: presetAttributeValue
										}
									};
									
									// Process the attribute
									if (presetAttributeMeta?.component) {
										this.addComponent(presetAttributeName, presetAttributeMeta, modifiedProps, this.metadata);
									} else {
										this.addAttribute(presetAttributeName, presetAttributeMeta, modifiedProps);
									}
								}
							});
						}
					}
				}
			});
		}
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
		const mergedAttribute = mergeInitialAttribute(meta, attributes?.[key] || {});

		// Check if the attribute exists in the attributes object
		if (mergedAttribute) {
			if (!meta?.property && !meta?.varPrefix) {
				return this;
			}

			this.renderStringProperty(
				mergedAttribute,
				meta?.varPrefix ? meta?.varPrefix : meta?.property,
				previewDevice
			);
		}
		return this;
	}

	/**
	 * Loops through components and add its CSS attributes to their selector
	 * @param {string} attributeName - The name of the attribute
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @param {Object} metadata - The metadata of the block
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	addComponent(attributeName, meta, props, metadata) {
		if (!meta?.component) {
			return this;
		}

		const componentType = meta.component;

		// Check if we have a generator for this component type
		if (this.generators[componentType]) {
			// Resolve all values for the component at once
			const resolvedValues = resolveComponentValues(
				attributeName,
				props.attributes,
				props.previewDevice,
				metadata,
				props.globalStylesIds,
				componentType
			);

			// Generate CSS using the appropriate component generator
			this.generators[componentType].generate(attributeName, meta, resolvedValues);
			return this;
		}

		// Fallback for any components not in the generators map
		console.warn(`Component type "${componentType}" not found in generators map`);
		return this;
	}

	/**
	 * Process a single background layer - delegation method for backward compatibility
	 * @param {Object} layer - The background layer object
	 * @param {number} index - The layer index
	 * @param {Object} attributeMeta - The attribute metadata
	 * @param {Object} props - The props object
	 * @param {Object} meta - Additional metadata
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	processBackgroundLayer(layer, index, attributeMeta, props, meta) {
		// Store original props and metadata
		const originalProps = this.props;
		const originalMetadata = this.metadata;
		
		// Update the CSSGenerator's props and metadata
		// This will be picked up by the BackgroundGenerator through its getters
		this.props = props || this.props;
		this.metadata = meta || this.metadata;
		
		// Call the background generator's processBackgroundLayer method
		this.generators.background.processBackgroundLayer(layer, index, attributeMeta);
		
		// Restore original props and metadata
		this.props = originalProps;
		this.metadata = originalMetadata;
		
		return this;
	}


	/**
	 * Render the property as a string
	 * @param {string} attributeValue - The value of the attribute
	 * @param {string} selector - The CSS selector
	 * @param {string} previewDevice - The preview device
	 */
	renderStringProperty(attributeValue, selector, previewDevice) {
		const propertyValue = String(getPreviewProperty(attributeValue, previewDevice));
		if (!propertyValue) {
			return this;
		}
		this.add({ [selector]: getSizingOutput(propertyValue) });
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
		if (this.metadata?.name) {
			// Are we building a block
			this.build();
		}

		let css = '';
		this.rules.forEach((properties, selector) => {
			css += this._generateRuleString(selector, properties);
		});
		return css;
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