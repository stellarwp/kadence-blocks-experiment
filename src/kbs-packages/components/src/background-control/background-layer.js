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
import { useRef, useMemo } from '@wordpress/element';
import { color as colorIcon, check as checkIcon, close as closeIcon } from '@wordpress/icons';
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
import ColorSelector from '../color-control/color-selector';
import { getColorLabel } from '../color-control/utils';

function renderColorToggle(currentValue, inherited, colors) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx('kbs-color-select-button', 'kbs-color-select-control__toggle-button', {
				'is-open': isOpen,
				'is-selected': currentValue,
				'is-inherited': !currentValue && inherited,
			}),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};
		const isPaletteColor = useMemo(() => {
			return (
				(currentValue && currentValue.startsWith('palette')) || (inherited && inherited.startsWith('palette'))
			);
		}, [currentValue, inherited]);
		const displayValue = useMemo(() => {
			if (currentValue) {
				return currentValue;
			}
			return inherited;
		}, [inherited, currentValue]);
		const previewColorString = useMemo(() => {
			if (displayValue) {
				return getColorOutput(displayValue);
			}
			return '';
		}, [displayValue]);
		return (
			<div className="kbs-background-layer-toggle">
				<Button __next40pxDefaultSize {...toggleProps}>
					{isPaletteColor && (
						<Icon className="kbs-color-select-control__toggle-icon" icon={colorIcon} size={24} />
					)}
					<span className="kbs-color-select-control__toggle-label">
						{displayValue ? getColorLabel(displayValue, colors) : __('Unset', 'kadence-blocks')}
					</span>
					<CoreColorIndicator
						className="kbs-color-select-control__toggle-preview"
						colorValue={previewColorString}
					/>
				</Button>
			</div>
		);
	};
}

function renderColorDropdown(colors, currentValue, inherited, onChange, previewDevice, type) {
	return ({ onToggle, isOpen }) => {
		const handleColorChange = (color) => {
			onChange(color, previewDevice, type);
		};
		return (
			<div className="kbs-color-control kbs-color-select-control__dropdown-content-inner">
				<ColorSelector
					handleColorChange={handleColorChange}
					colors={colors}
					currentValue={currentValue}
					inherited={inherited}
				/>
				<div className="kbs-color-select-control__dropdown-content-close">
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
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);
	const classes = clsx('kbs-color-select-control__dropdown-content', globalClasses);
	return (
		<div key={layerKey} className={`components-base-control kbs-control kbs-color-control`}>
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={popoverProps}
					className="kbs-color-select-control__dropdown"
					contentClassName={classes}
					renderToggle={renderColorToggle(
						currentValue,
						inherited?.inheritedValue ? inherited.inheritedValue : '',
						globalColors
					)}
					renderContent={renderColorDropdown(
						globalColors,
						currentValue,
						inherited?.inheritedValue ? inherited.inheritedValue : '',
						onChange,
						previewDevice,
						type
					)}
				/>
			</div>
		</div>
	);
}
