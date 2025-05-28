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
import { getInheritedValue } from '@kadence/kbsHelpers';
import './editor.scss';

function BackgroundCSSStyles(props) {
	const { attributes, previewDevice } = props;
	const cssOutput = useMemo(() => {
		const selector = `.kbs-container-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector);

		if (metadata.attributes) {
			Object.entries(metadata.attributes).forEach(([attributeName, value]) => {
				if (value.renderCSS) {
					if (value?.component) {
						css.addComponent(attributeName, value, props, metadata);
					} else {
						css.addAttribute(attributeName, value, props);
					}
				}
			});
		}

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice, JSON.stringify(attributes)]);

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

function BackgroundStyles(props) {
	const {
		previewDevice,
		backgroundAttribute,
		attributes,
		meta,
		globalStyleIds,
		setAttributes,
		isSelected,
		clientId,
		context,
		className,
	} = props;
	const background = getInheritedValue(backgroundAttribute, attributes, 'none', meta, 'layers', globalStyleIds);
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
				const video = getLayerInheritedDeviceValue('backgroundVideo', layer, previewDevice);
				const type = getLayerInheritedDeviceValue('backgroundType', layer, previewDevice) || 'color';
				const anyBackgroundOpacity = getLayerInheritedDeviceValue('backgroundOpacity', layer, 'Mobile');
				if (index === 0 && type !== 'video' && '' === anyBackgroundOpacity) {
					return null;
				}
				return <div key={index} className={`kbs-bg-layer ${metaClassPrefix}${index} bg-type-${type}`}></div>;
			})}
		</>
	);
}

export default BackgroundStyles;
