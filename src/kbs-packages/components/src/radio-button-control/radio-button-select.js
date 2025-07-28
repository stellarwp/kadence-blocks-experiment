/**
 * Responsive Radio Button Control
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { getDeviceValue, getInheritedDeviceValue, GlobalStylesContext } from '@kadence/kbsHelpers';
import { handleAttributeChange, isAdvancedOption, isCustomOption } from '@kadence/kbsHelpers';
import { useEffect, useState } from '@wordpress/element';
import { getRadioConfig } from './controls-config';
import TitleBar from '../title-bar';

/**
 * Build the Radio Button Select.
 */
export default function RadioButtonSelect({
	label,
	onChange,
	defaultValue = undefined,
	value,
	inherited,
	isCollapsed = false,
	type = '',
	radioType = 'textAlign',
	reset = true,
	previewDevice = 'Desktop',
	previewDirection = 'column',
	hasCustomControls = false,
	view = 'default',
	labelPosition = 'top',
	initialPosition = null,
	units = [],
	min = null,
	max = null,
	placeholder = '',
	isHover = false,
	step = null,
	color = '',
	baseColor = '',
	shadeType = 'shade',
	defaultUnit = 'px',
	hue = 0,
	lightness = 0,
	chroma = 0,
}) {
	const radioConfig = type ? type : radioType;
	const { UIComponent, controls, advancedControls } = getRadioConfig(radioConfig, previewDirection);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'Desktop' === previewDevice ? 'all' : previewDevice, type);
	};
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const [isCustom, setIsCustom] = useState(false);
	useEffect(() => {
		if (view !== 'advanced' && value && advancedControls) {
			setIsAdvanced(isAdvancedOption(controls, advancedControls, value));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);
	useEffect(() => {
		if (!isCustom && value && hasCustomControls) {
			setIsCustom(isCustomOption(controls, value));
		}
	}, [value]);

	return (
		<div className={`components-base-control kbs-control kbs-radio-control kbs-radio-control-${radioConfig}`}>
			{label && 'top' === labelPosition && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={false}
					isAdvanced={isAdvanced}
					onToggleView={() => setIsAdvanced(!isAdvanced)}
					hasAdvancedControls={advancedControls && advancedControls.length > 0}
					isCustom={isCustom}
					onToggleCustom={() => setIsCustom(!isCustom)}
					hasCustomControls={hasCustomControls}
					previewDevice={previewDevice}
					isHover={isHover}
				/>
			)}
			<div className="kbs-control-inner">
				<UIComponent
					value={value}
					label={label}
					color={color}
					baseColor={baseColor}
					hue={hue}
					lightness={lightness}
					chroma={chroma}
					placeholder={placeholder}
					labelPosition={labelPosition}
					isCollapsed={isCollapsed}
					inherited={inherited}
					onChange={(itemValue) => onChange(itemValue, previewDevice, type)}
					controls={isAdvanced && advancedControls?.length > 0 ? advancedControls : controls}
					isCustom={isCustom}
					type={type}
					units={units}
					initialPosition={initialPosition}
					min={min}
					max={max}
					step={step}
					shadeType={shadeType}
					defaultUnit={defaultUnit}
				/>
			</div>
		</div>
	);
}
