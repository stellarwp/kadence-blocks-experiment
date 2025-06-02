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
import { useRef, useMemo, useEffect, useState } from '@wordpress/element';
import {
	check as checkIcon,
	close as closeIcon,
	image as imageIcon,
	video as videoIcon,
	grid as patternIcon,
	settings as settingsIcon
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
import { gradient as gradientIcon, color as colorIcon, fill as fillIcon, hover as hoverIcon } from './constants';
import ColorSelector from '../color-control/color-selector';
import BackgroundImageControl from '../background-image-control';
import { getColorLabel } from '../color-control/utils';
import ImageSelector from '../image-control/image-selector';
import { getImageFileName } from '../image-control/utils';
import BackgroundImageLayer from './background-image-layer';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import UnitControl from '../unit-control/unit-control';
import GradientPicker from '../gradient-control';
import BackgroundVideoLayer from './background-video-layer';
import ColorSelect from '../color-control/color-select';
import LayerEffects from './layer-effects';

function BackgroundIndicator({ value, type, colorValue }) {
	const style = {
		background: type !== 'color' ? colorValue : value,
	};
	return (
		<div className="kbs-background-indicator component-color-indicator" style={style}>
			{type === 'video' && (
				<video
					src={value}
					className="kbs-background-indicator-layer kbs-bg-video-preview"
					autoPlay={false}
					muted
					loop
					playsInline
				/>
			)}
			{type !== 'color' && type !== 'video' && (
				<div className="kbs-background-indicator-layer" style={{ backgroundImage: value }}></div>
			)}
		</div>
	);
}
function getGradientLabel(gradient) {
	if (gradient && gradient.length > 0) {
		// get the gradient type from the gradient css string.
		const gradientType = gradient.split('(')[0] || '';
		if (gradientType === 'linear-gradient') {
			return __('Linear Gradient', 'kadence-blocks');
		} else if (gradientType === 'radial-gradient') {
			return __('Radial Gradient', 'kadence-blocks');
		} else if (gradientType === 'conic-gradient') {
			return __('Conic Gradient', 'kadence-blocks');
		}
	}
	return '';
}
function getVideoLabel(video, videoType) {
	if (videoType && videoType === 'youtube') {
		return __('YouTube', 'kadence-blocks');
	} else if (videoType && videoType === 'vimeo') {
		return __('Vimeo', 'kadence-blocks');
	} else if (video) {
		return getImageFileName(video) || __('Unset', 'kadence-blocks');
	}
	return '';
}
function getVideoPreview(video, videoType, youtube, vimeo) {
	if (videoType && videoType === 'youtube') {
		return youtube ? `url(https://img.youtube.com/vi/${youtube}/maxresdefault.jpg)` : '';
	} else if (videoType && videoType === 'vimeo') {
		return vimeo ? `url(https://vumbnail.com/${vimeo}.jpg)` : '';
	}
	return video;
}
function renderBackgroundToggle(layer, isInherited, colors, previewDevice, onChange) {
	return ({ onToggle, isOpen }) => {
		const { color, image, video, videoType, youtube, vimeo, gradient, pattern, type, opacity } = useMemo(() => {
			return {
				color: getLayerDeviceValue('color', layer, previewDevice),
				image: getLayerDeviceValue('image', layer, previewDevice),
				video: getLayerDeviceValue('video', layer, previewDevice),
				videoType: getLayerDeviceValue('videoType', layer, previewDevice),
				youtube: getLayerDeviceValue('youtube', layer, previewDevice),
				vimeo: getLayerDeviceValue('vimeo', layer, previewDevice),
				gradient: getLayerDeviceValue('gradient', layer, previewDevice),
				pattern: getLayerDeviceValue('pattern', layer, previewDevice),
				type: getLayerDeviceValue('type', layer, previewDevice) || 'color',
				opacity: getLayerDeviceValue('opacity', layer, previewDevice),
			};
		}, [layer, previewDevice]);
		const displayValue = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorLabel(color, colors);
				case 'image':
					return getImageFileName(image) || __('Unset', 'kadence-blocks');
				case 'video':
					return getVideoLabel(video, videoType) || __('Unset', 'kadence-blocks');
				case 'gradient':
					return getGradientLabel(gradient);
				case 'pattern':
					return pattern;
				default:
					return '';
			}
		}, [type, color, image, video, videoType, gradient, pattern]);
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
					return getVideoPreview(video, videoType, youtube, vimeo);
				case 'gradient':
					return gradient;
				case 'pattern':
					return pattern;
				default:
					return '';
			}
		}, [type, color, image, video, videoType, gradient, youtube, vimeo, pattern]);
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
						type={type === 'video' && videoType && videoType !== 'local' ? 'image' : type}
						colorValue={getColorOutput(color)}
					/>
				</Button>
				<UnitControl
					label={''}
					className="kbs-background-image-layer-control-opacity"
					max={100}
					min={0}
					units={[{ value: '%', label: '%' }]}
					value={opacity}
					previewDevice={previewDevice}
					placeholder={100}
					step={1}
					onChange={(value) => onChange(value, previewDevice, 'opacity')}
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

function renderBackgroundDropdown(colors, layer, isInherited, onChange, previewDevice, globalClasses, useHover = false) {
	const [isHover, setIsHover] = useState(false);
	return ({ onToggle, isOpen }) => {
		const handleColorChange = (color) => {
			onChange(color, previewDevice, 'color');
		};
		const handleTypeChange = (type) => {
			onChange(type, previewDevice, 'type');
		};
		const handleCustomOnChange = (value, device, type) => {
			onChange(value, device, type);
		};
		const color = getLayerDeviceValue('color', layer, previewDevice);
		const image = getLayerDeviceValue('image', layer, previewDevice);
		const imageID = getLayerDeviceValue('imageId', layer, previewDevice);
		const video = getLayerDeviceValue('video', layer, previewDevice);
		const gradient = getLayerDeviceValue('gradient', layer, previewDevice);
		const pattern = getLayerDeviceValue('pattern', layer, previewDevice);
		const type = getLayerDeviceValue('type', layer, previewDevice) || 'color';
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
					className="kbs-color-select-tabs kbs-responsive-locked"
					activeClass="is-active"
					onSelect={(tabName) => {
						if (tabName !== type) {
							handleCustomOnChange(tabName, 'Desktop', 'type');
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
							} else if ('gradient' === tab.name) {
								return (
									<GradientPicker
										value={gradient}
										globalClasses={globalClasses}
										onChange={(value) => handleCustomOnChange(value, previewDevice, 'gradient')}
									/>
								);
							} else if ('video' === tab.name) {
								return (
									<BackgroundVideoLayer
										onChange={handleCustomOnChange}
										previewDevice={previewDevice}
										layer={flattenLayer}
										hasYouTube={true}
										hasVimeo={true}
									/>
								);
							} else {
								return (
									<>
										<ColorSelector
											handleColorChange={handleColorChange}
											colors={colors}
											currentValue={color ? color : ''}
											inherited={''}
											hasMix={true}
											globalClasses={globalClasses}
										/>
										<LayerEffects
											layer={flattenLayer}
											onChange={handleCustomOnChange}
											previewDevice={previewDevice}
											globalClasses={globalClasses}
											isHover={isHover}
											onToggleHover={() => setIsHover(!isHover)}
										/>
									</>
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
		//placement: 'left-start',
		placement: 'left',
		//offset: 36,
		shift: true,
		// style: {
		// 	marginTop: '-72px',
		// },
	};
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const isDisableCustomColors = !customColors ? true : false;
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
				renderContent={renderBackgroundDropdown(
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
