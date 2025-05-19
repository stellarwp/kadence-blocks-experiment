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
import { getColorOutput, getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ColorPicker from './color-picker';
import { getGlobalColors, getColorLabel, getColorHex } from './utils';
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

function renderColorDropdown(colors, currentValue, onChange, previewDevice, type, presetButtonRef) {
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
									<CheckedColorIndicator colorValue={getColorOutput(color)} isChecked={isActive} />
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
										color={getColorOutput(getColorHex(currentValue, presetButtonRef))}
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
	const globalStyles = getGlobalColors();
	const kadenceColors = [
		{
			color: 'var(--global-palette1,#2B6CB0)',
			slug: 'palette1',
			name: __('Accent', 'kadence-blocks'),
			category: __('Accent', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette2,#215387)',
			slug: 'palette2',
			name: __('Accent Alt', 'kadence-blocks'),
			category: __('Accent', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette3,#1A202C)',
			slug: 'palette3',
			name: __('Strongest Contrast', 'kadence-blocks'),
			category: __('Contrast', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette4,#2D3748)',
			slug: 'palette4',
			name: __('Strong Contrast', 'kadence-blocks'),
			category: __('Contrast', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette5,#4A5568)',
			slug: 'palette5',
			name: __('Medium Contrast', 'kadence-blocks'),
			category: __('Contrast', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette6,#718096)',
			slug: 'palette6',
			name: __('Subtle Contrast', 'kadence-blocks'),
			category: __('Contrast', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette7,#EDF2F7)',
			slug: 'palette7',
			name: __('Subtle Background', 'kadence-blocks'),
			category: __('Background', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette8,#F7FAFC)',
			slug: 'palette8',
			name: __('Lighter Background', 'kadence-blocks'),
			category: __('Background', 'kadence-blocks'),
		},
		{
			color: 'var(--global-palette9,#ffffff)',
			slug: 'palette9',
			name: __('Background Base', 'kadence-blocks'),
			category: __('Background', 'kadence-blocks'),
		},
	];
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
					contentClassName="kbs-color-select-control__dropdown-content"
					renderToggle={renderColorToggle(
						currentValue,
						inherited?.inheritedValue ? inherited.inheritedValue : ''
					)}
					renderContent={renderColorDropdown(
						[...kadenceColors, ...colors],
						currentValue,
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
