/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SVG, Path } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

import { createRef, useEffect, useMemo } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
import { getInheritedValue, getColorOutput, getDividerOptions, getMaskOptions } from '@kadence/kbsHelpers';

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

export function PopoverPatternRender({ className }) {
	return <div className={clsx('kbs-pattern-mask-svg kbs-pattern-svg', className)} />;
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
// export function PopoverMaskRender({ className }) {
// 	return <div className={clsx('kbs-pattern-mask-svg kbs-mask-svg', className)} />;
// }
export function PopoverMaskRender({
	maskSlug,
	className,
	maskColor,
	maskBackground,
	maskSize,
	maskAlignX,
	maskAlignY,
	maskFlipX,
	maskFlipY,
}) {
	const maskObject = getMaskOptions().find(({ value }) => value === maskSlug) || {};
	const style = {};
	let alignX = 'Mid';
	let alignY = 'Mid';
	switch (maskAlignX) {
		case 'min':
			alignX = 'Min';
			break;
		case 'max':
			alignX = 'Max';
			break;
	}
	switch (maskAlignY) {
		case 'min':
			alignY = 'Min';
			break;
		case 'max':
			alignY = 'Max';
			break;
	}
	let ratio = `x${alignX}Y${alignY} slice`;
	switch (maskSize) {
		case 'contain':
			ratio = `x${alignX}Y${alignY} meet`;
			break;
		case 'cover':
			ratio = `x${alignX}Y${alignY} slice`;
			break;
		case 'stretch':
			ratio = 'none';
			break;
	}
	return (
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1920 1200"
			preserveAspectRatio={ratio}
			className={'kbs-mask-svg'}
		>
			<Path d={maskObject?.path} />
		</SVG>
	);
}
function RenderPattern(props) {
	const { layer, previewDevice } = props;
	const patternType = getLayerInheritedDeviceValue('patternType', layer, previewDevice) || 'mask';
	const divider = getLayerInheritedDeviceValue('divider', layer, previewDevice) || 'kbs-divider-ct';
	const dividerWidth = getLayerInheritedDeviceValue('dividerWidth', layer, previewDevice) || '';
	const dividerHeight = getLayerInheritedDeviceValue('dividerHeight', layer, previewDevice) || '';
	const dividerPosition = getLayerInheritedDeviceValue('dividerPosition', layer, previewDevice) || 'bottom';
	const maskSize = getLayerInheritedDeviceValue('maskSize', layer, previewDevice) || 'cover';
	const mask = getLayerInheritedDeviceValue('mask', layer, previewDevice) || 'kbs-mask-panels-1';
	const patternColor = getLayerInheritedDeviceValue('patternColor', layer, previewDevice) || 'palette3';
	const alignX = getLayerInheritedDeviceValue('alignX', layer, previewDevice) || 'mid';
	const alignY = getLayerInheritedDeviceValue('alignY', layer, previewDevice) || 'mid';
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
	if (patternType === 'pattern') {
		return <PopoverPatternRender />;
	}
	if (patternType !== 'pattern' && patternType !== 'divider') {
		return (
			<PopoverMaskRender
				maskSlug={mask}
				maskSize={maskSize}
				maskAlignX={alignX}
				maskAlignY={alignY}
				maskColor={patternColor}
			/>
		);
	}
	return '';
}

function BackgroundLayerRender({ index, layer, metaClassPrefix, previewDevice }) {
	const video = getLayerInheritedDeviceValue('video', layer, previewDevice);
	const videoType = getLayerInheritedDeviceValue('videoType', layer, previewDevice) || 'local';
	const youtube = getLayerInheritedDeviceValue('youtube', layer, previewDevice);
	const vimeo = getLayerInheritedDeviceValue('vimeo', layer, previewDevice);
	const videoPoster = getLayerInheritedDeviceValue('image', layer, previewDevice);
	const type = getLayerInheritedDeviceValue('type', layer, previewDevice) || 'color';

	const anyBackgroundOpacity = getLayerInheritedDeviceValue('opacity', layer, 'Mobile');
	if (index === 0 && type !== 'video' && type !== 'pattern' && '' === anyBackgroundOpacity) {
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
						<img src={`https://img.youtube.com/vi/${youtube}/maxresdefault.jpg`} className="kbs-bg-video" />
					)}
					{videoType === 'vimeo' && (
						<img src={`https://vumbnail.com/${vimeo}.jpg`} className="kbs-bg-video" />
					)}
				</>
			)}
			{type === 'pattern' && <RenderPattern previewDevice={previewDevice} layer={layer} />}
		</div>
	);
}

export default BackgroundLayerRender;
