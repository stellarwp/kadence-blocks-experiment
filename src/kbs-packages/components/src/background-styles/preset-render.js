/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { createRef, useEffect, useMemo } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
import { getInheritedValue, getPresetValue, getInheritedDeviceValue, cssGenerator } from '@kadence/kbsHelpers';
import './editor.scss';

function BackgroundPresetCSSStyles(props) {
	const { attributes, previewDevice, preset, uniqueID, meta, attributeMeta } = props;
	const cssOutput = useMemo(() => {
		const selector = `.preset-${uniqueID}-${preset.value}`;
		const css = new cssGenerator(selector);
		const reverseLayers = Array.isArray(attributes?.layers) ? [...attributes.layers].reverse() : [];
		if (reverseLayers.length > 0) {
			reverseLayers.forEach((layer, index) =>
				css.processBackgroundLayer(layer, index, attributeMeta, props, meta)
			);
		}

		let output = css.generate();
		return output;
	}, [attributes, previewDevice, preset, uniqueID]);

	return (
		<>
			<style>{cssOutput}</style>
		</>
	);
}
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

function BackgroundPresetRender(props) {
	const { previewDevice, meta, globalStylesIds, preset, attributeName, uniqueID } = props;
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		'background',
		'presets.' + preset.value
	);
	const metaClassPrefix = meta?.attributes?.[attributeName]?.classPrefix || 'kbs-bg-style-';
	const layersCount = useMemo(
		() => (Array.isArray(rawPresetData?.attributes?.layers) ? rawPresetData?.attributes?.layers.length : 0),
		[rawPresetData?.attributes?.layers]
	);
	const reverseLayers = useMemo(
		() =>
			Array.isArray(rawPresetData?.attributes?.layers) ? [...rawPresetData?.attributes?.layers].reverse() : [],
		[rawPresetData?.attributes?.layers]
	);
	// Return a div for each layer
	return (
		<div className={`kbs-bg-preset-render ${props.className} preset-${uniqueID}-${preset.value}`}>
			<BackgroundPresetCSSStyles
				preset={preset}
				attributes={rawPresetData?.attributes}
				uniqueID={uniqueID}
				attributeMeta={meta?.attributes?.[attributeName]}
				meta={meta}
				previewDevice={previewDevice}
			/>
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
					</div>
				);
			})}
		</div>
	);
}

export default BackgroundPresetRender;
