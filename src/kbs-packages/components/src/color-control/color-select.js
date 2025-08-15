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
	getGradientOptions,
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ColorSelector from './color-selector';
import ColorToggle from './color-toggle';
import ColorDropdown from './color-dropdown';
import { getColorLabel } from './utils';

export default function ColorSelect({
	value,
	inherited,
	type,
	reset = true,
	label,
	previewDevice = 'Desktop',
	onChange,
	defaultValue = undefined,
	globalClasses = [],
	isHover = false,
	hasGradient = false,
	hasGradientPalette = true,
	hasMix = false,
	hasPalette = true,
	globalStylesCss,
	hasToggleLabel = true,
	popoverProps = {},
	useGlobalPalette = false,
	hasCustomColors = true,
}) {
	const defaultPopoverProps = {
		placement: 'left-end',
		//offset: 36,
		shift: true,
	};
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const globalGradients = hasGradient ? getGradientOptions() : [];
	const isDisableCustomColors = !customColors ? true : false;

	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const classes = clsx('kbs-color-select-control__dropdown-content', globalClasses);
	return (
		<div className={`components-base-control kbs-control kbs-color-control`}>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				isCustom={false}
				hasCustomControls={false}
				isHover={isHover}
			/>
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={{ ...defaultPopoverProps, ...popoverProps }}
					className="kbs-color-select-control__dropdown"
					contentClassName={classes}
					renderToggle={ColorToggle({
						currentValue: value,
						inherited: inherited?.inheritedValue ? inherited.inheritedValue : '',
						colors: globalColors,
						gradients: globalGradients,
						hasToggleLabel,
						useGlobalPalette,
					})}
					renderContent={ColorDropdown({
						colors: globalColors,
						currentValue: value,
						inherited: inherited?.inheritedValue ? inherited.inheritedValue : '',
						onChange,
						previewDevice,
						type,
						hasGradient,
						hasMix,
						globalStylesCss,
						hasPalette,
						hasGradientPalette,
						hasCustomColors,
					})}
				/>
			</div>
		</div>
	);
}
