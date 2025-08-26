import { BaseComponentGenerator } from './base-generator';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Mask component CSS generator
 * Handles mask-image properties using shape types from assets/images/masks
 */
export class MaskGenerator extends BaseComponentGenerator {
	/**
	 * Map of shape types to their corresponding mask image files
	 */
	static maskImages = {
		'thumbs-down': 'thumbs-down.svg',
		'thumbs-up': 'thumbs-up.svg',
		'smile-beam': 'smile-beam.svg',
		star: 'star.svg',
		'mug-hot': 'mug-hot.svg',
		rounded: 'rounded.svg',
		heart: 'heart.svg',
		hexagon: 'hexagon.svg',
		dog: 'dog.svg',
		diamond: 'diamond.svg',
		cat: 'cat.svg',
		circle: 'circle.svg',
		blob1: 'blob1.svg',
		blob2: 'blob2.svg',
		blob3: 'blob3.svg',
	};

	/**
	 * Generate CSS for mask component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Check if debugging is enabled for this component
		if (meta?.debug === true) {
			this.outputGeneratorDebug(meta, resolvedValues);
		}

		// Handle shape-based masks
		const shapeValue = resolvedValues.shape;
		if (shapeValue && shouldRenderValue(shapeValue, meta)) {
			const cssValue = this.processMaskValue(shapeValue.value, resolvedValues, meta);
			if (cssValue) {
				this.applyProperty('shape', { ...shapeValue, value: cssValue }, meta);
			}
		}
	}

	/**
	 * Process mask value to generate CSS mask-image URL
	 * @param {string} shapeType - The shape type value
	 * @param {Object} resolvedValues - All resolved values for the component
	 * @param {Object} meta - Component metadata
	 * @returns {string|null} - The processed CSS value or null if invalid
	 */
	processMaskValue(shapeType, resolvedValues, meta) {
		if (!shapeType || typeof shapeType !== 'string') {
			return null;
		}

		// Handle custom shape - look for image key
		if (shapeType === 'custom') {
			const imageValue = resolvedValues.image;
			if (imageValue && imageValue.value) {
				return `url("${imageValue.value}")`;
			}
			return null;
		}

		// Normalize the shape type (convert to kebab-case if needed)
		const normalizedShapeType = shapeType.toLowerCase().replace(/\s+/g, '-');

		// Get the corresponding mask image file
		const maskImageFile = MaskGenerator.maskImages[normalizedShapeType];

		if (!maskImageFile) {
			// If shape type not found, return null (no CSS will be generated)
			return null;
		}

		// Construct the URL to the mask image
		// The path should be relative to the plugin's assets directory
		const maskImageUrl = `url("${this.getMaskImageUrl(maskImageFile)}")`;

		return maskImageUrl;
	}

	/**
	 * Get the URL for a mask image file
	 * @param {string} maskImageFile - The mask image filename
	 * @returns {string} - The URL to the mask image
	 */
	getMaskImageUrl(maskImageFile) {
		// Construct the path to the mask image in the assets directory
		// This assumes the plugin's assets are accessible via a URL path
		const pluginUrl = this.getPluginUrl();
		return `${pluginUrl}/src/assets/images/masks/${maskImageFile}`;
	}

	/**
	 * Get the plugin URL for constructing asset paths
	 * @returns {string} - The plugin URL
	 */
	getPluginUrl() {
		// This should be provided by the main CSS generator or passed as metadata
		// For now, we'll use a fallback that can be overridden
		return this.metadata?.pluginUrl || '/wp-content/plugins/kadence-blocks-experiment';
	}

	/**
	 * Override the CSS property name to always use mask-image
	 * @param {string} key - The attribute key
	 * @param {Object} meta - Component metadata
	 * @returns {string} - The CSS property name
	 */
	getCssProperty(key, meta) {
		// For mask generator, we always want to output mask-image
		// Both shape and url properties should output mask-image
		return 'mask-image';
	}
}
