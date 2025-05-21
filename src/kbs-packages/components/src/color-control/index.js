/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, ColorIndicator, Button, HStack, FlexItem, TabPanel } from '@wordpress/components';
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
import TitleBar from '../title-bar';
import ColorPicker from './color-picker';
import { getColorLabel, getColorHex } from './utils';
import './editor.scss';

const CheckedColorIndicator = ({ colorValue, isChecked = false }) => (
	<div className="kbs-color-select-control__checked-color-indicator">
		<ColorIndicator className="kbs-color-select-control__color-indicator" colorValue={colorValue} />
		{isChecked && <Icon className="kbs-color-select-control__checked-color-icon" icon={checkIcon} size={24} />}
	</div>
);

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
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					{isPaletteColor && (
						<Icon className="kbs-color-select-control__toggle-icon" icon={colorIcon} size={24} />
					)}
					<span className="kbs-color-select-control__toggle-label">
						{displayValue ? getColorLabel(displayValue, colors) : __('Unset', 'kadence-blocks')}
					</span>
					<ColorIndicator
						className="kbs-color-select-control__toggle-preview"
						colorValue={previewColorString}
					/>
				</Button>
			</>
		);
	};
}

function renderColorDropdown(colors, currentValue, inherited, onChange, previewDevice, type, presetButtonRef) {
	return ({ onToggle, isOpen }) => {
		// Memoize the colors by category
		const themeLabel = __('Theme', 'kadence-blocks');
		const colorsByCategory = colors.reduce((acc, color) => {
			acc[color?.category || themeLabel] = [...(acc[color?.category || themeLabel] || []), color];
			return acc;
		}, {});
		const paletteDropdown = Object.entries(colorsByCategory).map(([category, colors]) => {
			return (
				<div key={category} className="kbs-color-select-control__dropdown-category-inner">
					<h2 className="kbs-color-select-control__dropdown-category-title">{category}</h2>
					<div className="kbs-color-select-control__dropdown-category-palette-inner">
						{colors.map(({ color, slug, name }) => {
							const palette = slug.replace('theme-', '');
							const isActive =
								palette === currentValue ||
								(!slug.startsWith('theme-palette') && currentValue === color);
							const isGlobal = slug.startsWith('palette');
							return (
								<Button
									key={slug}
									__next40pxDefaultSize
									className={clsx(
										'kbs-color-select-button',
										'kbs-color-select-control__select-button',
										{
											'is-selected': isActive,
										}
									)}
									label={name ? name : getColorLabel(color, colors)}
									onClick={() => {
										if (slug.startsWith('theme-palette') || slug.startsWith('palette')) {
											onChange(palette, previewDevice, type);
										} else {
											onChange(color, previewDevice, type);
										}
									}}
								>
									<CheckedColorIndicator
										colorValue={getColorOutput(isGlobal ? palette : color)}
										isChecked={isActive}
									/>
								</Button>
							);
						})}
					</div>
				</div>
			);
		});
		const defaultTabs = [
			{
				name: 'storybook',
				title: __('Storybook', 'kadence-blocks'),
			},
			{
				name: 'custom',
				title: __('Custom', 'kadence-blocks'),
			},
		];
		const handleColorChange = (color) => {
			onChange(color, previewDevice, type);
		};
		return (
			<div className="kbs-color-control kbs-color-select-control__dropdown-content-inner">
				<TabPanel className="kbs-color-select-tabs" activeClass="is-active" tabs={defaultTabs}>
					{(tab) => {
						if (tab.name) {
							if ('custom' === tab.name) {
								return (
									<ColorPicker
										color={getColorOutput(
											getColorHex(currentValue ? currentValue : inherited, presetButtonRef)
										)}
										onChange={handleColorChange}
									/>
								);
							} else {
								return paletteDropdown;
							}
						}
					}}
				</TabPanel>
				<div className="kbs-color-select-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}

export default function ColorControl({
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
	forStyleBook = false,
	defaultValue,
	customOnChange,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const [colors, customColors] = useSettings('color.palette', 'color.custom');
	const presetButtonRef = useRef(undefined);
	const globalColors = getColorOptions();
	const isDisableCustomColors = !customColors ? true : false;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
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
	// Remove Kadence Theme Colors from the colors array
	const themeColors = useMemo(() => {
		let additionalThemeColors = JSON.parse(JSON.stringify(colors));
		if (window?.kbs_params?.isKadenceTheme) {
			additionalThemeColors = additionalThemeColors.filter((color) => !color.slug.startsWith('theme-palette'));
		}
		return additionalThemeColors;
	}, [colors]);
	return (
		<div className={`components-base-control kbs-control kbs-color-control`}>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={advancedControls && advancedControls.length > 0}
				isCustom={isCustom}
				onToggleCustom={() => setIsCustom(!isCustom)}
				hasCustomControls={hasCustomControls}
			/>
			<div className="kbs-control-inner">
				<Dropdown
					ref={presetButtonRef}
					popoverProps={popoverProps}
					className="kbs-color-select-control__dropdown"
					contentClassName={classes}
					renderToggle={renderColorToggle(
						currentValue,
						inherited?.inheritedValue ? inherited.inheritedValue : '',
						[...globalColors, ...themeColors]
					)}
					renderContent={renderColorDropdown(
						[...globalColors, ...themeColors],
						currentValue,
						inherited?.inheritedValue ? inherited.inheritedValue : '',
						onChange,
						previewDevice,
						type,
						presetButtonRef
					)}
				/>
			</div>
		</div>
	);
}
