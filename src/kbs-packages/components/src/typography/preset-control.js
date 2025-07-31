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
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import RadioToggleGroupButtonUI from '../radio-button-control/ui-toggle-group';
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
					<span className="kbs-color-select-control__toggle-label">
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
			/>
		);
	};
}
function PresetDropdownContent({ presets, currentValue, onChange, previewDevice, globalStylesCss, globalStylesIds }) {
	// const { styleBookLocalGlobalStyles } = useSelect((select) => {
	// 	return {
	// 		styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getGlobalStylesComponentPresetsByStyleId(
	// 			globalStylesIds,
	// 			'components'
	// 		),
	// 	};
	// });
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		'typography',
		'presets'
	);
	const tempTypography = rawPresetData || {};
	return (
		<>
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
								colorValue={getColorOutput(tempTypography?.[item.value]?.attributes?.desktop?.color)}
								className="kbs-typography-control-color-indicator"
							/>
						</div>
						<div className="kbs-typography-control-meta">
							<div className="kbs-typography-control-family">{fontFamily}</div>
							<div className="kbs-typography-control-size">
								<span className="kbs-typography-control-size-value">
									{getFontSizeLabel(tempTypography?.[item.value]?.attributes?.desktop?.fontSize) ||
										__('Unset', 'kadence-blocks')}
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
		</>
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
	// Get the first three presets in a custom array
	const presetOptions = definedPresets.length > 0 ? definedPresets : presets.slice(0, previewAmount);
	const hasRadioToggle = definedPresets.length > 0 ? true : false;
	const currentValue = attributes?.[attributeName]?.preset;

	const [isPopover, setIsPopover] = useState(false);
	const [showConfirmPopover, setShowConfirmPopover] = useState(false);
	const [pendingPreset, setPendingPreset] = useState(null);
	const [confirmAnchor, setConfirmAnchor] = useState(null);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [radioToggleAnchor, setRadioToggleAnchor] = useState(null);
	const [popoverPlacement, setPopoverPlacement] = useState('top-start');
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, isPopover, divRef?.current]);
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
						currentValue: currentValue,
						inherited: '',
						presets: presets,
						hasToggleLabel: true,
						useGlobalPalette: false,
					})}
					renderContent={PresetDropdown({
						presets: presets,
						currentValue: currentValue,
						inherited: '',
						onChange: onChange,
						previewDevice: previewDevice,
						globalStylesCss: globalStylesCss,
						globalStylesIds: globalStylesIds,
					})}
				/>
			</div>
			{/* {isPopover && popoverAnchor && (
				<Popover
					anchor={popoverAnchor}
					noArrow={true}
					placement="left-start"
					shift={true}
					offset={10}
					onClose={() => {
						setIsPopover(false);
					}}
					className="kbs-preset-popover__dropdown-content kbs-radio-preset-control"
				>
					<TitleBar label={label} reset={false} />
					<div ref={divRef} className={`kbs-control-inner kbs-radio-preset-control-inner`}>
						{presets.map((option) => (
							<Button
								key={option.value}
								label={option.label}
								isPressed={option.value === currentValue}
								className={`kbs-radio-preset-control-button`}
								onClick={(event) => {
									onChange(option.value);
								}}
							>
								{option.label}
							</Button>
						))}
					</div>
					<div className="kbs-preset-popover__dropdown-content-close">
						<Button __next40pxDefaultSize onClick={() => setIsPopover(false)}>
							<Icon icon={closeIcon} size={24} />
						</Button>
					</div>
				</Popover>
			)}
			{hasRadioToggle && (
				<div className="kbs-radio-control">
					<div ref={setRadioToggleAnchor} className="kbs-control-inner kbs-radio-toggle-control-inner">
						<RadioToggleGroupButtonUI
							label={label}
							value={currentValue}
							onChange={(value) => {
								const target = radioToggleAnchor.querySelector(`[data-value="${value}"]`);
								setConfirmAnchor(target ? target : radioToggleAnchor);
								setPopoverPlacement('top-start');
								onChange(value);
							}}
							controls={presetOptions}
						/>
					</div>
				</div>
			)}
			{!hasRadioToggle && (
				<div className="kbs-control-inner kbs-radio-preset-control-inner">
					{presetOptions.map((option) => (
						<Button
							key={option.value}
							label={option.label}
							isPressed={option.value === currentValue}
							className={`kbs-radio-preset-control-button`}
							onClick={(event) => {
								setConfirmAnchor(event.currentTarget);
								setPopoverPlacement('top-start');
								onChange(option.value);
							}}
						>
							{option.label}
						</Button>
					))}
				</div>
			)} */}
		</div>
	);
}
