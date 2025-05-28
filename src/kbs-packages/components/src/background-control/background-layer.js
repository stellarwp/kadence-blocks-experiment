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
	getLayerDeviceValue,
} from '@kadence/kbsHelpers';
import ColorSelector from '../color-control/color-selector';
import BackgroundImageControl from '../background-image-control';
import { getColorLabel } from '../color-control/utils';
import ImageSelector from '../image-control/image-selector';
import { getImageFileName } from '../image-control/utils';
import BackgroundImageLayer from './background-image-layer';
import UnitControl from '../unit-control/unit-control';

function BackgroundIndicator({ value, type, colorValue }) {
	const style = {
		background: type !== 'color' ? colorValue : value,
	};
	return (
		<div className="kbs-background-indicator component-color-indicator" style={style}>
			{type !== 'color' && (
				<div className="kbs-background-indicator-layer" style={{ backgroundImage: value }}></div>
			)}
		</div>
	);
}
function renderBackgroundToggle(layer, isInherited, colors, previewDevice, onChange) {
	return ({ onToggle, isOpen }) => {
		const { color, image, video, gradient, pattern, type, opacity } = useMemo(() => {
			return {
				color: getLayerDeviceValue('backgroundColor', layer, previewDevice),
				image: getLayerDeviceValue('backgroundImage', layer, previewDevice),
				video: getLayerDeviceValue('backgroundVideo', layer, previewDevice),
				gradient: getLayerDeviceValue('backgroundGradient', layer, previewDevice),
				pattern: getLayerDeviceValue('backgroundPattern', layer, previewDevice),
				type: getLayerDeviceValue('backgroundType', layer, previewDevice) || 'color',
				opacity: getLayerDeviceValue('backgroundOpacity', layer, previewDevice),
			};
		}, [layer, previewDevice]);
		const displayValue = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorLabel(color, colors);
				case 'image':
					return getImageFileName(image);
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
		const previewString = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorOutput(color);
				case 'image':
					if (image) {
						return 'url(' + image + ')';
					}
					return '';
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
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					{displayValue && (
						<Icon className="kbs-background-select-control__toggle-icon" icon={typeIcon} size={24} />
					)}
					<span className="kbs-background-select-control__toggle-label">
						{displayValue ? displayValue : __('Unset', 'kadence-blocks')}
					</span>
					<BackgroundIndicator
						className="kbs-background-select-control__toggle-preview"
						value={previewString}
						type={type}
						colorValue={getColorOutput(color)}
					/>
				</Button>
				<UnitControl
					label={__('Opacity', 'kadence-blocks')}
					labelPosition="left"
					className="kbs-background-image-layer-control-opacity"
					max={100}
					min={0}
					units={[{ value: '%', label: '%' }]}
					value={opacity}
					previewDevice={previewDevice}
					placeholder={100}
					step={1}
					onChange={(value) => onChange(value, previewDevice, 'backgroundOpacity')}
				/>
			</>
		);
	};
}
/**
 * Get the inherited value for a device, following the inheritance chain
 *
 * @param {string} layerAttribute - The attribute name (e.g., 'typography')
 * @param {object} layer - The layer object
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @returns {object} - An object containing the value and its source
 */
function getFullLayerDeviceValue(layer, device) {
	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	const currentDeviceIndex = deviceOptions.findIndex(
		(option) =>
			option.key?.toLowerCase() === device?.toLowerCase() || option.name?.toLowerCase() === device?.toLowerCase()
	);

	if (device !== 'none') {
		// Check direct value from parent device
		const layerReturn = {};
		for (let i = currentDeviceIndex; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key || parentDevice.name;
			// Make sure it's an object
			if (layer?.[parentDeviceName] && typeof layer?.[parentDeviceName] === 'object') {
				Object.keys(layer?.[parentDeviceName]).forEach((key) => {
					if (!layerReturn?.[key] && layer?.[parentDeviceName]?.[key]) {
						layerReturn[key] = layer?.[parentDeviceName][key];
					}
				});
			}
		}
		return layerReturn;
	}
	return {};
}

function renderColorDropdown(colors, layer, isInherited, onChange, previewDevice, globalClasses) {
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
		const color = getLayerDeviceValue('backgroundColor', layer, previewDevice);
		const image = getLayerDeviceValue('backgroundImage', layer, previewDevice);
		const imageID = getLayerDeviceValue('backgroundImageId', layer, previewDevice);
		const video = getLayerDeviceValue('backgroundVideo', layer, previewDevice);
		const gradient = getLayerDeviceValue('backgroundGradient', layer, previewDevice);
		const pattern = getLayerDeviceValue('backgroundPattern', layer, previewDevice);
		const type = getLayerDeviceValue('backgroundType', layer, previewDevice) || 'color';
		const flattenLayer = getFullLayerDeviceValue(layer, previewDevice);
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
					initialTabName={type ? type : 'color'}
					tabs={defaultTabs}
				>
					{(tab) => {
						if (tab.name) {
							if ('image' === tab.name) {
								return (
									<BackgroundImageLayer
										onChange={handleCustomOnChange}
										previewDevice={previewDevice}
										layer={flattenLayer}
										globalClasses={globalClasses}
									/>
								);
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
		placement: 'left',
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
				renderToggle={renderBackgroundToggle(layer, isInherited, globalColors, previewDevice, onChange)}
				renderContent={renderColorDropdown(
					globalColors,
					layer,
					isInherited,
					onChange,
					previewDevice,
					globalClasses
				)}
			/>
		</div>
	);
}
