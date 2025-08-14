import { BaseComponentGenerator } from './base-generator';
import { getColorOutput } from '../utils/output-helpers';
import getLayerDeviceValue from '../../get-layer-device-value';
import getInheritedValue from '../../get-inherited-value';
import getPatternOptions from '../../get-pattern-options';
import getMaskOptions from '../../get-mask-options';
import getDividerOptions from '../../get-divider-options';

/**
 * Background component CSS generator
 * Handles layered backgrounds including colors, images, gradients, masks, patterns, etc.
 */
export class BackgroundGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for background component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values (for non-layered)
	 */
	generate(attributeName, meta, resolvedValues) {
		// Background components use layers
		if (meta?.hasLayers) {
			this.generateLayeredBackground(attributeName, meta);
		} else {
			// Simple background without layers
			this.generateSimpleBackground(resolvedValues, meta);
		}
	}

	/**
	 * Generate CSS for layered backgrounds
	 */
	generateLayeredBackground(attributeName, meta) {
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
			reverseLayers.forEach((layer, index) => {
				this.processBackgroundLayer(layer, index, meta);
			});
		}
	}

	/**
	 * Generate CSS for simple background (non-layered)
	 */
	generateSimpleBackground(resolvedValues, meta) {
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (!resolvedValue?.value) return;

			const cssValue = this.processBackgroundValue(key, resolvedValue.value);
			if (cssValue) {
				this.applyProperty(key, { ...resolvedValue, value: cssValue }, meta);
			}
		});
	}

	/**
	 * Process a single background layer
	 */
	processBackgroundLayer(layer, index, meta) {
		const currentSelector = this.currentSelector;
		const metaClassPrefix = meta?.classPrefix || 'kbs-bg-style-';
		const backgroundType = getLayerDeviceValue('type', layer, this.props.previewDevice) || 'color';
		const anyBackgroundOpacity = getLayerDeviceValue('opacity', layer, 'Mobile');
		
		// Determine selector for this layer
		let tempSelector = currentSelector;
		if (index === 0 && backgroundType !== 'video' && backgroundType !== 'pattern' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector);
		} else {
			tempSelector = currentSelector + ' > .' + metaClassPrefix + index;
			this.setSelector(tempSelector);
		}

		// Process based on background type
		switch (backgroundType) {
			case 'color':
				this.processColorBackground(layer);
				break;
			case 'image':
				this.processImageBackground(layer);
				break;
			case 'gradient':
				this.processGradientBackground(layer);
				break;
			case 'mask':
				this.processMaskBackground(layer, tempSelector);
				break;
			case 'backdrop':
				this.processBackdropBackground(layer);
				break;
			case 'video':
				this.processVideoBackground(layer, metaClassPrefix, index);
				break;
		}

		// Handle opacity and blend mode
		const backgroundOpacity = getLayerDeviceValue('opacity', layer, this.props.previewDevice);
		const backgroundBlendMode = getLayerDeviceValue('blendMode', layer, this.props.previewDevice);
		
		if (backgroundOpacity || backgroundOpacity === 0) {
			this.add({ opacity: backgroundOpacity });
		}
		if (backgroundBlendMode && backgroundBlendMode !== 'normal') {
			this.add({ 'mix-blend-mode': backgroundBlendMode });
		}

		// Handle hover states
		this.processBackgroundHoverStates(layer, index, metaClassPrefix, backgroundType, anyBackgroundOpacity);

		// Reset selector
		this.setSelector(currentSelector);
	}

	/**
	 * Process color background
	 */
	processColorBackground(layer) {
		const backgroundColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		if (backgroundColor) {
			this.add({ 'background-color': getColorOutput(backgroundColor) });
		}
	}

	/**
	 * Process image background
	 */
	processImageBackground(layer) {
		const backgroundColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		const backgroundImage = getLayerDeviceValue('image', layer, this.props.previewDevice);
		
		if (backgroundColor) {
			this.add({ 'background-color': getColorOutput(backgroundColor) });
		}
		
		if (backgroundImage) {
			this.add({ 'background-image': 'url(' + backgroundImage + ')' });
			
			const backgroundPosition = getLayerDeviceValue('position', layer, this.props.previewDevice);
			if (backgroundPosition) {
				this.add({ 'background-position': backgroundPosition });
			}
			
			const backgroundSize = getLayerDeviceValue('size', layer, this.props.previewDevice);
			if (backgroundSize) {
				this.add({ 'background-size': backgroundSize });
			}
			
			const backgroundRepeat = getLayerDeviceValue('repeat', layer, this.props.previewDevice);
			if (backgroundRepeat) {
				this.add({ 'background-repeat': backgroundRepeat });
			}
			
			const backgroundAttachment = getLayerDeviceValue('attachment', layer, this.props.previewDevice);
			if (backgroundAttachment) {
				this.add({
					'background-attachment': backgroundAttachment === 'parallax' ? 'fixed' : backgroundAttachment,
				});
			}
		}
	}

	/**
	 * Process gradient background
	 */
	processGradientBackground(layer) {
		const backgroundColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		const backgroundGradient = getLayerDeviceValue('gradient', layer, this.props.previewDevice);
		
		if (backgroundColor) {
			this.add({ 'background-color': getColorOutput(backgroundColor) });
		}
		if (backgroundGradient) {
			this.add({ 'background-image': backgroundGradient });
		}
	}

	/**
	 * Process mask background
	 */
	processMaskBackground(layer, tempSelector) {
		const maskType = getLayerDeviceValue('maskType', layer, this.props.previewDevice);
		const maskColor = getLayerDeviceValue('maskColor', layer, this.props.previewDevice);
		const backgroundColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		
		// Set background color variables
		if (backgroundColor) {
			this.add({ 'background-color': getColorOutput(backgroundColor) });
			this.add({ '--kbs-mask-bg': getColorOutput(backgroundColor) });
		} else {
			this.add({ '--kbs-mask-bg': 'transparent' });
		}
		
		if (maskColor) {
			this.add({ '--kbs-mask-color': getColorOutput(maskColor) });
		} else {
			this.add({ '--kbs-mask-color': getColorOutput('palette3') });
		}

		// Process different mask types
		if (maskType === 'pattern') {
			this.processPatternMask(layer, tempSelector, maskColor);
		} else if (maskType === 'divider') {
			this.processDividerMask(layer, tempSelector, maskColor);
		} else {
			this.processStandardMask(layer, tempSelector, maskColor);
		}
	}

	/**
	 * Process pattern mask
	 */
	processPatternMask(layer, tempSelector, maskColor) {
		const backgroundPattern = getLayerDeviceValue('pattern', layer, this.props.previewDevice);
		if (!backgroundPattern) return;

		const patternSize = getLayerDeviceValue('patternSize', layer, this.props.previewDevice);
		const patternPosition = getLayerDeviceValue('patternPosition', layer, this.props.previewDevice) || 'top left';
		
		this.add({ '--kbs-pattern-size': patternSize || '20' });
		
		const pattern = getPatternOptions().find((p) => p.value === backgroundPattern);
		if (pattern?.svg) {
			this.setSelector(tempSelector + ' .kbs-pattern-svg');
			this.add({ background: maskColor ? getColorOutput(maskColor) : getColorOutput('palette3') });
			this.add({
				'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(pattern.svg)}")`,
				'mask-repeat': 'repeat',
				'mask-size': `calc( (1px * ${pattern.size}) * (var(--kbs-pattern-size) / 20))`,
				'mask-position': patternPosition,
			});
			this.setSelector(tempSelector);
		}
	}

	/**
	 * Process divider mask
	 */
	processDividerMask(layer, tempSelector, maskColor) {
		const backgroundDivider = getLayerDeviceValue('divider', layer, this.props.previewDevice);
		const dividerWidth = getLayerDeviceValue('dividerWidth', layer, this.props.previewDevice);
		const dividerHeight = getLayerDeviceValue('dividerHeight', layer, this.props.previewDevice);
		const dividerPosition = getLayerDeviceValue('dividerPosition', layer, this.props.previewDevice);
		const dividerSide = dividerPosition === 'left' || dividerPosition === 'right' ? 'vertical' : 'horizontal';
		
		if (dividerWidth) {
			this.add({ '--kbs-divider-width': dividerWidth });
		}
		if (dividerHeight) {
			this.add({ '--kbs-divider-height': dividerHeight });
		}
		
		if (backgroundDivider) {
			const dividerObject = getDividerOptions()[dividerSide].find(({ value }) => value === backgroundDivider) || {};
			if (dividerObject?.svg) {
				this.setSelector(tempSelector + ' .kbs-divider-svg-wrapper .kbs-divider-svg');
				this.add({ 
					background: maskColor ? getColorOutput(maskColor) : getColorOutput('palette3'),
					'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(dividerObject.svg)}")`,
					'mask-repeat': 'no-repeat',
				});
				this.setSelector(tempSelector);
			}
		}
	}

	/**
	 * Process standard mask
	 */
	processStandardMask(layer, tempSelector, maskColor) {
		const backgroundMask = getLayerDeviceValue('mask', layer, this.props.previewDevice);
		const backgroundMaskSize = getLayerDeviceValue('maskSize', layer, this.props.previewDevice);
		const maskAlignX = getLayerDeviceValue('alignX', layer, this.props.previewDevice);
		const maskAlignY = getLayerDeviceValue('alignY', layer, this.props.previewDevice);
		const maskInverted = getLayerDeviceValue('maskInverted', layer, this.props.previewDevice);
		const maskSubset = maskInverted === 'enabled' ? 'inverted' : 'normal';
		
		const mask = getMaskOptions()[maskSubset].find((m) => m.value === backgroundMask);
		if (!mask?.path) return;

		this.setSelector(tempSelector + ' .kbs-pattern-mask-svg');
		this.add({ background: maskColor ? getColorOutput(maskColor) : getColorOutput('palette3') });
		
		const ratio = backgroundMaskSize === 'stretch' ? 'none' : 'xMidYMid meet';
		this.add({
			'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(
				'<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="' + ratio + 
				'" viewBox="0 0 1920 1200" fill="black"><path d="' + mask.path + '" /></svg>'
			)}")`,
			'mask-repeat': 'no-repeat',
			'mask-size': backgroundMaskSize === 'contain' ? 'contain' : 'cover',
		});

		// Set mask position
		let positionX = 'center';
		let positionY = 'center';
		if (maskAlignX === 'min') positionX = 'left';
		else if (maskAlignX === 'max') positionX = 'right';
		if (maskAlignY === 'min') positionY = 'top';
		else if (maskAlignY === 'max') positionY = 'bottom';
		this.add({ 'mask-position': positionX + ' ' + positionY });

		// Handle flipping
		const flipX = getLayerDeviceValue('flipX', layer, this.props.previewDevice) === 'enabled';
		const flipY = getLayerDeviceValue('flipY', layer, this.props.previewDevice) === 'enabled';
		if (flipX || flipY) {
			this.add({
				transform: `scaleX(${flipX ? '-1' : '1'}) scaleY(${flipY ? '-1' : '1'})`,
			});
		}
		
		this.setSelector(tempSelector);
	}

	/**
	 * Process backdrop filter background
	 */
	processBackdropBackground(layer) {
		const backdropFilter = getLayerDeviceValue('backdropFilter', layer, this.props.previewDevice);
		if (backdropFilter && backdropFilter !== 'none') {
			const unit = backdropFilter === 'blur' ? 'px' : backdropFilter === 'hue-rotate' ? 'deg' : '%';
			let backdropSize = getLayerDeviceValue('backdropSize', layer, this.props.previewDevice) || '1';
			if (backdropFilter === 'hue-rotate') {
				backdropSize = backdropSize * 3.6;
			}
			this.add({ 'backdrop-filter': backdropFilter + '(' + backdropSize + unit + ')' });
		}
	}

	/**
	 * Process video background
	 */
	processVideoBackground(layer, metaClassPrefix, index) {
		const backgroundColor = getLayerDeviceValue('color', layer, this.props.previewDevice);
		const objectFit = getLayerDeviceValue('objectFit', layer, this.props.previewDevice);
		const objectPosition = getLayerDeviceValue('objectPosition', layer, this.props.previewDevice);
		
		if (backgroundColor) {
			this.add({ 'background-color': getColorOutput(backgroundColor) });
		}
		
		this.setSelector(this.currentSelector + ' > .' + metaClassPrefix + index + ' .kbs-bg-video');
		if (objectFit) {
			this.add({ 'object-fit': objectFit });
		}
		if (objectPosition) {
			this.add({ 'object-position': objectPosition });
		}
	}

	/**
	 * Process background hover states
	 */
	processBackgroundHoverStates(layer, index, metaClassPrefix, backgroundType, anyBackgroundOpacity) {
		const currentSelector = this.currentSelector;
		
		// Set hover selector
		if (index === 0 && backgroundType !== 'video' && backgroundType !== 'mask' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector + ':hover');
		} else {
			this.setSelector(currentSelector + ':hover > .' + metaClassPrefix + index);
		}

		// Handle hover opacity and blend mode
		const backgroundOpacityHover = getLayerDeviceValue('opacityHover', layer, this.props.previewDevice);
		const backgroundBlendModeHover = getLayerDeviceValue('blendModeHover', layer, this.props.previewDevice);
		
		if (backgroundOpacityHover || backgroundOpacityHover === 0) {
			this.add({ opacity: backgroundOpacityHover });
		}
		if (backgroundBlendModeHover && backgroundBlendModeHover !== 'normal') {
			this.add({ 'mix-blend-mode': backgroundBlendModeHover });
		}

		// Handle hover colors based on type
		const backgroundColorHover = getLayerDeviceValue('colorHover', layer, this.props.previewDevice);
		if (backgroundColorHover && (backgroundType === 'color' || backgroundType === 'image' || 
			backgroundType === 'video' || backgroundType === 'gradient')) {
			this.add({ 'background-color': getColorOutput(backgroundColorHover) });
		}

		// Handle backdrop hover
		if (backgroundType === 'backdrop') {
			this.processBackdropHover(layer);
		}

		// Handle pattern hover
		if (backgroundType === 'pattern') {
			this.processPatternHover(layer, backgroundColorHover);
		}
	}

	/**
	 * Process backdrop hover state
	 */
	processBackdropHover(layer) {
		const backdropFilter = getLayerDeviceValue('backdropFilter', layer, this.props.previewDevice);
		const backdropFilterHover = getLayerDeviceValue('backdropFilterHover', layer, this.props.previewDevice) || backdropFilter;
		
		if (backdropFilterHover) {
			if (backdropFilterHover === 'none') {
				this.add({ 'backdrop-filter': 'none' });
			} else {
				const hoverUnit = backdropFilterHover === 'blur' ? 'px' : backdropFilterHover === 'hue-rotate' ? 'deg' : '%';
				let backdropSize = getLayerDeviceValue('backdropSize', layer, this.props.previewDevice) || '1';
				let backdropSizeHover = getLayerDeviceValue('backdropSizeHover', layer, this.props.previewDevice);
				if (!backdropSizeHover && backdropSizeHover !== 0) {
					backdropSizeHover = backdropSize;
				}
				if (backdropFilterHover === 'hue-rotate') {
					backdropSizeHover = backdropSizeHover * 3.6;
				}
				this.add({ 'backdrop-filter': backdropFilterHover + '(' + backdropSizeHover + hoverUnit + ')' });
			}
		}
	}

	/**
	 * Process pattern hover state
	 */
	processPatternHover(layer, backgroundColorHover) {
		if (backgroundColorHover) {
			this.add({ 
				'background-color': getColorOutput(backgroundColorHover),
				'--kbs-pattern-bg': getColorOutput(backgroundColorHover),
			});
		}
		
		const hoverPatternSize = getLayerDeviceValue('patternSizeHover', layer, this.props.previewDevice);
		if (hoverPatternSize) {
			this.add({ '--kbs-pattern-size': hoverPatternSize });
		}
		
		const maskColorHover = getLayerDeviceValue('maskColorHover', layer, this.props.previewDevice);
		if (maskColorHover) {
			this.add({ '--kbs-pattern-color': getColorOutput(maskColorHover) });
		}
	}

	/**
	 * Process simple background value
	 */
	processBackgroundValue(key, value) {
		switch (key) {
			case 'color':
				return getColorOutput(value);
			case 'image':
				return 'url(' + value + ')';
			default:
				return value;
		}
	}

}