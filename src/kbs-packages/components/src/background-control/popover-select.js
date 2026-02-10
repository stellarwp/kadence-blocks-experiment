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

export function InlinePatternRender({ pattern, className, patternSize, patternColor }) {
	const style = {};
	if (patternSize) {
		style['--kbs-pattern-size'] = patternSize;
	}
	if (pattern?.svg) {
		style.background = patternColor ? getColorOutput(patternColor) : getColorOutput('palette3');
		style.maskImage = `url("data:image/svg+xml, ${encodeURIComponent(pattern.svg)}")`;
		style.maskRepeat = 'repeat';
		const currentPatternSize = pattern?.size;
		style.maskSize = 'calc( (1px * ' + currentPatternSize + ') * (var(--kbs-pattern-size) / 20))';
		style.maskPosition = '0 0';
	}
	return (
		<div className={clsx('kbs-popover-background-select-control-style kbs-pattern-svg', className)} style={style} />
	);
}

export function InlineMaskRender({
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
		style.background = getColorOutput(maskColor);
	} else {
		style.background = getColorOutput('palette3');
	}
	if (maskFlipX === 'enabled') {
		style.transform = `scaleX(-1)`;
	}
	if (maskFlipY === 'enabled') {
		if (style?.transform) {
			style.transform += ` scaleY(-1)`;
		} else {
			style.transform = `scaleY(-1)`;
		}
	}

	if (mask?.path) {
		const ratio = maskSize === 'stretch' ? 'none' : 'xMidYMid meet';
		style.maskImage = `url("data:image/svg+xml, ${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="' + ratio + '" viewBox="0 0 1920 1200" fill="black"><path d="' + mask.path + '" /></svg>')}")`;
		style.maskRepeat = 'no-repeat';
		if (maskSize == 'contain') {
			style.maskSize = 'contain';
		} else {
			style.maskSize = 'cover';
		}
		let positionY = 'center';
		let positionX = 'center';
		if ('min' === maskAlignX) {
			positionX = 'left';
		} else if ('max' === maskAlignX) {
			positionX = 'right';
		}
		if ('min' === maskAlignY) {
			positionY = 'top';
		} else if ('max' === maskAlignY) {
			positionY = 'bottom';
		}
		style.maskPosition = positionX + ' ' + positionY;
	}
	return (
		<div
			className={clsx('kbs-popover-background-select-control-style kbs-mask-svg', className)}
			style={style}
		></div>
	);
}

export function InlineDividerRender({
	divider,
	className,
	dividerColor,
	dividerBackground,
	dividerWidth,
	dividerHeight,
	dividerPosition,
}) {
	const style = {};
	if (dividerWidth) {
		style['--kbs-divider-width'] = dividerWidth;
	}
	if (dividerHeight) {
		style['--kbs-divider-height'] = dividerHeight;
	}
	if (divider?.svg) {
		style.background = dividerColor ? getColorOutput(dividerColor) : getColorOutput('palette3');
		style.maskImage = `url("data:image/svg+xml, ${encodeURIComponent(divider.svg)}")`;
		style.maskRepeat = 'no-repeat';
	}
	return (
		<div
			className={clsx(
				'kbs-popover-background-select-control-style',
				className,
				dividerPosition ? `divider-position-${dividerPosition}` : ''
			)}
		>
			<div
				className={clsx(
					'kbs-divider-svg-wrapper',
					dividerPosition ? `kbs-divider-position-${dividerPosition}` : ''
				)}
			>
				<div className="kbs-divider-svg" style={style} />
			</div>
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
		style.color = getColorOutput(dividerColor);
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
							{type === 'pattern' && <InlinePatternRender pattern={pattern} patternSize={patternSize} />}
							{type === 'divider' && <InlineDividerRender divider={pattern} />}
							{type === 'mask' && <InlineMaskRender mask={pattern} />}
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
	maskPosition,
	maskInverted,
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
				if (maskPosition === 'left' || maskPosition === 'right') {
					return sidePatterns.find((pattern) => pattern.value === value);
				} else if (maskInverted === 'enabled') {
					return sidePatterns.find((pattern) => pattern.value === value);
				}
				return patterns.find((pattern) => pattern.value === value);
			}
			if (inherited) {
				if (maskPosition === 'left' || maskPosition === 'right') {
					return sidePatterns.find((pattern) => pattern.value === inherited);
				} else if (maskInverted === 'enabled') {
					return sidePatterns.find((pattern) => pattern.value === inherited);
				}
				return patterns.find((pattern) => pattern.value === inherited);
			}
			return {};
		}, [inherited, value, maskPosition, maskInverted]);
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
							<InlinePatternRender
								patternSize={patternSize}
								patternColor={patternColor}
								patternBackground={patternBackground}
								pattern={currentItem}
							/>
						)}
						{type === 'divider' && (
							<InlineDividerRender
								dividerColor={patternColor}
								divider={currentItem}
								dividerWidth={dividerWidth}
								dividerHeight={dividerHeight}
								dividerPosition={maskPosition}
							/>
						)}
						{type === 'mask' && (
							<InlineMaskRender
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
	previewDevice = 'Desktop',
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
	maskPosition = undefined,
	dividerWidth = undefined,
	dividerHeight = undefined,
	layer = undefined,
	maskInverted = undefined,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};

	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const classes = clsx('kbs-popover-background-select-control__dropdown-content', globalClasses, {
		[`kbs-popover-select-type-${type}`]: type,
		[`kbs-popover-select-position-${maskPosition}`]: maskPosition,
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
						[`kbs-popover-select-position-${maskPosition}`]: maskPosition,
					})}
					contentClassName={classes}
					renderToggle={PopoverToggle({
						value,
						patterns,
						sidePatterns,
						maskPosition,
						type,
						inherited,
						patternColor,
						patternBackground,
						patternSize,
						dividerWidth,
						dividerHeight,
						layer,
						maskInverted,
					})}
					renderContent={PopoverDropdown({
						patterns,
						sidePatterns,
						maskPosition,
						value,
						onChange,
						previewDevice,
						type,
						patternColor,
						patternBackground,
						patternSize,
					})}
				/>
			</div>
		</div>
	);
}
