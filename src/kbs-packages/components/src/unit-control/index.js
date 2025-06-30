/**
 * Range Control
 *
 */

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalUnitControl as CoreUnitControl } from '@wordpress/components';
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function UnitInputControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	type,
	globalStylesIds,
	placeholder = '',
	className = '',
	defaultValue = '',
	previewDevice = 'desktop',
	max = 200,
	min = 0,
	units = [],
	label = '',
	step = undefined,
	reset = true,
	hasDeviceControls = false,
	onChange,
	value,
	inheritedValue,
}) {
	const currentValue = value ? value : getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = inheritedValue
		? inheritedValue
		: getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);

	const defautOnChange = (value) => {
		handleAttributeChange(value, previewDevice, attributeName, attributes, setAttributes, undefined, type, meta);
	};

	const onChangeToUse = onChange ? onChange : defautOnChange;

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChangeToUse(resetValue, 'all', type);
	};
	const defaultUnits = [
		{
			value: 'px',
			label: 'px',
			a11yLabel: __('Pixels (px)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: '%',
			label: '%',
			a11yLabel: __('Percent (%)', 'kadence-blocks'),
			step: 0.1,
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
	];

	const controlUnits = units.length > 0 ? units : defaultUnits;

	// Return the JSX directly, not inside an array
	return (
		<div className={`components-base-control kbs-control kbs-unit-control${className ? ' ' + className : ''}`}>
			{label && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					hasAdvancedControls={false}
				/>
			)}
			<div className={'kbs-controls-content kbs-single-unit-control'}>
				<CoreUnitControl
					className={'kbs-input-control'}
					__next40pxDefaultSize={true}
					min={min}
					max={max}
					step={step}
					units={controlUnits}
					value={currentValue}
					placeholder={inherited?.inheritedValue || placeholder}
					disableUnits={false}
					onChange={onChangeToUse}
				/>
			</div>
		</div>
	);
}
