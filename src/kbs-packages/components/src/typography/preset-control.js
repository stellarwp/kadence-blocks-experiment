import clsx from 'clsx';
/**
 * WordPress libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
import { Button, Popover, Icon, Dropdown, ColorIndicator } from '@wordpress/components';
import { select } from '@wordpress/data';
import { close as closeIcon } from '@wordpress/icons';

/**
 * Internal libraries
 */
import {
	getPreviewValue,
	getPresetOptions,
	getInheritedDeviceValue,
	handleAttributeChange,
	getColorOutput,
	getFontSizeLabel,
} from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import TitleBar from '../title-bar';
import './editor.scss';

function PresetToggle({ currentValue, inherited, presets = [], hasToggleLabel = true, useGlobalPalette = false }) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx(
				'kbs-typography-preset-select-button',
				'kbs-typography-preset-select-control__toggle-button',
				{
					'is-open': isOpen,
					'is-selected': currentValue,
					'is-inherited': !currentValue && inherited,
				}
			),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};
		const displayValue = useMemo(() => {
			if (currentValue) {
				return currentValue;
			}
			return inherited;
		}, [inherited, currentValue]);
		const presetLabel = useMemo(() => {
			if (displayValue) {
				return presets.find((option) => option.value === displayValue)?.label;
			}
			return '';
		}, [displayValue, presets]);
		// const previewColorString = useMemo(() => {
		// 	if (displayValue) {
		// 		if (useGlobalPalette) {
		// 			return getGlobalColorOutput(displayValue);
		// 		}
		// 		return getColorOutput(displayValue);
		// 	}
		// 	return '';
		// }, [displayValue]);
		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					<span className="kbs-typography-preset-select-control__toggle-label">
						{presetLabel ? presetLabel : __('Unset', 'kadence-blocks')}
					</span>
					<span className="kbs-typography-preset-select-control__toggle-color" />
				</Button>
			</>
		);
	};
}
function PresetDropdown({ presets, currentValue, onChange, previewDevice, globalStylesCss, globalStylesIds }) {
	return ({ onToggle, isOpen }) => {
		return (
			<PresetDropdownContent
				presets={presets}
				currentValue={currentValue}
				onChange={onChange}
				previewDevice={previewDevice}
				globalStylesCss={globalStylesCss}
				globalStylesIds={globalStylesIds}
				onToggle={onToggle}
				isOpen={isOpen}
			/>
		);
	};
}
function PresetDropdownContent({
	presets,
	currentValue,
	onChange,
	previewDevice,
	globalStylesCss,
	globalStylesIds,
	onToggle,
	isOpen,
}) {
	// const { styleBookLocalGlobalStyles } = useSelect((select) => {
	// 	return {
	// 		styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getGlobalStylesComponentPresetsByStyleId(
	// 			globalStylesIds,
	// 			'components'
	// 		),
	// 	};
	// });
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, isOpen, divRef?.current]);
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		'typography',
		'presets'
	);
	const tempTypography = rawPresetData || {};
	return (
		<div
			className="kbs-typography-preset-list-wrapper kbs-typography-preset-select-control__dropdown-content"
			ref={divRef}
		>
			<div className="kbs-typography-preset-list-heading">
				<span className="kbs-typography-preset-list-heading-label">
					{__('Typography Presets', 'kadence-blocks')}
				</span>
			</div>
			<div className="kbs-typography-preset-list">
				{presets.map((item, index) => {
					let fontFamily =
						tempTypography?.[item.value]?.attributes?.desktop?.fontFamily || __('Unset', 'kadence-blocks');
					if (fontFamily === 'var(--kbs-font-family-heading)') {
						fontFamily = __('Heading Font Family', 'kadence-blocks');
					} else if (fontFamily === 'var(--kbs-font-family-body)') {
						fontFamily = __('Body Font Family', 'kadence-blocks');
					}
					return (
						<Button
							key={index}
							onClick={() => {
								onChange(item.value);
							}}
							isPressed={item.value === currentValue}
							className="kbs-typography-control-btn"
						>
							<div className="kbs-typography-control-label-wrap">
								<div
									className="kbs-typography-control-label"
									style={{
										fontFamily: tempTypography?.[item.value]?.attributes?.desktop?.fontFamily,
										fontWeight: tempTypography?.[item.value]?.attributes?.desktop?.fontWeight,
										letterSpacing: tempTypography?.[item.value]?.attributes?.desktop?.letterSpacing,
									}}
								>
									{item.label}
								</div>
								<ColorIndicator
									colorValue={getColorOutput(
										tempTypography?.[item.value]?.attributes?.desktop?.color
									)}
									className="kbs-typography-control-color-indicator"
								/>
							</div>
							<div className="kbs-typography-control-meta">
								<div className="kbs-typography-control-family">{fontFamily}</div>
								<div className="kbs-typography-control-size">
									<span className="kbs-typography-control-size-value">
										{getFontSizeLabel(
											tempTypography?.[item.value]?.attributes?.desktop?.fontSize
										) || __('Unset', 'kadence-blocks')}
									</span>
									<span className="kbs-typography-control-size-divider">/</span>
									<span className="kbs-typography-control-weight-value">
										{tempTypography?.[item.value]?.attributes?.desktop?.fontWeight ||
											__('Unset', 'kadence-blocks')}
									</span>
								</div>
							</div>
						</Button>
					);
				})}
			</div>
			<div className="kbs-typography-preset-list-close">
				<Button __next40pxDefaultSize onClick={onToggle}>
					<Icon icon={closeIcon} size={24} />
				</Button>
			</div>
		</div>
	);
}

export default function TypographyPresetControl({
	label,
	reset = true,
	attributes,
	setAttributes,
	attributeName,
	metaData,
	previewDevice,
	customOnChange,
	globalStylesCss,
	previewAmount = 3,
	popoverProps = {},
	definedPresets = [],
	globalStylesIds,
	view = 'default',
}) {
	const defaultPopoverProps = {
		placement: 'left-end',
		//offset: 36,
		shift: true,
	};
	const attributeMeta = metaData?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return null;
	}
	// Fetch available presets
	const presets = getPresetOptions(presetType);
	const currentValue = attributes?.[attributeName]?.preset;
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
	const onChange = (value) => {
		if (attributes?.[attributeName]?.preset === value) {
			return;
		}
		handleAttributeChange(
			value,
			'none',
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			'preset',
			metaData
		);
	};

	const onReset = () => {
		onChange(undefined);
	};
	const classes = clsx('kbs-typography-preset-select-control__dropdown-content');
	return (
		<div
			className={`components-base-control kbs-control kbs-radio-preset-control kbs-radio-preset-control-${presetType}`}
		>
			<TitleBar label={label} reset={reset} onReset={onReset} hasDeviceControls={false} />
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={{ ...defaultPopoverProps, ...popoverProps }}
					className="kbs-typography-preset-select-control__dropdown"
					contentClassName={classes}
					renderToggle={PresetToggle({
						currentValue,
						inherited: '',
						presets,
						hasToggleLabel: true,
						useGlobalPalette: false,
					})}
					renderContent={PresetDropdown({
						presets,
						currentValue,
						inherited: '',
						onChange,
						previewDevice,
						globalStylesCss,
						globalStylesIds,
					})}
				/>
			</div>
		</div>
	);
}
