import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { SPACING_SIZES_MAP, ICON_SIZES_MAP, CONTENT_WIDTH_SIZES_MAP } from '../constants';
import { BORDER_RADIUS_SIZES_MAP, BORDER_STYLES_DEFAULTS } from '../constants/borders';
import { SHADOW_STYLES_DEFAULTS, TEXT_SHADOW_STYLES_DEFAULTS } from '../constants/shadows';
import { merge, kebabCase } from 'lodash';
import { default as getResolvedValue } from '../get-resolved-value';
import { default as getInheritedValue } from '../get-inherited-value';
import getColorOutput from '../get-color-output';
import { default as getLayerDeviceValue } from '../get-layer-device-value';
import { default as getPatternOptions } from '../get-pattern-options';
import { default as getMaskOptions } from '../get-mask-options';
import { default as getDividerOptions } from '../get-divider-options';
import { default as getInheritedDeviceValue } from '../get-inherited-device-value';
import { useMemo } from 'react';
import parseBorderStyle from '../parse-border-style';
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
		const mergedAttribute = this.mergeInitialAttribute(meta, attributes?.[key] || {});

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

	processComponentKey(attributeName, meta, props, metadata, key) {
		//get the components for the line to add
		const cssValue = this.getCssValue(attributeName, meta, props, metadata, key);
		const cssSelector = this.getCssSelector(attributeName, meta, key);
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

		let keyForValue = key;

		const isBorderRadius = key.includes('border') && key.includes('Radius');
		const isBorderStyle = key.includes('border') && !key.includes('Radius');
		const isTextOrientation = key === 'textOrientation' || key === 'writingMode';

		if (isBorderRadius) {
			keyForValue = 'borderRadius';
		} else if (isTextOrientation) {
			keyForValue = 'textOrientation';
		}

		const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue } = getResolvedValue(
			attributeName,
			attributes,
			previewDevice,
			metadata,
			keyForValue,
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
					const variableName = this.getGlobalStyleVariableName(
						inheritedSource, // inheritedSource
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
			case 'textOrientation':
				if (key === 'textOrientation') {
					if (appliedValue === 'stacked') {
						cssValue = 'upright';
					} else {
						cssValue = '';
					}
				} else if (key === 'writingMode') {
					cssValue =
						appliedValue === 'stacked' || appliedValue === 'sideways-down'
							? 'vertical-lr'
							: appliedValue === 'sideways-up'
								? 'sideways-lr'
								: '';
				}
				break;
			case 'icon':
				if (key === 'color' || key === 'colorHover') {
					cssValue = getColorOutput(appliedValue);
				} else if (key === 'iconSize' || key === 'iconSizeHover') {
					cssValue = this.getIconSizeOutput(appliedValue);
				} else if (key.includes('padding') || key.includes('margin')) {
					cssValue = this.getSpacingOutput(appliedValue);
				} else {
					cssValue = appliedValue;
				}
				break;
			case 'maxWidth':
			case 'maxHeight':
			case 'minHeight':
			case 'minWidth':
				cssValue = this.getContentWidthOutput(appliedValue);
				break;
			case 'padding':
			case 'margin':
				cssValue = this.getSpacingOutput(appliedValue);
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
			case 'color':
				cssValue = getColorOutput(appliedValue);
				break;
			case 'border':
				//Border values are an array of 4 values for the top, left, right, and bottom sides. (corners for radius)
				if (isBorderRadius) {
					if (Array.isArray(appliedValue)) {
						switch (key) {
							case 'borderTopLeftRadius':
								cssValue = this.getBorderRadiusOutput(appliedValue[0]);
								break;
							case 'borderTopRightRadius':
								cssValue = this.getBorderRadiusOutput(appliedValue[1]);
								break;
							case 'borderBottomLeftRadius':
								cssValue = this.getBorderRadiusOutput(appliedValue[2]);
								break;
							case 'borderBottomRightRadius':
								cssValue = this.getBorderRadiusOutput(appliedValue[3]);
								break;
						}
					} else {
						cssValue = this.getBorderRadiusOutput(appliedValue);
					}
				}
				if (isBorderStyle) {
					const { color, style, width } = parseBorderStyle(appliedValue);
					if (width === '' || width === BORDER_STYLES_DEFAULTS.width.var) {
						cssValue = '';
					} else {
						cssValue = appliedValue;
					}
				}
				break;
			case 'transition':
				// Special handling for transitionProperty
				if (key === 'transitionProperty') {
					cssValue = 'all';
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
		const selectorPrefix = attributesMeta?.varPrefix || '';
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
			case 'transition':
				switch (attributeName) {
					case 'transition-property':
						return 'transition-property';
					case 'transition-duration':
						return 'transition-duration';
					case 'transition-ease':
						return 'transition-timing-function';
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
	getCssSelector(attributeName = '', meta = {}, key = '') {
		let selector = this.currentSelector;
		if (meta && meta?.nonInheritable) {
			if (meta?.selectorSuffix) {
				const processedSelectorSuffix = meta.selectorSuffix.replaceAll('%selector%', this.currentSelector);
				selector = this.currentSelector + processedSelectorSuffix;
			}
			if (key && key.endsWith('Hover')) {
				selector = selector + ':hover';
			} else if (key && key.endsWith('Active')) {
				selector = selector + ':active, ' + selector + ':focus';
			}
		}
		return selector;
	}

	/**
	 * Process box shadow layers data and outputs them all as a single property
	 * @param {string} attributeName - The name of the attribute
	 * @param {Object} layer - The layer object
	 * @param {number} index - The index of the layer
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @param {Object} metadata - The metadata of the block
	 */
	processLayeredShadowLayers(layers, meta, props, metadata, key, attributeName) {
		let cssValue = '';

		const reverseLayers = Array.isArray(layers?.inheritedValue) ? [...layers.inheritedValue].reverse() : [];
		if (reverseLayers.length > 0) {
			reverseLayers.forEach((layer, index) => {
				let shadowColor = getLayerDeviceValue('color', layer, props.previewDevice);
				let shadowX = getLayerDeviceValue('x', layer, props.previewDevice);
				let shadowY = getLayerDeviceValue('y', layer, props.previewDevice);
				let shadowBlur = getLayerDeviceValue('blur', layer, props.previewDevice);
				let shadowSpread = getLayerDeviceValue('spread', layer, props.previewDevice);
				const shadowInset = getLayerDeviceValue('inset', layer, props.previewDevice);

				const shadowDefaults =
					meta.component === 'boxShadow' ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

				shadowColor = shadowColor ? getColorOutput(shadowColor) : shadowDefaults.color.var;
				shadowX = shadowX || shadowX === 0 ? shadowX : shadowDefaults.x.var;
				shadowY = shadowY || shadowY === 0 ? shadowY : shadowDefaults.y.var;
				shadowBlur = shadowBlur || shadowBlur === 0 ? shadowBlur : shadowDefaults.blur.var;
				shadowSpread =
					meta.component === 'boxShadow'
						? shadowSpread || shadowSpread === 0
							? shadowSpread
							: shadowDefaults.spread.var
						: '';

				if (shadowColor) {
					const commaBefore = index > 0 ? ', ' : '';
					cssValue += `${commaBefore}${shadowInset ? 'inset ' : ''}${shadowColor} ${shadowX} ${shadowY} ${shadowBlur} ${shadowSpread}`;
				}
			});
		}

		const cssSelector = this.getCssSelector(attributeName, meta, key);
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
	 * Process the layer
	 * @param {string} attributeName - The name of the attribute
	 * @param {Object} layer - The layer object
	 * @param {number} index - The index of the layer
	 * @param {Object} meta - The metadata of the attribute
	 * @param {Object} props - The props of the block
	 * @param {Object} metadata - The metadata of the block
	 */
	processBackgroundLayer(layer, index, meta, props, metadata, attributeName) {
		const currentSelector = this.getCssSelector();
		const backgroundType = getLayerDeviceValue('type', layer, props.previewDevice) || 'color';
		const metaClassPrefix = meta?.classPrefix || 'kbs-bg-style-';
		const anyBackgroundOpacity = getLayerDeviceValue('opacity', layer, 'Mobile');
		let tempSelector = currentSelector;
		if (index === 0 && backgroundType !== 'video' && backgroundType !== 'pattern' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector);
		} else {
			tempSelector = currentSelector + ' > .' + metaClassPrefix + index;
			this.setSelector(currentSelector + ' > .' + metaClassPrefix + index);
		}
		const backgroundColor = getLayerDeviceValue('color', layer, props.previewDevice);
		const backgroundColorHover = getLayerDeviceValue('colorHover', layer, props.previewDevice);
		const backgroundOpacity = getLayerDeviceValue('opacity', layer, props.previewDevice);
		const backgroundOpacityHover = getLayerDeviceValue('opacityHover', layer, props.previewDevice);
		const backgroundBlendMode = getLayerDeviceValue('blendMode', layer, props.previewDevice);
		const backgroundBlendModeHover = getLayerDeviceValue('blendModeHover', layer, props.previewDevice);
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
			case 'mask':
				const maskType = getLayerDeviceValue('maskType', layer, props.previewDevice);
				const maskColor = getLayerDeviceValue('maskColor', layer, props.previewDevice);
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
				if (maskType !== 'pattern' && maskType !== 'divider') {
					const backgroundMask = getLayerDeviceValue('mask', layer, props.previewDevice);
					const backgroundMaskSize = getLayerDeviceValue('maskSize', layer, props.previewDevice);
					const maskAlignX = getLayerDeviceValue('alignX', layer, props.previewDevice);
					const maskAlignY = getLayerDeviceValue('alignY', layer, props.previewDevice);
					const maskInverted = getLayerDeviceValue('maskInverted', layer, props.previewDevice);
					const maskSubset = maskInverted === 'enabled' ? 'inverted' : 'normal';
					const mask = getMaskOptions()[maskSubset].find((mask) => mask.value === backgroundMask);
					if (mask?.path) {
						this.setSelector(tempSelector + ' .kbs-pattern-mask-svg');
						if (maskColor) {
							this.add({ background: getColorOutput(maskColor) });
						} else {
							this.add({ background: getColorOutput('palette3') });
						}
						const ratio = backgroundMaskSize === 'stretch' ? 'none' : 'xMidYMid meet';
						this.add({
							'mask-image': `url("data:image/svg+xml, ${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="' + ratio + '" viewBox="0 0 1920 1200" fill="black"><path d="' + mask.path + '" /></svg>')}")`,
						});
						this.add({ 'mask-repeat': 'no-repeat' });
						if (backgroundMaskSize == 'contain') {
							this.add({ 'mask-size': 'contain' });
						} else {
							this.add({ 'mask-size': 'cover' });
						}
						let positionY = 'center';
						let positionX = 'center';
						if ('min' === maskAlignX) {
							positionX = 'left';
						} else if ('max' === maskAlignX) {
							positionX = 'right';
						}
						if ('min' === maskAlignY) {
							positionY = 'top';
						} else if ('max' === maskAlignY) {
							positionY = 'bottom';
						}
						this.add({ 'mask-position': positionX + ' ' + positionY });
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
							this.add({
								transform: `scaleX(${hasXFlip ? '-1' : '1'}) scaleY(${hasYFlip ? '-1' : '1'})`,
							});
						}
						this.setSelector(tempSelector);
					}
				}
				if (maskType === 'divider') {
					const backgroundDivider = getLayerDeviceValue('divider', layer, props.previewDevice);
					const dividerWidth = getLayerDeviceValue('dividerWidth', layer, props.previewDevice);
					const dividerHeight = getLayerDeviceValue('dividerHeight', layer, props.previewDevice);
					const dividerPosition = getLayerDeviceValue('dividerPosition', layer, props.previewDevice);
					const dividerSide =
						dividerPosition === 'left' || dividerPosition === 'right' ? 'vertical' : 'horizontal';
					if (dividerWidth) {
						this.add({ '--kbs-divider-width': dividerWidth });
					}
					if (dividerHeight) {
						this.add({ '--kbs-divider-height': dividerHeight });
					}
					if (backgroundDivider) {
						const dividerObject =
							getDividerOptions()[dividerSide].find(({ value }) => value === backgroundDivider) || {};
						if (dividerObject) {
							if (dividerObject?.['svg']) {
								this.setSelector(tempSelector + ' .kbs-divider-svg-wrapper .kbs-divider-svg');
								if (maskColor) {
									this.add({ background: getColorOutput(maskColor) });
								} else {
									this.add({ background: getColorOutput('palette3') });
								}
								this.add({
									'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(dividerObject['svg'])}")`,
								});
								this.add({ 'mask-repeat': 'no-repeat' });
								this.setSelector(tempSelector);
							}
						}
					}
				}
				if (maskType === 'pattern') {
					const backgroundPattern = getLayerDeviceValue('pattern', layer, props.previewDevice);
					if (backgroundPattern) {
						const patternSize = getLayerDeviceValue('patternSize', layer, props.previewDevice);
						const patternPosition =
							getLayerDeviceValue('patternPosition', layer, props.previewDevice) || 'top left';
						if (patternSize) {
							this.add({ '--kbs-pattern-size': patternSize });
						} else {
							this.add({ '--kbs-pattern-size': '20' });
						}
						const pattern = getPatternOptions().find((pattern) => pattern.value === backgroundPattern);
						if (pattern) {
							if (pattern?.['svg']) {
								this.setSelector(tempSelector + ' .kbs-pattern-svg');
								if (maskColor) {
									this.add({ background: getColorOutput(maskColor) });
								} else {
									this.add({ background: getColorOutput('palette3') });
								}
								this.add({
									'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(pattern['svg'])}")`,
								});
								this.add({ 'mask-repeat': 'repeat' });
								const currentPatternSize = pattern?.['size'];
								this.add({
									'mask-size':
										'calc( (1px * ' + currentPatternSize + ') * (var(--kbs-pattern-size) / 20))',
								});
								this.add({ 'mask-position': patternPosition });
								this.setSelector(tempSelector);
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
		if (index === 0 && backgroundType !== 'video' && backgroundType !== 'mask' && '' === anyBackgroundOpacity) {
			this.setSelector(currentSelector + ':hover');
		} else {
			this.setSelector(currentSelector + ':hover > .' + metaClassPrefix + index);
		}
		if (backgroundOpacityHover || backgroundOpacityHover === 0) {
			this.add({ opacity: backgroundOpacityHover });
		}
		if (backgroundBlendModeHover && backgroundBlendModeHover !== 'normal') {
			this.add({ 'mix-blend-mode': backgroundBlendModeHover });
		}
		switch (backgroundType) {
			case 'color':
				if (backgroundColorHover) {
					this.add({ 'background-color': getColorOutput(backgroundColorHover) });
				}
				break;
			case 'image':
			case 'video':
			case 'gradient':
				if (backgroundColorHover) {
					this.add({ 'background-color': getColorOutput(backgroundColorHover) });
				}
				break;
			case 'backdrop':
				const backdropFilter = getLayerDeviceValue('backdropFilter', layer, props.previewDevice);
				const backdropFilterHover =
					getLayerDeviceValue('backdropFilterHover', layer, props.previewDevice) || backdropFilter;
				if (backdropFilterHover) {
					if (backdropFilterHover === 'none') {
						this.add({ 'backdrop-filter': 'none' });
					} else {
						const hoverUnit =
							backdropFilterHover === 'blur' ? 'px' : backdropFilterHover === 'hue-rotate' ? 'deg' : '%';
						let backdropSize = getLayerDeviceValue('backdropSize', layer, props.previewDevice) || '1';
						let backdropSizeHover = getLayerDeviceValue('backdropSizeHover', layer, props.previewDevice);
						if (!backdropSizeHover && backdropSizeHover !== 0) {
							backdropSizeHover = backdropSize;
						}
						if (backdropFilterHover === 'hue-rotate') {
							backdropSizeHover = backdropSizeHover * 3.6;
						}
						this.add({
							'backdrop-filter': backdropFilterHover + '(' + backdropSizeHover + hoverUnit + ')',
						});
					}
				}
				break;
			case 'pattern':
				if (backgroundColorHover) {
					this.add({ 'background-color': getColorOutput(backgroundColorHover) });
					this.add({ '--kbs-pattern-bg': getColorOutput(backgroundColorHover) });
				}
				const hoverPatternSize = getLayerDeviceValue('patternSizeHover', layer, props.previewDevice);
				if (hoverPatternSize) {
					this.add({ '--kbs-pattern-size': hoverPatternSize });
				}
				const maskColorHover = getLayerDeviceValue('maskColorHover', layer, props.previewDevice);
				if (maskColorHover) {
					this.add({ '--kbs-pattern-color': getColorOutput(maskColorHover) });
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
			if (meta?.component === 'boxShadow' || meta?.component === 'textShadow') {
				this.processLayeredShadowLayers(layers, meta, props, metadata, meta.component, attributeName);
			}
			return this;
		}

		if (meta.component === 'transform') {
			const { attributes, previewDevice, globalStylesIds } = props;
			
			// Check if this is a hover transform
			const isHover = attributeName.endsWith('Hover');
			
			// Store the current selector
			const originalSelector = this.currentSelector;
			
			// If hover, modify the selector
			if (isHover) {
				this.setSelector(originalSelector + ':hover');
			}

			let scale, translate, rotate, skew, origin;

			if (isHover) {
				// For hover, we need to merge with base values
				const baseAttributeName = attributeName.replace('Hover', '');
				
				// Get base transform values
				const baseScale = getResolvedValue(
					baseAttributeName,
					attributes,
					previewDevice,
					metadata,
					'scale',
					globalStylesIds
				)?.appliedValue;

				const baseTranslate = getResolvedValue(
					baseAttributeName,
					attributes,
					previewDevice,
					metadata,
					'translate',
					globalStylesIds
				)?.appliedValue;

				const baseRotate = getResolvedValue(
					baseAttributeName,
					attributes,
					previewDevice,
					metadata,
					'rotate',
					globalStylesIds
				)?.appliedValue;

				const baseSkew = getResolvedValue(
					baseAttributeName,
					attributes,
					previewDevice,
					metadata,
					'skew',
					globalStylesIds
				)?.appliedValue;

				const baseOrigin = getResolvedValue(
					baseAttributeName,
					attributes,
					previewDevice,
					metadata,
					'origin',
					globalStylesIds
				)?.appliedValue;

				// Get hover transform values
				const hoverScale = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'scale',
					globalStylesIds
				)?.appliedValue;

				const hoverTranslate = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'translate',
					globalStylesIds
				)?.appliedValue;

				const hoverRotate = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'rotate',
					globalStylesIds
				)?.appliedValue;

				const hoverSkew = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'skew',
					globalStylesIds
				)?.appliedValue;

				const hoverOrigin = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'origin',
					globalStylesIds
				)?.appliedValue;

				// Merge values - hover takes precedence if defined
				scale = hoverScale || baseScale;
				translate = hoverTranslate || baseTranslate;
				rotate = hoverRotate || baseRotate;
				skew = hoverSkew || baseSkew;
				origin = hoverOrigin || baseOrigin;
			} else {
				// For non-hover, just get the values directly
				scale = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'scale',
					globalStylesIds
				)?.appliedValue;

				translate = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'translate',
					globalStylesIds
				)?.appliedValue;

				rotate = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'rotate',
					globalStylesIds
				)?.appliedValue;

				skew = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'skew',
					globalStylesIds
				)?.appliedValue;

				origin = getResolvedValue(
					attributeName,
					attributes,
					previewDevice,
					metadata,
					'origin',
					globalStylesIds
				)?.appliedValue;
			}

			let transformStrings = [];
			if (translate) {
				const x = translate.x || '0px';
				const y = translate.y || '0px';
				if (x !== '0px' || y !== '0px') {
					transformStrings.push(`translate(${x}, ${y})`);
				}
			}
			if (rotate) {
				if (rotate.x && rotate.x !== '0deg') {
					transformStrings.push(`rotateX(${rotate.x})`);
				}
				if (rotate.y && rotate.y !== '0deg') {
					transformStrings.push(`rotateY(${rotate.y})`);
				}
				if (rotate.z && rotate.z !== '0deg') {
					transformStrings.push(`rotateZ(${rotate.z})`);
				}
			}
			if (scale) {
				const x = parseFloat(scale.x || '100%') / 100;
				const y = parseFloat(scale.y || '100%') / 100;

				if (x !== 1 || y !== 1) {
					transformStrings.push(`scale(${x}, ${y})`);
				}
			}
			if (skew) {
				const x = skew.x || '0deg';
				const y = skew.y || '0deg';
				if (x !== '0deg' || y !== '0deg') {
					transformStrings.push(`skew(${x}, ${y})`);
				}
			}

			if (transformStrings.length > 0) {
				this.add({ transform: transformStrings.join(' ') });
			}

			if (origin) {
				const x = origin.x || '50%';
				const y = origin.y || '50%';
				if (x !== '50%' || y !== '50%') {
					this.add({ 'transform-origin': `${x} ${y}` });
				}
			}
			
			// Restore the original selector
			if (isHover) {
				this.setSelector(originalSelector);
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
			case 'color':
				componentKeys = ['color', 'colorHover'];
				break;
			case 'border':
				componentKeys = [
					'borderTopLeftRadius',
					'borderTopRightRadius',
					'borderBottomRightRadius',
					'borderBottomLeftRadius',
					'borderTop',
					'borderLeft',
					'borderRight',
					'borderBottom',
					'borderTopHover',
					'borderLeftHover',
					'borderRightHover',
					'borderBottomHover',
				];
				break;
			case 'background':
				componentKeys = ['color', 'gradient', 'image', 'size', 'position', 'repeat', 'attachment'];
				break;
			case 'boxShadow':
				componentKeys = ['boxShadow'];
				break;
			case 'textShadow':
				componentKeys = ['textShadow'];
				break;
			case 'textAlign':
				componentKeys = ['textAlign'];
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
			case 'padding':
				componentKeys = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
				break;
			case 'margin':
				componentKeys = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
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
			case 'icon':
				componentKeys = [
					'iconSize',
					'iconLineWidth',
					'color',
					'iconSizeHover',
					'iconLineWidthHover',
					'colorHover',
					'paddingTop',
					'paddingRight',
					'paddingBottom',
					'paddingLeft',
					'paddingHoverTop',
					'paddingHoverRight',
					'paddingHoverBottom',
					'paddingHoverLeft',
					'alignItems',
				];
				break;
			case 'linkStyle':
				componentKeys = ['textDecoration'];
				break;
			case 'textOrientation':
				componentKeys = ['textOrientation', 'writingMode'];
				break;
			case 'maxWidth':
			case 'maxHeight':
			case 'minHeight':
			case 'minWidth':
				componentKeys = [component];
				break;
			case 'transition':
				componentKeys = ['transitionProperty', 'transitionDuration', 'transitionEase'];
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
		if( this.metadata?.name ) { // Are we building a block
			this.build();
		}

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
	 * Get the font sizing option output
	 * @param {string} value - The value of the attribute
	 * @returns {string} - The font sizing option output
	 */
	getContentWidthOutput(value) {
		if (undefined === value) {
			return '';
		}
		if (!CONTENT_WIDTH_SIZES_MAP) {
			return value;
		}
		if (value === '0') {
			return '0';
		}
		if (value === 0) {
			return '0';
		}
		const found = CONTENT_WIDTH_SIZES_MAP.find((option) => option.value === value);
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
	getBorderRadiusOutput(value) {
		if (undefined === value) {
			return '';
		}
		if (!BORDER_RADIUS_SIZES_MAP) {
			return value;
		}
		if (value === '0') {
			return '0';
		}
		if (value === 0) {
			return '0';
		}
		const found = BORDER_RADIUS_SIZES_MAP.find((option) => option.value === value);
		if (!found) {
			return value;
		}
		return found.output;
	}

	/**
	 * Get the icon size option output
	 * @param {string} value - The value of the attribute
	 * @returns {string} - The icon size option output
	 */
	getIconSizeOutput(value) {
		if (undefined === value) {
			return '';
		}
		if (!ICON_SIZES_MAP) {
			return value;
		}
		const found = ICON_SIZES_MAP.find((option) => option.value === value);
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
