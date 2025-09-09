import { mergeInitialAttribute, getPreviewProperty } from './utils/attribute-helpers';
import { getSizingOutput } from './utils/output-helpers';
import { resolveComponentValues } from './utils/component-value-resolver';
import { select } from '@wordpress/data';

import { TypographyGenerator } from './components/typography-generator';
import { BorderGenerator } from './components/border-generator';
import { TransformGenerator } from './components/transform-generator';
import { SimpleGenerator } from './components/simple-generator';
import { BackgroundGenerator } from './components/background-generator';
import { ShadowGenerator } from './components/shadow-generator';
import { IconGenerator } from './components/icon-generator';
import { TextGenerator } from './components/text-generator';
import { MaskGenerator } from './components/mask-generator';
import { FilterGenerator } from './components/filter-generator';
import { StickyGenerator } from './components/sticky-generator';

/**
 * CSS Generator class for building CSS strings
 */
class CSSGenerator {
	constructor(selector = '', props = {}, metadata = {}) {
		this.rules = new Map();
		this.currentSelector = selector;
		this.props = this.propagateVariantPresets(props, metadata);
		this.metadata = metadata;

		const simpleGenerator = new SimpleGenerator(this);

		this.generators = {
			typography: new TypographyGenerator(this),
			flexBox: simpleGenerator,
			flexChild: simpleGenerator,
			border: new BorderGenerator(this),
			transform: new TransformGenerator(this),
			background: new BackgroundGenerator(this),
			boxShadow: new ShadowGenerator(this),
			textShadow: new ShadowGenerator(this),
			icon: new IconGenerator(this),
			transition: simpleGenerator,
			textAlign: new TextGenerator(this),
			linkStyle: new TextGenerator(this),
			textOrientation: new TextGenerator(this),
			mask: new MaskGenerator(this),
			filter: new FilterGenerator(this),
            sticky: new StickyGenerator(this),

			maxWidth: simpleGenerator,
			maxHeight: simpleGenerator,
			minWidth: simpleGenerator,
			minHeight: simpleGenerator,
			width: simpleGenerator,
			height: simpleGenerator,

			color: simpleGenerator,
			padding: simpleGenerator,
			margin: simpleGenerator,

			simple: simpleGenerator,
		};
	}

	/**
	 * Deep merge helper that only adds missing values
	 * Existing values in target take priority
	 */
	deepMergeWithPriority(target, source) {
		if (!source || typeof source !== 'object') {
			return target;
		}

		const result = { ...target };

		Object.keys(source).forEach((key) => {
			if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
				// If target doesn't have this key at all, add the entire source value
				if (!result[key]) {
					result[key] = source[key];
				} else if (typeof result[key] === 'object' && !Array.isArray(result[key])) {
					// Both are objects, recurse
					result[key] = this.deepMergeWithPriority(result[key], source[key]);
				}
				// If target has a value that's not an object, keep it (user override)
			} else if (result[key] === undefined || result[key] === null || result[key] === '') {
				// For primitive values and arrays, only set if target doesn't have a value
				result[key] = source[key];
			}
		});

		return result;
	}

	/**
	 * Propagate variant presets to component attributes
	 * This ensures that when a variant defines values for components,
	 * those values are applied if the component doesn't already have them
	 *
	 * @param {Object} props - The original props
	 * @param {Object} metadata - The block metadata
	 * @returns {Object} - Modified props with propagated values
	 */
	propagateVariantPresets(props, metadata) {
		// Early return if no metadata or attributes
		if (!metadata?.attributes || !props?.attributes) {
			return props;
		}

		// Create a copy of props to avoid mutations
		const modifiedProps = { ...props };
		const modifiedAttributes = { ...props.attributes };

		// Look for bundle preset attributes (variants)
		Object.entries(metadata.attributes).forEach(([attributeName, attributeMeta]) => {
			if (attributeMeta?.bundlePreset) {
				// Get the variant value
				const variantValue = props.attributes?.[attributeName] || attributeMeta?.initial;

				if (variantValue) {
					const bundlePresetComponent = attributeMeta?.component;

					// Check if we can access the global styles store
					if (select && select('kadenceblocks/global-styles')) {
						// Get the variant's preset data
						const variantData = select('kadenceblocks/global-styles').getResolvedStyleData(
							props.globalStylesIds || [],
							bundlePresetComponent,
							'presets.' + variantValue
						);

						// If the variant has attributes, merge them
						if (variantData?.attributes) {
							Object.entries(variantData.attributes).forEach(([componentName, componentValue]) => {
								// Ensure the component attribute exists
								if (!modifiedAttributes[componentName]) {
									// If the attribute doesn't exist at all, add the entire value
									modifiedAttributes[componentName] = componentValue;
								} else {
									// Deep merge, preserving existing user values
									modifiedAttributes[componentName] = this.deepMergeWithPriority(
										modifiedAttributes[componentName],
										componentValue
									);
								}
							});
						}
					}
				}
			}
		});

		// Return the modified props
		modifiedProps.attributes = modifiedAttributes;
		return modifiedProps;
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

		if (mergedAttribute) {
			if (!meta?.property && !meta?.varPrefix) {
				return this;
			}

			// Fast path for direct property without variable prefix
			const propertyKey = meta?.varPrefix ? meta?.varPrefix : meta?.property;
			const propertyValue = getPreviewProperty(mergedAttribute, previewDevice);
			if (propertyValue !== undefined && propertyValue !== null && propertyValue !== '') {
				this.add({ [propertyKey]: getSizingOutput(String(propertyValue)) });
			}
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

		// Check if debugging is enabled for this component
		if (meta?.debug === true) {
			this.outputComponentDebug(attributeName, componentType, props, meta, metadata);
		}

		const generator = this.generators[componentType] ?? this.generators.simple;

		if (generator) {
			// Resolve all values for the component at once
			const resolvedValues = resolveComponentValues(
				attributeName,
				props.attributes,
				props.previewDevice,
				metadata,
				props.globalStylesIds,
				componentType
			);

			generator.generate(attributeName, meta, resolvedValues);
			return this;
		}

		console.warn(`Component type "${componentType}" not found`);
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
	 * Add CSS properties to the current selector
	 * @param {Object} properties - Object containing CSS properties and values
	 * @returns {CSSGenerator} - Returns this instance for chaining
	 */
	add(properties) {
		if (!this.currentSelector || !properties || Object.keys(properties).length === 0) {
			return this;
		}

		const existingProperties = this.rules.get(this.currentSelector) || {};
		// Preserve first-write to ensure direct values added in the primary pass
		// are not overridden by bundle preset/application passes. Merge so that
		// any existing property on this selector keeps priority over newly added
		// ones for the same CSS property key.
		const mergedProperties = { ...properties, ...existingProperties };
		this.rules.set(this.currentSelector, mergedProperties);
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

	/**
	 * Output debug information for a component
	 * @param {string} attributeName - The attribute name
	 * @param {string} componentType - The component type
	 * @param {Object} props - The props of the block
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} metadata - The metadata of the block
	 */
	outputComponentDebug(attributeName, componentType, props, meta, metadata) {
		const debugData = {
			attributeName,
			componentType,
			selector: this.currentSelector,
			selectorSuffix: meta?.selectorSuffix || '',
			attributes: props.attributes?.[attributeName] || null,
			metadata: meta,
			previewDevice: props.previewDevice || 'desktop',
			globalStylesIds: props.globalStylesIds || [],
			blockMetadata: metadata?.name || 'unknown',
		};

		// Console log with styled output
		console.group(
			`%c🐛 KBS Component Debug: ${componentType}`,
			'background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
		);
		console.log('%cAttribute:', 'font-weight: bold;', attributeName);
		console.log('%cSelector:', 'font-weight: bold;', this.currentSelector);
		console.log('%cSelector Suffix:', 'font-weight: bold;', debugData.selectorSuffix);
		console.log('%cPreview Device:', 'font-weight: bold;', debugData.previewDevice);
		console.log('%cAttribute Data:', 'font-weight: bold;', debugData.attributes);
		console.log('%cMetadata:', 'font-weight: bold;', debugData.metadata);
		console.log('%cGlobal Style IDs:', 'font-weight: bold;', debugData.globalStylesIds);
		console.log('%cFull Debug Data:', 'font-weight: bold;', debugData);
		console.groupEnd();
	}
}

export default CSSGenerator;
