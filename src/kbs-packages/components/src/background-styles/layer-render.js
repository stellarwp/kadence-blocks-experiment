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

export function BackgroundPatternRender({ className }) {
	return <div className={clsx('kbs-pattern-mask-svg kbs-pattern-svg', className)} />;
}

export function BackgroundDividerRender({ className, dividerPosition }) {
	return (
		<div className={clsx('kbs-divider-svg-wrapper', className, `kbs-divider-position-${dividerPosition}`)}>
			<div className="kbs-divider-svg" />
		</div>
	);
}
export function BackgroundMaskRender({ className }) {
	return <div className={clsx('kbs-pattern-mask-svg kbs-mask-svg', className)} />;
}
function RenderMask(props) {
	const { layer, previewDevice } = props;
	const maskType = getLayerInheritedDeviceValue('maskType', layer, previewDevice) || 'mask';
	const divider = getLayerInheritedDeviceValue('divider', layer, previewDevice) || 'kbs-divider-ct';
	const dividerWidth = getLayerInheritedDeviceValue('dividerWidth', layer, previewDevice) || '';
	const dividerHeight = getLayerInheritedDeviceValue('dividerHeight', layer, previewDevice) || '';
	const dividerPosition = getLayerInheritedDeviceValue('dividerPosition', layer, previewDevice) || 'bottom';
	const maskColor = getLayerInheritedDeviceValue('maskColor', layer, previewDevice) || 'palette3';
	if (maskType === 'divider') {
		return (
			<BackgroundDividerRender
				dividerSlug={divider}
				dividerPosition={dividerPosition}
				dividerWidth={dividerWidth}
				dividerHeight={dividerHeight}
				dividerColor={maskColor}
			/>
		);
	}
	if (maskType === 'pattern') {
		return <BackgroundPatternRender />;
	}
	if (maskType !== 'pattern' && maskType !== 'divider') {
		return <BackgroundMaskRender />;
	}
	return '';
}

function BackgroundLayerRender({ index, layer, metaClassPrefix, previewDevice }) {
	const type = getLayerInheritedDeviceValue('type', layer, previewDevice) || 'color';
	const anyBackgroundOpacity = getLayerInheritedDeviceValue('opacity', layer, 'Mobile');

	if (index === 0 && type !== 'video' && type !== 'mask' && '' === anyBackgroundOpacity) {
		return null;
	}

	const video = getLayerInheritedDeviceValue('video', layer, previewDevice);
	const videoType = getLayerInheritedDeviceValue('videoType', layer, previewDevice) || 'local';
	const youtube = getLayerInheritedDeviceValue('youtube', layer, previewDevice);
	const vimeo = getLayerInheritedDeviceValue('vimeo', layer, previewDevice);
	const videoPoster = getLayerInheritedDeviceValue('image', layer, previewDevice);
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
			{type === 'mask' && <RenderMask previewDevice={previewDevice} layer={layer} />}
		</div>
	);
}

export default BackgroundLayerRender;
