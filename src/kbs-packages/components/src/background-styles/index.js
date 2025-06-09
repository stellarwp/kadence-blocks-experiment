/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createRef, useEffect, useMemo } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
import { getInheritedValue, getColorOutput, getDividerOptions, getMaskOptions } from '@kadence/kbsHelpers';
import './editor.scss';

const getLayerInheritedDeviceValue = (layerAttribute, layer, device) => {
	if (layer?.[device?.toLowerCase()]?.[layerAttribute]) {
		return layer?.[device?.toLowerCase()]?.[layerAttribute];
	}
	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	const currentDeviceIndex = deviceOptions.findIndex(
		(option) =>
			option.key?.toLowerCase() === device?.toLowerCase() || option.name?.toLowerCase() === device?.toLowerCase()
	);

	if (device !== 'none') {
		// Check direct value from parent device
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key || parentDevice.name;
			if (layer?.[parentDeviceName]?.[layerAttribute]) {
				return layer?.[parentDeviceName]?.[layerAttribute];
			}
		}
	}
	// Check for inherited from parent device
	return '';
};

export function PopoverPatternRender({ pattern, className, patternSize, patternColor, patternBackground }) {
	const style = {};
	if (pattern?.background) {
		style.background = pattern.background;
	}
	if (pattern?.['background-image']) {
		style.backgroundImage = pattern['background-image'];
	}
	if (pattern?.['background-size']) {
		style.backgroundSize = pattern['background-size'];
	}
	if (pattern?.['background-position']) {
		style.backgroundPosition = pattern['background-position'];
	}
	if (patternSize) {
		style['--kbs-pattern-size'] = patternSize;
	}
	if (patternColor) {
		style['--kbs-pattern-color'] = getColorOutput(patternColor);
	}
	if (patternBackground) {
		style['--kbs-pattern-bg'] = getColorOutput(patternBackground);
	}
	return <div className={clsx('kbs-popover-background-select-control-style', className)} style={style} />;
}

export function PopoverDividerRender({
	dividerSlug,
	className,
	dividerColor,
	dividerBackground,
	dividerWidth,
	dividerHeight,
	dividerPosition,
}) {
	const dividerSide = dividerPosition === 'left' || dividerPosition === 'right' ? 'vertical' : 'horizontal';
	const dividerObject = getDividerOptions()[dividerSide].find(({ value }) => value === dividerSlug) || {};
	const style = {};
	if (dividerColor) {
		style['color'] = getColorOutput(dividerColor);
	}
	if (dividerWidth) {
		style['--kbs-divider-width'] = dividerWidth;
	}
	if (dividerHeight) {
		style['--kbs-divider-height'] = dividerHeight;
	}
	return (
		<div
			className={clsx('kbs-divider-svg-wrapper', className, `kbs-divider-position-${dividerPosition}`)}
			style={style}
		>
			{dividerObject?.svg}
		</div>
	);
}

export function PopoverMaskRender({ maskSlug, className, maskColor, maskBackground }) {
	const maskObject = getMaskOptions().find(({ value }) => value === maskSlug) || {};
	const style = {};
	if (maskColor) {
		style['color'] = getColorOutput(maskColor);
	}
	if (maskObject?.svg) {
		// Ensure the SVG is properly formatted as an XML document
		const encodedSvg = encodeURIComponent(maskObject.svg);
		style['backgroundImage'] = `url('data:image/svg+xml;utf8,${encodedSvg}')`;
	}
	return <div className={clsx('kbs-mask-svg-wrap', className)} style={style} />;
}
function RenderPattern(props) {
	const { layer, previewDevice } = props;
	const patternType = getLayerInheritedDeviceValue('patternType', layer, previewDevice) || 'mask';
	const pattern = getLayerInheritedDeviceValue('pattern', layer, previewDevice) || 'none';
	const divider = getLayerInheritedDeviceValue('divider', layer, previewDevice) || 'none';
	const dividerWidth = getLayerInheritedDeviceValue('dividerWidth', layer, previewDevice) || '';
	const dividerHeight = getLayerInheritedDeviceValue('dividerHeight', layer, previewDevice) || '';
	const dividerPosition = getLayerInheritedDeviceValue('dividerPosition', layer, previewDevice) || 'bottom';
	const mask = getLayerInheritedDeviceValue('mask', layer, previewDevice) || 'none';
	const patternColor = getLayerInheritedDeviceValue('patternColor', layer, previewDevice) || 'none';
	if (patternType === 'divider') {
		return (
			<PopoverDividerRender
				dividerSlug={divider}
				dividerPosition={dividerPosition}
				dividerWidth={dividerWidth}
				dividerHeight={dividerHeight}
				dividerColor={patternColor}
			/>
		);
	}
	if (patternType === 'mask') {
		return <PopoverMaskRender maskSlug={mask} maskColor={patternColor} />;
	}
	return '';
}

function BackgroundStyles(props) {
	const { previewDevice, backgroundAttribute, attributes, meta, globalStylesIds } = props;
	const background = getInheritedValue(backgroundAttribute, attributes, 'none', meta, 'layers', globalStylesIds);
	const metaClassPrefix = meta?.attributes?.[backgroundAttribute]?.classPrefix || 'kbs-bg-style-';
	//
	const layersCount = useMemo(
		() => (Array.isArray(background?.inheritedValue) ? background.inheritedValue.length : 0),
		[background?.inheritedValue]
	);
	const reverseLayers = useMemo(
		() => (Array.isArray(background?.inheritedValue) ? [...background.inheritedValue].reverse() : []),
		[background?.inheritedValue]
	);
	// Return a div for each layer
	return (
		<>
			{Array.from({ length: layersCount }).map((_, index) => {
				const layer = reverseLayers[index];
				const video = getLayerInheritedDeviceValue('video', layer, previewDevice);
				const videoType = getLayerInheritedDeviceValue('videoType', layer, previewDevice) || 'local';
				const youtube = getLayerInheritedDeviceValue('youtube', layer, previewDevice);
				const vimeo = getLayerInheritedDeviceValue('vimeo', layer, previewDevice);
				const videoPoster = getLayerInheritedDeviceValue('image', layer, previewDevice);
				const type = getLayerInheritedDeviceValue('type', layer, previewDevice) || 'color';

				const anyBackgroundOpacity = getLayerInheritedDeviceValue('opacity', layer, 'Mobile');
				if (index === 0 && type !== 'video' && '' === anyBackgroundOpacity) {
					return null;
				}
				return (
					<div key={index} className={`kbs-bg-layer ${metaClassPrefix}${index} bg-type-${type}`}>
						{type === 'video' && (
							<>
								{videoType === 'local' && (
									<video
										src={video}
										className="kbs-bg-video"
										autoPlay
										muted
										loop
										playsInline
										poster={videoPoster}
									/>
								)}
								{videoType === 'youtube' && (
									<img
										src={`https://img.youtube.com/vi/${youtube}/maxresdefault.jpg`}
										className="kbs-bg-video"
									/>
								)}
								{videoType === 'vimeo' && (
									<img src={`https://vumbnail.com/${vimeo}.jpg`} className="kbs-bg-video" />
								)}
							</>
						)}
						{type === 'pattern' && <RenderPattern previewDevice={previewDevice} layer={layer} />}
					</div>
				);
			})}
		</>
	);
}

export default BackgroundStyles;
