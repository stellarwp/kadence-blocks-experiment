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
	getPatternOptions,
	getMaskOptions,
	getDividerOptions,
} from '@kadence/kbsHelpers';
import ImageSelector from '../image-control/image-selector';
import FocalPointPicker from '../focal-point-picker';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import ColorSelect from '../color-control/color-select';
import UnitControl from '../unit-control/unit-control';
import TitleBar from '../title-bar';
import PopoverSelect from './popover-select';

export default function BackgroundPatternLayer({
	previewDevice = 'desktop',
	layer,
	onChange,
	globalClasses,
	isHover = false,
}) {
	const hasPattern = layer?.pattern;
	const hasMask = layer?.mask;
	const hasDivider = layer?.divider;
	const onResetPattern = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['pattern', 'patternSize', 'patternColor', 'hoverPatternColor', 'hoverPatternSize', 'color', 'hoverColor']
		);
	};
	const onResetMask = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['mask', 'size', 'maskColor', 'hoverMaskColor', 'hoverSize', 'color', 'hoverColor']
		);
	};
	const onResetDivider = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['divider', 'dividerSize', 'dividerColor', 'hoverDividerColor', 'hoverDividerSize', 'color', 'hoverColor']
		);
	};
	const patterns = getPatternOptions();
	const masks = getMaskOptions();
	const dividers = getDividerOptions();
	const patternTab = (
		<>
			<TitleBar
				label={__('Background Pattern', 'kadence-blocks')}
				reset={true}
				onReset={onResetPattern}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-pattern-control-inner`}>
				<PopoverSelect
					label={''}
					value={layer?.pattern}
					type={'pattern'}
					onChange={(value) => {
						onChange(value, previewDevice, 'pattern');
					}}
					patterns={patterns}
					patternSize={layer?.patternSize}
					patternColor={layer?.patternColor}
					patternBackground={layer?.color}
				/>
				{hasPattern && (
					<>
						<ColorSelect
							label={__('Pattern Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternColor : layer?.patternColor}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverPatternColor');
								} else {
									onChange(value, previewDevice, 'patternColor');
								}
							}}
							type={isHover ? 'hoverPatternColor' : 'patternColor'}
							inherited={isHover ? { inheritedValue: (layer?.patternColor ? layer?.patternColor : 'palette3') } : { inheritedValue: 'palette3' }}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							hasMix={true}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Pattern Size', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternSize : layer?.patternSize}
							type={'patternSize'}
							inherited={isHover ? { inheritedValue: (layer?.patternSize ? layer?.patternSize : '20') } : { inheritedValue: '20' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={true}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverPatternSize');
								} else {
									onChange(value, previewDevice, 'patternSize');
								}
							}}
							min={1}
							max={1000}
							step={1}
							isHover={isHover}
						/>
					</>
				)}
			</div>
		</>
	);
	const maskTab = (
		<>
			<TitleBar
				label={__('Background Mask', 'kadence-blocks')}
				reset={true}
				onReset={onResetMask}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-pattern-control-inner`}>
				<PopoverSelect
					label={''}
					value={layer?.mask}
					type={'mask'}
					onChange={(value) => {
						onChange(value, previewDevice, 'mask');
					}}
					patterns={masks}
					patternSize={layer?.maskSize}
					patternColor={layer?.maskColor}
					patternBackground={layer?.color}
				/>
				{hasMask && (
					<>
						<ColorSelect
							label={__('Mask Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverMaskColor : layer?.maskColor}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverMaskColor');
								} else {
									onChange(value, previewDevice, 'maskColor');
								}
							}}
							type={isHover ? 'hoverMaskColor' : 'maskColor'}
							inherited={isHover ? { inheritedValue: (layer?.maskColor ? layer?.maskColor : 'palette3') } : { inheritedValue: 'palette3' }}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							hasMix={true}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Mask Size', 'kadence-blocks')}
							value={layer?.size}
							type={'size'}
							inherited={{ inheritedValue: 'cover' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={true}
							onChange={onChange}
						/>
					</>
				)}
			</div>
		</>
	);
	const dividerTab = (
		<>
			<TitleBar
				label={__('Divider Shape', 'kadence-blocks')}
				reset={true}
				onReset={onResetDivider}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-pattern-control-inner`}>
				<PopoverSelect
					label={''}
					value={layer?.divider}
					type={'divider'}
					onChange={(value) => {
						onChange(value, 'Desktop', 'divider');
					}}
					patterns={dividers}
					patternColor={layer?.dividerColor}
					patternBackground={layer?.color}
					patternPosition={layer?.dividerPosition || 'bottom'}
				/>
				{hasDivider && (
					<>
						<ColorSelect
							label={__('Divider Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverDividerColor : layer?.dividerColor}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverMaskColor');
								} else {
									onChange(value, previewDevice, 'maskColor');
								}
							}}
							type={isHover ? 'hoverMaskColor' : 'maskColor'}
							inherited={isHover ? { inheritedValue: (layer?.dividerColor ? layer?.dividerColor : 'palette3') } : { inheritedValue: 'palette3' }}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							hasMix={true}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Position', 'kadence-blocks')}
							value={layer?.dividerPosition}
							type={'dividerPosition'}
							inherited={{ inheritedValue: 'bottom' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={false}
							onChange={onChange}
						/>
					</>
				)}
			</div>
		</>
	);
	const defaultTabs = [
		{
			name: 'mask',
			title: __('Mask', 'kadence-blocks'),
		},
		{
			name: 'divider',
			title: __('Divider', 'kadence-blocks'),
		},
		{
			name: 'pattern',
			title: __('Pattern', 'kadence-blocks'),
		},
	];
	return (
		<div className={`kbs-background-layer-pattern-control`}>
			<TabPanel
				initialTabName={layer?.patternType}
				className="kbs-video-select-tabs kbs-color-select-tabs kbs-responsive-locked"
				activeClass="is-active"
				tabs={defaultTabs}
				onSelect={(tabName) => {
					if (tabName !== layer?.patternType) {
						onChange(tabName, 'Desktop', 'patternType');
					}
				}}
			>
				{(tab) => {
					if (tab.name) {
						if ('pattern' === tab.name) {
							return patternTab;
						} else if ('mask' === tab.name) {
							return <div>Mask</div>;
						} else if ('divider' === tab.name) {
							return dividerTab;
						}
					}
				}}
			</TabPanel>
			
		</div>
	);
}
