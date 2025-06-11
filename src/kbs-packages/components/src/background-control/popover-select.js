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
	SVG,
	Path,
	HStack,
	FlexItem,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo } from '@wordpress/element';
import { color as colorIcon, check as checkIcon, close as closeIcon, grid as patternIcon } from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import './editor.scss';
import { maskIcon, dividerIcon } from '../constants/icons';

export function PopoverPatternRender({ pattern, className, patternSize, patternColor, patternBackground }) {
	const style = {};
	if (pattern?.background) {
		style.background = pattern.background;
	}
	if (pattern?.['background-image']) {
		style.backgroundImage = pattern['background-image'];
	}
	if (pattern?.['background-size']) {
		style.backgroundSize = pattern['background-size'];
	}
	if (pattern?.['background-position']) {
		style.backgroundPosition = pattern['background-position'];
	}
	if (patternSize) {
		style['--kbs-pattern-size'] = patternSize;
	}
	if (patternColor) {
		style['--kbs-pattern-color'] = getColorOutput(patternColor);
	}
	if (patternBackground) {
		style['--kbs-pattern-bg'] = getColorOutput(patternBackground);
	}
	return <div className={clsx('kbs-popover-background-select-control-style', className)} style={style} />;
}

export function PopoverMaskRender({
	mask,
	className,
	maskColor,
	maskAlignX,
	maskAlignY,
	maskSize,
	maskFlipX,
	maskFlipY,
}) {
	const style = {};
	if (maskColor) {
		style['color'] = getColorOutput(maskColor);
	} else {
		style['color'] = getColorOutput('palette3');
	}
	if (maskFlipX === 'enabled') {
		style['transform'] = `scaleX(-1)`;
	}
	if (maskFlipY === 'enabled') {
		if (style?.['transform']) {
			style['transform'] += ` scaleY(-1)`;
		} else {
			style['transform'] = `scaleY(-1)`;
		}
	}
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
		<div className={clsx('kbs-popover-background-select-control-style', className)}>
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1920 1200"
				preserveAspectRatio={ratio}
				className={'kbs-mask-svg'}
				style={style}
			>
				<Path d={mask?.path} />
			</SVG>
		</div>
	);
}

export function PopoverDividerRender({
	divider,
	className,
	dividerColor,
	dividerBackground,
	dividerWidth,
	dividerHeight,
}) {
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
		<div className={clsx('kbs-popover-background-select-control-style', className)} style={style}>
			{divider?.svg}
		</div>
	);
}

export function PopoverDropdown({
	patterns,
	value,
	onChange,
	previewDevice,
	type,
	patternSize,
	patternColor,
	patternBackground,
}) {
	const label = useMemo(() => {
		if (type === 'color') {
			return __('SelectColor', 'kadence-blocks');
		}
		if (type === 'pattern') {
			return __('Select Pattern', 'kadence-blocks');
		}
		if (type === 'divider') {
			return __('Select Divider', 'kadence-blocks');
		}
		if (type === 'preset') {
			return __('Select Preset', 'kadence-blocks');
		}
		if (type === 'mask') {
			return __('Select Mask', 'kadence-blocks');
		}
		return __('Select', 'kadence-blocks');
	}, [type]);
	return ({ onToggle, isOpen }) => {
		const handlePatternChange = (update) => {
			onChange(update, previewDevice, type);
			if (!value) {
				onToggle();
			}
		};
		return (
			<div className="kbs-popover-background-select-control kbs-popover-background-select-control__dropdown-content-inner">
				<TitleBar label={label} reset={false} />
				<div className="kbs-popover-background-select-control__dropdown-content-items">
					{patterns.map((pattern) => (
						<Button
							key={pattern.value}
							label={pattern.label}
							isPressed={pattern.value === value}
							className={`kbs-radio-popover-select-control-button`}
							onClick={() => handlePatternChange(pattern.value)}
						>
							{type === 'pattern' && <PopoverPatternRender pattern={pattern} patternSize={patternSize} />}
							{type === 'divider' && <PopoverDividerRender divider={pattern} />}
							{type === 'mask' && <PopoverMaskRender mask={pattern} />}
						</Button>
					))}
				</div>
				<div className="kbs-popover-background-select-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}
export function PopoverToggle({
	value,
	patterns,
	sidePatterns,
	patternPosition,
	inherited,
	type,
	patternSize,
	patternColor,
	patternBackground,
	dividerWidth,
	dividerHeight,
	layer,
}) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx(
				'kbs-popover-background-select-button',
				'kbs-popover-background-select-control__toggle-button',
				{
					'is-open': isOpen,
					'is-selected': value,
					'is-inherited': !value && inherited,
				}
			),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};
		const currentItem = useMemo(() => {
			if (value) {
				if (patternPosition === 'left' || patternPosition === 'right') {
					return sidePatterns.find((pattern) => pattern.value === value);
				}
				return patterns.find((pattern) => pattern.value === value);
			}
			if (inherited) {
				if (patternPosition === 'left' || patternPosition === 'right') {
					return sidePatterns.find((pattern) => pattern.value === inherited);
				}
				return patterns.find((pattern) => pattern.value === inherited);
			}
			return {};
		}, [inherited, value, patternPosition]);
		const icon = useMemo(() => {
			if (type === 'color') {
				return colorIcon;
			}
			if (type === 'pattern') {
				return patternIcon;
			}
			if (type === 'divider') {
				return dividerIcon;
			}
			if (type === 'mask') {
				return maskIcon;
			}
			return null;
		}, [type]);
		const label = useMemo(() => {
			if (type === 'color') {
				return __('SelectColor', 'kadence-blocks');
			}
			if (type === 'pattern') {
				return __('Select Pattern', 'kadence-blocks');
			}
			if (type === 'divider') {
				return __('Select Divider', 'kadence-blocks');
			}
			if (type === 'preset') {
				return __('Select Preset', 'kadence-blocks');
			}
			if (type === 'mask') {
				return __('Select Mask', 'kadence-blocks');
			}
			return __('Select', 'kadence-blocks');
		}, [type]);
		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					<Icon className="kbs-popover-background-select-control__toggle-icon" icon={icon} size={24} />
					<span className="kbs-popover-background-select-control__toggle-label">
						{value ? currentItem?.label : label}
					</span>
				</Button>
				{value && currentItem && (
					<div
						className="kbs-color-select-control__toggle-preview"
						style={{ background: getColorOutput(patternBackground) }}
					>
						{type === 'pattern' && (
							<PopoverPatternRender
								patternSize={patternSize}
								patternColor={patternColor}
								patternBackground={patternBackground}
								pattern={currentItem}
							/>
						)}
						{type === 'divider' && (
							<PopoverDividerRender
								dividerColor={patternColor}
								divider={currentItem}
								dividerWidth={dividerWidth}
								dividerHeight={dividerHeight}
							/>
						)}
						{type === 'mask' && (
							<PopoverMaskRender
								maskColor={patternColor}
								mask={currentItem}
								maskAlignX={layer?.alignX}
								maskAlignY={layer?.alignY}
								maskSize={layer?.maskSize}
								maskFlipX={layer?.flipX}
								maskFlipY={layer?.flipY}
							/>
						)}
					</div>
				)}
			</>
		);
	};
}

export default function PopoverSelect({
	type,
	reset = true,
	label,
	previewDevice = 'desktop',
	defaultValue = undefined,
	globalClasses,
	patterns = [],
	sidePatterns = [],
	onChange,
	value,
	patternColor = undefined,
	patternBackground = undefined,
	inherited = undefined,
	patternSize = undefined,
	patternPosition = undefined,
	dividerWidth = undefined,
	dividerHeight = undefined,
	layer = undefined,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const classes = clsx('kbs-popover-background-select-control__dropdown-content', globalClasses, {
		[`kbs-popover-select-type-${type}`]: type,
		[`kbs-popover-select-position-${patternPosition}`]: patternPosition,
	});
	return (
		<div className={`components-base-control kbs-control kbs-popover-background-select-control`}>
			{label && <TitleBar label={label} reset={reset} onReset={onReset} />}
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={popoverProps}
					className={clsx('kbs-popover-background-select-control__dropdown', {
						'has-pattern-value': value || inherited,
						[`kbs-popover-select-type-${type}`]: type,
						[`kbs-popover-select-position-${patternPosition}`]: patternPosition,
					})}
					contentClassName={classes}
					renderToggle={PopoverToggle({
						value: value,
						patterns: patterns,
						sidePatterns: sidePatterns,
						patternPosition: patternPosition,
						type: type,
						inherited: inherited,
						patternColor: patternColor,
						patternBackground: patternBackground,
						patternSize: patternSize,
						dividerWidth: dividerWidth,
						dividerHeight: dividerHeight,
						layer: layer,
					})}
					renderContent={PopoverDropdown({
						patterns: patterns,
						sidePatterns: sidePatterns,
						patternPosition: patternPosition,
						value: value,
						onChange: onChange,
						previewDevice: previewDevice,
						type: type,
						patternColor: patternColor,
						patternBackground: patternBackground,
						patternSize: patternSize,
					})}
				/>
			</div>
		</div>
	);
}
