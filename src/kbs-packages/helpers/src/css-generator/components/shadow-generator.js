import { BaseComponentGenerator } from './base-generator';
import { getColorOutput } from '../utils/output-helpers';
import getLayerDeviceValue from '../../get-layer-device-value';
import getInheritedValue from '../../get-inherited-value';
import { SHADOW_STYLES_DEFAULTS, TEXT_SHADOW_STYLES_DEFAULTS } from '../../constants/shadows';

/**
 * Shadow component CSS generator
 * Handles both box-shadow and text-shadow with multiple layers
 */
export class ShadowGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for shadow component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Shadows use layers
		if (meta?.hasLayers) {
			this.generateLayeredShadows(attributeName, meta);
		} else {
			// Simple shadow without layers (shouldn't happen typically)
			this.generateSimpleShadow(resolvedValues, meta, attributeName);
		}
	}

	/**
	 * Generate CSS for layered shadows
	 */
	generateLayeredShadows(attributeName, meta) {
		const layers = getInheritedValue(
			attributeName,
			this.props.attributes,
			'none',
			this.metadata,
			'layers',
			this.props.globalStylesIds
		);

		const reverseLayers = Array.isArray(layers?.inheritedValue) ? [...layers.inheritedValue].reverse() : [];
		if (reverseLayers.length > 0) {
			const shadowValues = this.buildShadowValues(reverseLayers, meta);
			if (shadowValues) {
				this.applyShadowProperty(shadowValues, meta, attributeName);
			}
		}
	}

	/**
	 * Build shadow values from layers
	 */
	buildShadowValues(layers, meta) {
		const shadowParts = [];
		const isBoxShadow = meta.component === 'boxShadow';
		const shadowDefaults = isBoxShadow ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

		layers.forEach((layer, index) => {
			const shadowValue = this.buildSingleShadow(layer, shadowDefaults, isBoxShadow);
			if (shadowValue) {
				shadowParts.push(shadowValue);
			}
		});

		return shadowParts.length > 0 ? shadowParts.join(', ') : '';
	}

	/**
	 * Build a single shadow value from a layer
	 */
	buildSingleShadow(layer, shadowDefaults, isBoxShadow) {
		let shadowColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		let shadowX = getLayerDeviceValue('x', layer, this.props.previewDevice);
		let shadowY = getLayerDeviceValue('y', layer, this.props.previewDevice);
		let shadowBlur = getLayerDeviceValue('blur', layer, this.props.previewDevice);
		let shadowSpread = isBoxShadow ? getLayerDeviceValue('spread', layer, this.props.previewDevice) : null;
		const shadowInset = isBoxShadow ? getLayerDeviceValue('inset', layer, this.props.previewDevice) : false;

		// Apply defaults
		shadowColor = shadowColor ? getColorOutput(shadowColor) : shadowDefaults.color.var;
		shadowX = shadowX || shadowX === 0 ? shadowX : shadowDefaults.x.var;
		shadowY = shadowY || shadowY === 0 ? shadowY : shadowDefaults.y.var;
		shadowBlur = shadowBlur || shadowBlur === 0 ? shadowBlur : shadowDefaults.blur.var;
		
		if (isBoxShadow) {
			shadowSpread = shadowSpread || shadowSpread === 0 ? shadowSpread : shadowDefaults.spread.var;
		}

		if (!shadowColor) {
			return '';
		}

		// Build the shadow string
		let shadowString = '';
		if (shadowInset) {
			shadowString += 'inset ';
		}
		shadowString += `${shadowX} ${shadowY} ${shadowBlur}`;
		if (isBoxShadow && shadowSpread !== '') {
			shadowString += ` ${shadowSpread}`;
		}
		shadowString += ` ${shadowColor}`;

		return shadowString.trim();
	}

	/**
	 * Apply shadow property to the element
	 */
	applyShadowProperty(shadowValue, meta, attributeName) {
		// Use the proper CSS property that respects varPrefix
		const property = this.getCssProperty(attributeName || meta.component, meta);
		// Use attributeName for selector to properly handle hover states
		const selector = this.getSelector(attributeName || meta.component, meta);
		
		const currentSelectorBackup = this.currentSelector;
		this.setSelector(selector);
		this.add({ [property]: shadowValue });
		this.setSelector(currentSelectorBackup);
	}

	/**
	 * Generate simple shadow (non-layered fallback)
	 */
	generateSimpleShadow(resolvedValues, meta, attributeName) {
		const shadowValue = resolvedValues[meta.component];
		if (shadowValue?.value) {
			this.applyShadowProperty(shadowValue.value, meta, attributeName || meta.component);
		}
	}

	/**
	 * Override getCssProperty for shadow-specific mappings
	 */
	getCssProperty(key, meta) {
		// Map component names to CSS property names
		let mappedKey = key;
		if (key === 'boxShadow' || key === 'boxShadowHover') {
			// Both map to 'box-shadow' - the hover suffix comes from varSuffix
			mappedKey = 'box-shadow';
		} else if (key === 'textShadow' || key === 'textShadowHover') {
			// Both map to 'text-shadow' - the hover suffix comes from varSuffix
			mappedKey = 'text-shadow';
		}

		// Handle varPrefix if specified
		if (meta?.varPrefix) {
			return meta.varPrefix + mappedKey + (meta?.varSuffix || '');
		}

		return mappedKey;
	}
}