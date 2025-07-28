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
	SVG,
	Path,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect, useState } from '@wordpress/element';
import {
	check as checkIcon,
	close as closeIcon,
	image as imageIcon,
	video as videoIcon,
	grid as patternIcon,
	settings as settingsIcon,
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
	getGradientOptions,
	getPatternOptions,
	getDividerOptions,
	getMaskOptions,
} from '@kadence/kbsHelpers';
import { gradient as gradientIcon, color as colorIcon, fill as fillIcon, hover as hoverIcon } from './constants';
import { maskIcon, blurIcon, dividerIcon } from '../constants/icons';
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
import BackgroundMaskLayer from './background-mask-layer';
import BackgroundBackdropLayer from './background-backdrop';
import { InlinePatternRender, InlineMaskRender, InlineDividerRender } from './popover-select';

function SidebarMaskRender({ mask, maskType }) {
	if (maskType === 'divider') {
		return (
			<InlineDividerRender
				divider={mask}
				dividerPosition={mask?.dividerPosition}
				dividerColor={mask?.maskColor}
			/>
		);
	} else if (maskType === 'pattern') {
		return (
			<InlinePatternRender
				pattern={mask}
				patternColor={mask?.maskColor}
				patternBackground={mask?.backgroundColor}
			/>
		);
	}
	return <InlineMaskRender mask={mask} maskColor={mask?.maskColor} />;
}
function BackgroundIndicator({ value, type, colorValue, maskType }) {
	const style = {
		background: type !== 'color' ? colorValue : value,
	};
	return (
		<div
			className={clsx('kbs-background-indicator component-color-indicator', value ? 'has-value' : '')}
			style={style}
		>
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
			{type === 'mask' && <SidebarMaskRender mask={value} maskType={maskType} />}
			{type !== 'color' && type !== 'video' && type !== 'mask' && type !== 'backdrop' && (
				<div className="kbs-background-indicator-layer" style={{ backgroundImage: value }}></div>
			)}
			{type === 'backdrop' && (
				<div className="kbs-background-indicator-layer" style={{ backdropFilter: value }}></div>
			)}
		</div>
	);
}
function getGradientLabel(gradient, gradients) {
	if (gradient && gradient.startsWith('var(')) {
		const gradientOption = gradients.find(({ slug }) => 'var(--kbs-gradients-' + slug + ')' === gradient);
		if (gradientOption?.name) {
			return gradientOption.name;
		}
		return gradient;
	}
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
function getBackdropLabel(backdropFilter) {
	if (!backdropFilter) {
		return __('None', 'kadence-blocks');
	}
	switch (backdropFilter) {
		case 'blur':
			return __('Blur', 'kadence-blocks');
		case 'brightness':
			return __('Brightness', 'kadence-blocks');
		case 'contrast':
			return __('Contrast', 'kadence-blocks');
		case 'grayscale':
			return __('Grayscale', 'kadence-blocks');
		case 'invert':
			return __('Invert', 'kadence-blocks');
		case 'saturate':
			return __('Saturate', 'kadence-blocks');
		case 'hue-rotate':
			return __('Hue Rotate', 'kadence-blocks');
		case 'sepia':
			return __('Sepia', 'kadence-blocks');
		case 'none':
			return __('None', 'kadence-blocks');
		default:
			return backdropFilter;
	}
}
function getVideoPreview(video, videoType, youtube, vimeo) {
	if (videoType && videoType === 'youtube') {
		return youtube ? `url(https://img.youtube.com/vi/${youtube}/maxresdefault.jpg)` : '';
	} else if (videoType && videoType === 'vimeo') {
		return vimeo ? `url(https://vumbnail.com/${vimeo}.jpg)` : '';
	}
	return video;
}
function renderBackgroundToggle(layer, isInherited, colors, previewDevice, onChange, gradients) {
	return ({ onToggle, isOpen }) => {
		const {
			color,
			image,
			video,
			videoType,
			youtube,
			vimeo,
			gradient,
			pattern,
			type,
			opacity,
			maskType,
			divider,
			mask,
			dividerPosition,
			backdropFilter,
			backdropSize,
			maskInverted,
		} = useMemo(() => {
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
				maskType: getLayerDeviceValue('maskType', layer, previewDevice),
				divider: getLayerDeviceValue('divider', layer, previewDevice),
				mask: getLayerDeviceValue('mask', layer, previewDevice),
				dividerPosition: getLayerDeviceValue('dividerPosition', layer, previewDevice),
				backdropFilter: getLayerDeviceValue('backdropFilter', layer, previewDevice),
				backdropSize: getLayerDeviceValue('backdropSize', layer, previewDevice),
				maskInverted: getLayerDeviceValue('maskInverted', layer, previewDevice),
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
					return getGradientLabel(gradient, gradients);
				case 'backdrop':
					return getBackdropLabel(backdropFilter);
				case 'mask':
					if (maskType === 'divider') {
						return (
							getDividerOptions()['horizontal'].find(({ value }) => value === divider)?.label || divider
						);
					}
					if (maskType === 'pattern') {
						return getPatternOptions().find(({ value }) => value === pattern)?.label || pattern;
					}
					return getMaskOptions()['normal'].find(({ value }) => value === mask)?.label || mask;
				default:
					return '';
			}
		}, [type, color, image, video, videoType, gradient, pattern, maskType, divider, mask, backdropFilter]);
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
				case 'backdrop':
					if (backdropFilter && backdropFilter !== 'none') {
						const backdropUnit =
							backdropFilter === 'blur' ? 'px' : backdropFilter === 'hue-rotate' ? 'deg' : '%';
						return (
							backdropFilter +
							'(' +
							(backdropSize || backdropSize === 0 ? backdropSize : '1') +
							backdropUnit +
							')'
						);
					}
					return '';
				case 'mask':
					let returnObject = {};
					if (maskType === 'divider') {
						returnObject =
							getDividerOptions()[
								dividerPosition === 'left' || dividerPosition === 'right' ? 'vertical' : 'horizontal'
							].find(({ value }) => value === divider) || {};
						returnObject.dividerPosition = dividerPosition;
					} else if (maskType === 'pattern') {
						returnObject = getPatternOptions().find(({ value }) => value === pattern) || {};
					} else {
						returnObject =
							getMaskOptions()[maskInverted === 'enabled' ? 'inverted' : 'normal'].find(
								({ value }) => value === mask
							) || {};
					}
					returnObject.backgroundColor = getColorOutput(color) || 'transparent';
					returnObject.maskColor =
						getColorOutput(getLayerDeviceValue('maskColor', layer, previewDevice)) ||
						getColorOutput('palette3');
					return returnObject;
				default:
					return '';
			}
		}, [
			type,
			color,
			image,
			video,
			videoType,
			gradient,
			youtube,
			vimeo,
			pattern,
			maskType,
			dividerPosition,
			backdropFilter,
			backdropSize,
			divider,
			dividerPosition,
			maskInverted,
			mask,
		]);
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
				case 'backdrop':
					return blurIcon;
				case 'mask':
					if (maskType === 'divider') {
						return dividerIcon;
					}
					if (maskType === 'pattern') {
						return patternIcon;
					}
					return maskIcon;
				default:
					return colorIcon;
			}
		}, [type, maskType]);
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
						maskType={maskType}
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
					if (
						!layerReturn?.[key] &&
						(layer?.[parentDeviceName]?.[key] || layer?.[parentDeviceName]?.[key] === 0)
					) {
						layerReturn[key] = layer?.[parentDeviceName][key];
					}
				});
			}
		}
		return layerReturn;
	}
	return {};
}
function BackgroundDropdownContent({
	colors,
	layer,
	isInherited,
	onChange,
	previewDevice,
	globalClasses,
	globalStylesCss,
	layerKey,
	containerRef,
	isHover,
	setIsHover,
	onToggle,
	isOpen,
}) {
	const handleCustomOnChange = (value, device, type) => {
		onChange(value, device, type);
	};
	const color = getLayerDeviceValue('color', layer, previewDevice);
	const hoverColor = getLayerDeviceValue('hoverColor', layer, previewDevice);
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
			name: 'mask',
			icon: maskIcon,
			title: __('Masks & Patterns', 'kadence-blocks'),
		},
		{
			name: 'backdrop',
			icon: blurIcon,
			title: __('Backdrop Filter', 'kadence-blocks'),
		},
	];
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, divRef?.current]);
	return (
		<div ref={divRef} className={'kbs-background-layer-control__dropdown-content-inner kbs-color-control'}>
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
								<>
									<BackgroundImageLayer
										onChange={handleCustomOnChange}
										previewDevice={previewDevice}
										layer={flattenLayer}
										globalClasses={globalClasses}
										globalStylesCss={globalStylesCss}
									/>
								</>
							);
						} else if ('gradient' === tab.name) {
							return (
								<>
									<GradientPicker
										value={gradient}
										globalClasses={globalClasses}
										onChange={(value) => handleCustomOnChange(value, previewDevice, 'gradient')}
										containerRef={containerRef}
										globalStylesCss={globalStylesCss}
									/>
								</>
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
						} else if ('backdrop' === tab.name) {
							return (
								<BackgroundBackdropLayer
									onChange={handleCustomOnChange}
									previewDevice={previewDevice}
									layer={flattenLayer}
									isHover={isHover}
									onToggleHover={() => setIsHover(!isHover)}
									hasHoverControls={true}
								/>
							);
						} else if ('mask' === tab.name) {
							return (
								<BackgroundMaskLayer
									onChange={handleCustomOnChange}
									previewDevice={previewDevice}
									layer={flattenLayer}
									isHover={isHover}
									onToggleHover={() => setIsHover(!isHover)}
									hasHoverControls={true}
									globalStylesCss={globalStylesCss}
								/>
							);
						} else {
							return (
								<>
									<ColorSelector
										handleColorChange={(value) => {
											if (isHover) {
												handleCustomOnChange(value, previewDevice, 'hoverColor');
											} else {
												handleCustomOnChange(value, previewDevice, 'color');
											}
										}}
										colors={colors}
										currentValue={isHover ? hoverColor : color}
										inherited={isHover ? { inheritedValue: color } : ''}
										hasMix={true}
										globalClasses={globalClasses}
										isHover={isHover}
										onToggleHover={() => setIsHover(!isHover)}
										hasHoverControls={true}
										globalStylesCss={globalStylesCss}
									/>
								</>
							);
						}
					}
				}}
			</TabPanel>
			<LayerEffects
				layer={flattenLayer}
				onChange={handleCustomOnChange}
				previewDevice={previewDevice}
				globalClasses={globalClasses}
				isHover={isHover}
				onToggleHover={() => setIsHover(!isHover)}
				layerKey={layerKey}
				globalStylesCss={globalStylesCss}
			/>
			<div className="kbs-background-layer-control__dropdown-content-close">
				<Button __next40pxDefaultSize onClick={onToggle}>
					<Icon icon={closeIcon} size={24} />
				</Button>
			</div>
		</div>
	);
}

function renderBackgroundDropdown(
	colors,
	layer,
	isInherited,
	onChange,
	previewDevice,
	globalClasses,
	layerKey,
	containerRef,
	globalStylesCss,
	useHover = false
) {
	const [isHover, setIsHover] = useState(false);
	return ({ onToggle, isOpen }) => {
		return (
			<BackgroundDropdownContent
				colors={colors}
				layer={layer}
				isInherited={isInherited}
				onChange={onChange}
				previewDevice={previewDevice}
				globalClasses={globalClasses}
				globalStylesCss={globalStylesCss}
				layerKey={layerKey}
				containerRef={containerRef}
				isHover={isHover}
				setIsHover={setIsHover}
				onToggle={onToggle}
				isOpen={isOpen}
			/>
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
	previewDevice = 'Desktop',
	defaultValue = undefined,
	globalStylesCss,
	customOnChange = undefined,
	layer,
	isInherited = false,
	inherited = {},
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
	const containerRef = useRef(undefined);
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const gradients = getGradientOptions();
	const isDisableCustomColors = !customColors ? true : false;
	const onChange = (value, device, type) => {
		let useAttributes = attributes;
		if (isInherited) {
			if (inherited?.inheritedValue) {
				if (!useAttributes?.[attributeName]) {
					useAttributes[attributeName] = {};
				}
				if (!useAttributes?.[attributeName]?.layers) {
					useAttributes[attributeName].layers = [];
				}
				useAttributes[attributeName].layers = JSON.parse(JSON.stringify(inherited.inheritedValue));
			}
		}
		console.log('onChange', value, device, type, layerKey);
		handleLayerAttributeChange(
			value,
			device,
			attributeName,
			useAttributes,
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
		<div ref={containerRef} className={`kbs-background-layer-control`}>
			<Dropdown
				popoverProps={popoverProps}
				className="kbs-background-layer-control__dropdown"
				contentClassName={classes}
				renderToggle={renderBackgroundToggle(
					layer,
					isInherited,
					globalColors,
					previewDevice,
					onChange,
					gradients
				)}
				renderContent={renderBackgroundDropdown(
					globalColors,
					layer,
					isInherited,
					onChange,
					previewDevice,
					globalClasses,
					layerKey,
					containerRef,
					globalStylesCss
				)}
			/>
		</div>
	);
}
