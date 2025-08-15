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
		// Check if debugging is enabled for this component
		if (meta?.debug === true) {
			this.outputGeneratorDebug(meta, resolvedValues);
		}

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
	 * Output debug information for a component generator
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	outputGeneratorDebug(meta, resolvedValues) {
		console.group(
			`%c🔧 Generator Debug: ${this.constructor.name}`,
			'background: #4ecdc4; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
		);
		console.log('%cComponent Type:', 'font-weight: bold;', meta?.component || 'unknown');
		console.log('%cSelector:', 'font-weight: bold;', this.currentSelector);
		console.log('%cResolved Values:', 'font-weight: bold;', resolvedValues);
		console.log('%cMetadata:', 'font-weight: bold;', meta);
		console.groupEnd();
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
		// 1) Normalize hover suffix handling (strip only for mapping; selector handles :hover)
		const baseKey = key.endsWith('Hover') ? key.slice(0, -5) : key;

		// 2) Explicit exceptional cases that cannot be kebab-cased directly
		const specialCases = new Set([
			'iconSize',
			'iconLineWidth',
			'origin',
			'image',
			'size',
			'position',
			'repeat',
			'attachment',
			'gradient',
			'transitionEase',
		]);

		let property;
		if (specialCases.has(baseKey)) {
			// Minimal mapping without a large table
			switch (baseKey) {
				case 'iconSize':
					property = 'font-size';
					break;
				case 'iconLineWidth':
					property = 'stroke-width';
					break;
				case 'origin':
					property = 'transform-origin';
					break;
				case 'image':
					property = 'background-image';
					break;
				case 'size':
					property = 'background-size';
					break;
				case 'position':
					property = 'background-position';
					break;
				case 'repeat':
					property = 'background-repeat';
					break;
				case 'attachment':
					property = 'background-attachment';
					break;
				case 'gradient':
					property = 'background-image';
					break;
				case 'transitionEase':
					property = 'transition-timing-function';
					break;
				default:
					property = kebabCase(baseKey);
			}
		} else {
			property = kebabCase(baseKey);
		}

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
