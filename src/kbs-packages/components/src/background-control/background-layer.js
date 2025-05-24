/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	Icon,
	Dropdown,
	ColorIndicator as CoreColorIndicator,
	Button,
	HStack,
	FlexItem,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import {
	color as colorIcon,
	check as checkIcon,
	close as closeIcon,
	image as imageIcon,
	video as videoIcon,
	background as gradientIcon,
	grid as patternIcon,
} from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	getDeviceValue,
	getInheritedValue,
	handleLayerAttributeChange,
} from '@kadence/kbsHelpers';
import ColorSelector from '../color-control/color-selector';
import BackgroundImageControl from '../background-image-control';
import { getColorLabel } from '../color-control/utils';

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
function renderBackgroundToggle(layer, isInherited, colors, previewDevice) {
	return ({ onToggle, isOpen }) => {
		const { color, image, video, gradient, pattern, type } = useMemo(() => {
			return {
				color: getLayerInheritedDeviceValue('backgroundColor', layer, previewDevice),
				image: getLayerInheritedDeviceValue('backgroundImage', layer, previewDevice),
				video: getLayerInheritedDeviceValue('backgroundVideo', layer, previewDevice),
				gradient: getLayerInheritedDeviceValue('backgroundGradient', layer, previewDevice),
				pattern: getLayerInheritedDeviceValue('backgroundPattern', layer, previewDevice),
				type: getLayerInheritedDeviceValue('backgroundType', layer, previewDevice) || 'color',
			};
		}, [layer, previewDevice]);
		const displayValue = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorLabel(color, colors);
				case 'image':
					return image;
				case 'video':
					return video;
				case 'gradient':
					return gradient;
				case 'pattern':
					return pattern;
				default:
					return '';
			}
		}, [type, color, image, video, gradient, pattern]);
		const previewColorString = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorOutput(color);
				case 'image':
					return image;
				case 'video':
					return video;
				case 'gradient':
					return gradient;
				case 'pattern':
					return pattern;
				default:
					return '';
			}
		}, [type, color, image, video, gradient, pattern]);
		const typeIcon = useMemo(() => {
			switch (type) {
				case 'color':
					return colorIcon;
				case 'image':
					return imageIcon;
				case 'video':
					return videoIcon;
				case 'gradient':
					return gradientIcon;
				case 'pattern':
					return patternIcon;
				default:
					return colorIcon;
			}
		}, [type]);
		const toggleProps = {
			onClick: onToggle,
			className: clsx('kbs-background-select-button', 'kbs-background-select-control__toggle-button', {
				'is-open': isOpen,
				'is-inherited': isInherited,
				'is-selected': !isInherited && displayValue,
			}),
			'aria-expanded': isOpen,
		};
		return (
			<Button __next40pxDefaultSize {...toggleProps}>
				{displayValue && (
					<Icon className="kbs-background-select-control__toggle-icon" icon={typeIcon} size={24} />
				)}
				<span className="kbs-background-select-control__toggle-label">
					{displayValue ? displayValue : __('Unset', 'kadence-blocks')}
				</span>
				<CoreColorIndicator
					className="kbs-background-select-control__toggle-preview"
					colorValue={previewColorString}
				/>
			</Button>
		);
	};
}

function renderColorDropdown(colors, layer, isInherited, onChange, previewDevice) {
	return ({ onToggle, isOpen }) => {
		const handleColorChange = (color) => {
			onChange(color, previewDevice, 'backgroundColor');
		};
		const handleTypeChange = (type) => {
			onChange(type, previewDevice, 'backgroundType');
		};
		const handleCustomOnChange = (value, device, type) => {
			onChange(value, device, type);
		};
		// const { color, image, video, gradient, pattern, type } = useMemo(() => {
		// 	return {
		// 		color: getLayerInheritedDeviceValue('backgroundColor', layer, previewDevice),
		// 		image: getLayerInheritedDeviceValue('backgroundImage', layer, previewDevice),
		// 		video: getLayerInheritedDeviceValue('backgroundVideo', layer, previewDevice),
		// 		gradient: getLayerInheritedDeviceValue('backgroundGradient', layer, previewDevice),
		// 		pattern: getLayerInheritedDeviceValue('backgroundPattern', layer, previewDevice),
		// 		type: getLayerInheritedDeviceValue('backgroundType', layer, previewDevice) || 'color',
		// 	};
		// }, [previewDevice]);
		const color = getLayerInheritedDeviceValue('backgroundColor', layer, previewDevice);
		const image = getLayerInheritedDeviceValue('backgroundImage', layer, previewDevice);
		const video = getLayerInheritedDeviceValue('backgroundVideo', layer, previewDevice);
		const gradient = getLayerInheritedDeviceValue('backgroundGradient', layer, previewDevice);
		const pattern = getLayerInheritedDeviceValue('backgroundPattern', layer, previewDevice);
		const type = getLayerInheritedDeviceValue('backgroundType', layer, previewDevice) || 'color';
		const defaultTabs = [
			{
				name: 'color',
				icon: colorIcon,
				title: __('Color', 'kadence-blocks'),
			},
			{
				name: 'gradient',
				icon: gradientIcon,
				title: __('Gradient', 'kadence-blocks'),
			},
			{
				name: 'image',
				icon: imageIcon,
				title: __('Image', 'kadence-blocks'),
			},
			{
				name: 'video',
				icon: videoIcon,
				title: __('Video', 'kadence-blocks'),
			},
			{
				name: 'pattern',
				icon: patternIcon,
				title: __('Pattern', 'kadence-blocks'),
			},
		];
		return (
			<div className="kbs-background-layer-control__dropdown-content-inner kbs-color-control">
				<TabPanel
					className="kbs-color-select-tabs"
					activeClass="is-active"
					onSelect={(tabName) => {
						if (tabName !== type) {
							handleCustomOnChange(tabName, previewDevice, 'backgroundType');
						}
					}}
					activeTab={type ? type : 'color'}
					tabs={defaultTabs}
				>
					{(tab) => {
						if (tab.name) {
							if ('image' === tab.name) {
								return <></>;
							} else {
								return (
									<ColorSelector
										handleColorChange={handleColorChange}
										colors={colors}
										currentValue={color ? color : ''}
										inherited={''}
									/>
								);
							}
						}
					}}
				</TabPanel>
				<div className="kbs-background-layer-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}

export default function BackgroundLayer({
	layerKey,
	attributes,
	setAttributes,
	attributeName,
	meta,
	type,
	globalStylesIds,
	reset = true,
	label,
	hasDeviceControls = false,
	isAdvanced = false,
	advancedControls = [],
	isCustom = false,
	hasCustomControls = false,
	previewDevice = 'desktop',
	defaultValue = undefined,
	customOnChange = undefined,
	layer,
	isInherited = false,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const isDisableCustomColors = !customColors ? true : false;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	// const inherited = getInheritedValue(
	// 	attributeName,
	// 	attributes,
	// 	previewDevice,
	// 	meta,
	// 	'backgroundColor',
	// 	globalStylesIds,
	// 	layerKey
	// );
	const onChange = (value, device, type) => {
		console.log('onChange', value, device, type, layerKey);
		handleLayerAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			meta,
			layerKey
		);
	};
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);
	const classes = clsx('kbs-background-layer-control__dropdown-content', globalClasses);

	return (
		<div className={`kbs-background-layer-control`}>
			<Dropdown
				popoverProps={popoverProps}
				className="kbs-background-layer-control__dropdown"
				contentClassName={classes}
				renderToggle={renderBackgroundToggle(layer, isInherited, globalColors, previewDevice)}
				renderContent={renderColorDropdown(globalColors, layer, isInherited, onChange, previewDevice)}
			/>
		</div>
	);
}
