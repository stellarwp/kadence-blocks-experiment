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
			this.generateSimpleShadow(resolvedValues, meta);
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
				this.applyShadowProperty(shadowValues, meta);
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
		shadowString += `${shadowColor} ${shadowX} ${shadowY} ${shadowBlur}`;
		if (isBoxShadow && shadowSpread !== '') {
			shadowString += ` ${shadowSpread}`;
		}

		return shadowString.trim();
	}

	/**
	 * Apply shadow property to the element
	 */
	applyShadowProperty(shadowValue, meta) {
		const property = meta.component === 'boxShadow' ? 'box-shadow' : 'text-shadow';
		const selector = this.getSelector(meta.component, meta);
		
		const currentSelectorBackup = this.currentSelector;
		this.setSelector(selector);
		this.add({ [property]: shadowValue });
		this.setSelector(currentSelectorBackup);
	}

	/**
	 * Generate simple shadow (non-layered fallback)
	 */
	generateSimpleShadow(resolvedValues, meta) {
		const shadowValue = resolvedValues[meta.component];
		if (shadowValue?.value) {
			this.applyShadowProperty(shadowValue.value, meta);
		}
	}

	/**
	 * Override getCssProperty for shadow-specific mappings
	 */
	getCssProperty(key, meta) {
		if (meta.component === 'boxShadow') {
			return 'box-shadow';
		} else if (meta.component === 'textShadow') {
			return 'text-shadow';
		}

		return super.getCssProperty(key, meta);
	}
}