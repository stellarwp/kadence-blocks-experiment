/**
 * Responsive Radio Button Control
 *
 */

/**
 * Internal block libraries
 */
import { __, _x } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { getDeviceValue, getInheritedDeviceValue, GlobalStylesContext } from '@kadence/kbsHelpers';
import { handleAttributeChange, isAdvancedOption, isCustomOption } from '@kadence/kbsHelpers';
import { useEffect, useState } from '@wordpress/element';
import { getRadioConfig } from './controls-config';
import TitleBar from '../title-bar';

import './editor.scss';

/**
 * Build the Radio Button control.
 */
export default function RadioButtonControl({
	label,
	customOnChange,
	defaultValue,
	attributeName,
	options,
	attributes,
	setAttributes,
	isCollapsed = false,
	type = '',
	radioType = 'textAlign',
	reset = true,
	previewDevice = 'desktop',
	meta,
	previewDirection = 'column',
	hasDeviceControls = false,
	hasCustomControls = false,
	view = 'default',
	units = [],
	defaultUnit = 'px',
	onChange = null,
	min = null,
	max = null,
	step = null,
}) {
	// Get the globalStylesIds from context
	const globalStylesIds = useContext(GlobalStylesContext);
	const radioConfig = type ? type : radioType;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	let inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);

	// If type ends with "Hover" and no inherited value found, check the non-hover type
	if (type && type.endsWith('Hover') && (!inherited || !inherited.inheritedValue)) {
		const normalType = type.replace(/Hover$/, '');
		const normalValue = getDeviceValue(attributeName, attributes, previewDevice, normalType);
		if (normalValue) {
			inherited = {
				inheritedValue: normalValue,
				inheritedSource: 'parent',
				inheritedType: 'parent',
			};
		}
	}

	const { UIComponent, UIComponentAdvanced, controls, advancedControls } = getRadioConfig(
		radioConfig,
		previewDirection
	);
	const defaultOnChange = (value, device, type) => {
		if (type == 'borderRadius' && !Array.isArray(value) && !isAdvanced) {
			value = [value, value, value, value];
		}
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	const onChangeToUse = onChange ? onChange : defaultOnChange;
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChangeToUse(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
	};
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const [isCustom, setIsCustom] = useState(false);
	useEffect(() => {
		if (view !== 'advanced' && currentValue && (advancedControls || UIComponentAdvanced)) {
			setIsAdvanced(isAdvancedOption(controls, advancedControls, currentValue));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);
	useEffect(() => {
		if (!isAdvanced && currentValue && (advancedControls || UIComponentAdvanced)) {
			setIsAdvanced(isAdvancedOption(controls, advancedControls, currentValue));
		}
		if (!isCustom && currentValue && hasCustomControls) {
			setIsCustom(isCustomOption(controls, currentValue));
		}
	}, [currentValue]);

	const UIComponentToUse = isAdvanced && UIComponentAdvanced ? UIComponentAdvanced : UIComponent;

	let normalizedValue = currentValue;
	if (type == 'borderRadius' && Array.isArray(currentValue) && !isAdvanced) {
		normalizedValue = currentValue[0];
	}

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

	return (
		<div className={`components-base-control kbs-control kbs-radio-control kbs-radio-control-${radioConfig}`}>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={(advancedControls && advancedControls.length > 0) || UIComponentAdvanced}
				isCustom={isCustom}
				onToggleCustom={() => setIsCustom(!isCustom)}
				hasCustomControls={hasCustomControls}
			/>
			<div className="kbs-control-inner">
				<UIComponentToUse
					value={normalizedValue}
					label={label}
					inherited={inherited}
					isCollapsed={isCollapsed}
					onChange={(itemValue) => onChangeToUse(itemValue, previewDevice, type)}
					controls={isAdvanced && advancedControls?.length > 0 ? advancedControls : controls}
					isCustom={isCustom}
					type={type}
					units={units.length > 0 ? units : defaultUnits}
					defaultUnit={defaultUnit}
					min={min}
					max={max}
					step={step}
				/>
			</div>
		</div>
	);
}
