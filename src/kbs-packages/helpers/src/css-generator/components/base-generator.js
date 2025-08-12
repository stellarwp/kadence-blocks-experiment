import { kebabCase } from 'lodash';
import { resolveComponentValues, shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Base class for all component CSS generators
 */
export class BaseComponentGenerator {
	constructor(cssGenerator) {
		this.cssGenerator = cssGenerator;
		this.rules = new Map();
	}

	/**
	 * Get the current selector from the main CSS generator
	 */
	get currentSelector() {
		return this.cssGenerator.currentSelector;
	}

	/**
	 * Get props from the main CSS generator
	 */
	get props() {
		return this.cssGenerator.props;
	}

	/**
	 * Get metadata from the main CSS generator
	 */
	get metadata() {
		return this.cssGenerator.metadata;
	}

	/**
	 * Set selector on the main CSS generator
	 */
	setSelector(selector) {
		this.cssGenerator.setSelector(selector);
		return this;
	}

	/**
	 * Add CSS properties to the main CSS generator
	 */
	add(properties) {
		this.cssGenerator.add(properties);
		return this;
	}

	/**
	 * Generate CSS for this component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// To be implemented by subclasses
		throw new Error('generate() must be implemented by subclass');
	}

	/**
	 * Generic implementation for simple generators
	 * @param {Object} resolvedValues - Pre-resolved component values
	 * @param {Object} meta - Component metadata
	 * @param {Function} outputFunction - Optional function to process values
	 */
	generateSimple(resolvedValues, meta, outputFunction) {
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				const cssValue = outputFunction ? outputFunction(resolvedValue.value) : resolvedValue.value;
				if (cssValue) {
					this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
				}
			}
		});
	}

	/**
	 * Process CSS value based on component type
	 * @param {string} key - The property key
	 * @param {*} value - The resolved value
	 * @param {Object} meta - Component metadata
	 * @returns {string} - The processed CSS value
	 */
	processValue(key, value, meta) {
		// Base implementation - subclasses can override
		return value;
	}

	/**
	 * Get CSS property name for a given key
	 * @param {string} key - The attribute key
	 * @param {Object} meta - Component metadata
	 * @returns {string} - The CSS property name
	 */
	getCssProperty(key, meta) {
		// Only include mappings that don't convert correctly with kebabCase
		const propertyMap = {
			// Hover variants that strip the 'Hover' suffix
			colorHover: 'color',
			textDecorationHover: 'text-decoration',
			paddingHoverTop: 'padding-top',
			paddingHoverRight: 'padding-right',
			paddingHoverBottom: 'padding-bottom',
			paddingHoverLeft: 'padding-left',
			marginHoverTop: 'margin-top',
			marginHoverRight: 'margin-right',
			marginHoverBottom: 'margin-bottom',
			marginHoverLeft: 'margin-left',
			borderTopHover: 'border-top',
			borderLeftHover: 'border-left',
			borderRightHover: 'border-right',
			borderBottomHover: 'border-bottom',
			borderTopLeftRadiusHover: 'border-top-left-radius',
			borderTopRightRadiusHover: 'border-top-right-radius',
			borderBottomRightRadiusHover: 'border-bottom-right-radius',
			borderBottomLeftRadiusHover: 'border-bottom-left-radius',
			
			// Icon properties that map to different CSS properties
			iconSize: 'font-size',
			iconLineWidth: 'stroke-width',
			iconSizeHover: 'font-size',
			iconLineWidthHover: 'stroke-width',
			
			// Short names that need full CSS property names
			origin: 'transform-origin',
			image: 'background-image',
			size: 'background-size',
			position: 'background-position',
			repeat: 'background-repeat',
			attachment: 'background-attachment',
			gradient: 'background-image',
			
			// Alias mapping
			transitionEase: 'transition-timing-function',
		};

		// Check if we have a mapping for this key
		let property = propertyMap[key] || kebabCase(key);

		// If nonInheritable is true, output direct CSS property
		if (meta?.nonInheritable === true) {
			return property;
		}

		// Otherwise, handle CSS variables with varPrefix
		if (meta?.varPrefix) {
			return meta.varPrefix + property + (meta?.varSuffix || '');
		}

		return property;
	}

	/**
	 * Get the CSS selector for a component property
	 * @param {string} key - The property key
	 * @param {Object} meta - Component metadata
	 * @returns {string} - The CSS selector
	 */
	getSelector(key, meta) {
		let selector = this.currentSelector;

		if (meta?.nonInheritable && meta?.selectorSuffix) {
			const processedSelectorSuffix = meta.selectorSuffix.replaceAll('%selector%', this.currentSelector);
			selector = this.currentSelector + processedSelectorSuffix;
		}

		// Handle hover states
		if (key.endsWith('Hover')) {
			selector = selector + ':hover';
		} else if (key.endsWith('Active')) {
			selector = selector + ':active, ' + selector + ':focus';
		}

		return selector;
	}

	/**
	 * Resolve all values for this component
	 * @param {string} attributeName - The attribute name
	 * @param {string} componentType - The component type
	 * @returns {Object} - Resolved values for all component properties
	 */
	resolveValues(attributeName, componentType) {
		const { attributes, previewDevice, globalStylesIds } = this.props;

		return resolveComponentValues(
			attributeName,
			attributes,
			previewDevice,
			this.metadata,
			globalStylesIds,
			componentType
		);
	}

	/**
	 * Apply a single CSS property
	 * @param {string} key - The property key
	 * @param {Object} resolvedValue - The resolved value object
	 * @param {Object} meta - Component metadata
	 */
	applyProperty(key, resolvedValue, meta) {
		if (!shouldRenderValue(resolvedValue, meta)) {
			return;
		}

		const cssValue = this.processValue(key, resolvedValue.value, meta);
		if (!cssValue) {
			return;
		}

		const selector = this.getSelector(key, meta);
		const property = this.getCssProperty(key, meta);

		const currentSelectorBackup = this.currentSelector;
		this.setSelector(selector);
		this.add({ [property]: cssValue });
		this.setSelector(currentSelectorBackup);
	}
}