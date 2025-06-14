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
	ToggleControl,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
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
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import ColorSelect from '../color-control/color-select';
import TitleBar from '../title-bar';
import PopoverSelect from './popover-select';
import SelectBasicControlSelect from '../select-basic-control/select';

export default function BackgroundPatternLayer({
	previewDevice = 'desktop',
	layer,
	onChange,
	globalClasses,
	isHover = false,
	globalStylesCss,
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
							inherited={
								isHover
									? { inheritedValue: layer?.patternColor ? layer?.patternColor : 'palette3' }
									: { inheritedValue: 'palette3' }
							}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							globalStylesCss={globalStylesCss}
							hasMix={true}
							hasGradient={false}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Pattern Size', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternSize : layer?.patternSize}
							type={'patternSize'}
							inherited={
								isHover
									? { inheritedValue: layer?.patternSize ? layer?.patternSize : '20' }
									: { inheritedValue: '20' }
							}
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
						<SelectBasicControlSelect
							label={__('Pattern Position', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternPosition : layer?.patternPosition}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverPatternPosition');
								} else {
									onChange(value, previewDevice, 'patternPosition');
								}
							}}
							isHover={isHover}
							type={isHover ? 'hoverBackdropFilter' : 'backdropFilter'}
							previewDevice={previewDevice}
							inherited={
								isHover ? { inheritedValue: layer?.patternPosition } : { inheritedValue: 'top left' }
							}
							options={[
								{ label: 'Top Left', value: 'top left' },
								{ label: 'Top Center', value: 'top center' },
								{ label: 'Top Right', value: 'top right' },
								{ label: 'Center Left', value: 'center left' },
								{ label: 'Center Center', value: 'center center' },
								{ label: 'Center Right', value: 'center right' },
								{ label: 'Bottom Left', value: 'bottom left' },
								{ label: 'Bottom Center', value: 'bottom center' },
								{ label: 'Bottom Right', value: 'bottom right' },
							]}
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
						onChange(value, 'Desktop', 'mask');
					}}
					patterns={masks}
					patternColor={layer?.patternColor}
					patternBackground={layer?.color}
					layer={layer}
				/>
				{hasMask && (
					<>
						<ColorSelect
							label={__('Mask Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternColor : layer?.patternColor}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverPatternColor');
								} else {
									onChange(value, previewDevice, 'patternColor');
								}
							}}
							type={isHover ? 'hoverPatternColor' : 'patternColor'}
							inherited={
								isHover
									? { inheritedValue: layer?.patternColor ? layer?.patternColor : 'palette3' }
									: { inheritedValue: 'palette3' }
							}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							globalStylesCss={globalStylesCss}
							hasMix={true}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Mask Size', 'kadence-blocks')}
							value={layer?.maskSize}
							type={'maskSize'}
							inherited={{ inheritedValue: 'cover' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={false}
							onChange={(value) => {
								onChange(value, 'Desktop', 'maskSize');
							}}
						/>
						{layer?.maskSize !== 'stretch' && (
							<div className="kbs-mask-align-control">
								<RadioButtonSelect
									label={__('Horizontal Align', 'kadence-blocks')}
									value={layer?.alignX}
									type={'alignX'}
									inherited={{ inheritedValue: 'mid' }}
									previewDevice={previewDevice}
									view={'normal'}
									hasCustomControls={false}
									onChange={(value) => {
										onChange(value, 'Desktop', 'alignX');
									}}
								/>
								<RadioButtonSelect
									label={__('Vertical Align', 'kadence-blocks')}
									value={layer?.alignY}
									type={'alignY'}
									inherited={{ inheritedValue: 'mid' }}
									previewDevice={previewDevice}
									view={'normal'}
									hasCustomControls={false}
									onChange={(value) => {
										onChange(value, 'Desktop', 'alignY');
									}}
								/>
							</div>
						)}
						<div className="kbs-mask-align-control kbs-mask-flip-control">
							<ToggleControl
								className="kbs-toggle-control"
								__next40pxDefaultSize
								label={__('Flip Horizontal', 'kadence-blocks')}
								checked={'enabled' === layer?.flipX ? true : false}
								onChange={(value) => {
									onChange(value ? 'enabled' : 'disabled', previewDevice, 'flipX');
								}}
							/>
							<ToggleControl
								className="kbs-toggle-control"
								__next40pxDefaultSize
								label={__('Flip Vertical', 'kadence-blocks')}
								checked={'enabled' === layer?.flipY ? true : false}
								onChange={(value) => {
									onChange(value ? 'enabled' : 'disabled', previewDevice, 'flipY');
								}}
							/>
						</div>
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
					patterns={dividers.horizontal}
					sidePatterns={dividers.vertical}
					patternColor={layer?.patternColor}
					patternBackground={layer?.color}
					patternPosition={layer?.dividerPosition || 'bottom'}
					dividerWidth={layer?.dividerWidth}
					dividerHeight={layer?.dividerHeight}
				/>
				{hasDivider && (
					<>
						<ColorSelect
							label={__('Divider Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternColor : layer?.patternColor}
							onChange={(value) => {
								if (isHover) {
									onChange(value, previewDevice, 'hoverPatternColor');
								} else {
									onChange(value, previewDevice, 'patternColor');
								}
							}}
							type={isHover ? 'hoverPatternColor' : 'patternColor'}
							inherited={
								isHover
									? { inheritedValue: layer?.patternColor ? layer?.patternColor : 'palette3' }
									: { inheritedValue: 'palette3' }
							}
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
							onChange={(value) => {
								onChange(value, 'Desktop', 'dividerPosition');
							}}
						/>
						<div className="kbs-divider-width-height-control">
							<RadioButtonSelect
								label={
									layer?.dividerPosition === 'left' || layer?.dividerPosition === 'right'
										? __('Height', 'kadence-blocks')
										: __('Width', 'kadence-blocks')
								}
								value={isHover ? layer?.hoverDividerWidth : layer?.dividerWidth}
								type={'width'}
								placeholder={isHover ? (layer?.dividerWidth ? layer?.dividerWidth : '100') : '100'}
								previewDevice={previewDevice}
								view={'normal'}
								hasCustomControls={false}
								onChange={(value) => {
									if (isHover) {
										onChange(value, previewDevice, 'hoverDividerWidth');
									} else {
										onChange(value, previewDevice, 'dividerWidth');
									}
								}}
								min={0}
								max={500}
								defaultUnit={'%'}
								units={[
									{
										value: '%',
										label: '%',
										a11yLabel: __('Percent (%)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'px',
										label: 'px',
										a11yLabel: __('Pixels (px)', 'kadence-blocks'),
										step: 1,
									},
									{
										value: 'em',
										label: 'em',
										a11yLabel: _x('ems', 'Relative to parent font size (em)', 'kadence-blocks'),
										step: 0.01,
									},
									{
										value: 'rem',
										label: 'rem',
										a11yLabel: _x('rems', 'Relative to root font size (rem)', 'kadence-blocks'),
										step: 0.01,
									},
									{
										value: 'vw',
										label: 'vw',
										a11yLabel: __('Viewport width (vw)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'vh',
										label: 'vh',
										a11yLabel: __('Viewport height (vh)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'custom',
										label: 'custom',
										a11yLabel: __('Custom', 'kadence-blocks'),
										step: 0.1,
									},
								]}
								isHover={isHover}
							/>
							<RadioButtonSelect
								label={
									layer?.dividerPosition === 'left' || layer?.dividerPosition === 'right'
										? __('Width', 'kadence-blocks')
										: __('Height', 'kadence-blocks')
								}
								value={isHover ? layer?.hoverDividerHeight : layer?.dividerHeight}
								type={'height'}
								placeholder={isHover ? (layer?.dividerHeight ? layer?.dividerHeight : '100') : '100'}
								previewDevice={previewDevice}
								view={'normal'}
								hasCustomControls={false}
								onChange={(value) => {
									if (isHover) {
										onChange(value, previewDevice, 'hoverDividerHeight');
									} else {
										onChange(value, previewDevice, 'dividerHeight');
									}
								}}
								defaultUnit={'%'}
								min={0}
								max={500}
								units={[
									{
										value: '%',
										label: '%',
										a11yLabel: __('Percent (%)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'px',
										label: 'px',
										a11yLabel: __('Pixels (px)', 'kadence-blocks'),
										step: 1,
									},
									{
										value: 'em',
										label: 'em',
										a11yLabel: _x('ems', 'Relative to parent font size (em)', 'kadence-blocks'),
										step: 0.01,
									},
									{
										value: 'rem',
										label: 'rem',
										a11yLabel: _x('rems', 'Relative to root font size (rem)', 'kadence-blocks'),
										step: 0.01,
									},
									{
										value: 'vw',
										label: 'vw',
										a11yLabel: __('Viewport width (vw)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'vh',
										label: 'vh',
										a11yLabel: __('Viewport height (vh)', 'kadence-blocks'),
										step: 0.1,
									},
									{
										value: 'custom',
										label: 'custom',
										a11yLabel: __('Custom', 'kadence-blocks'),
										step: 0.1,
									},
								]}
								isHover={isHover}
							/>
						</div>
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
							return maskTab;
						} else if ('divider' === tab.name) {
							return dividerTab;
						}
					}
				}}
			</TabPanel>
		</div>
	);
}
