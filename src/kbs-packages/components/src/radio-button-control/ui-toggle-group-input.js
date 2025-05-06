/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import RadioToggleGroupButtonUI from './ui-toggle-group';
function RadioToggleGroupInputUI({
	value,
	onChange,
	inherited,
	controls = [],
	label = __('Gap', 'kadence-blocks'),
	isCustom = false,
}) {
	return (
		<div key={label} className="kadence-radio-button-control__toggle-group-input">
			{!isCustom && (
				<RadioToggleGroupButtonUI
					value={value}
					onChange={onChange}
					inherited={inherited}
					controls={controls}
					label={label}
				/>
			)}
			{isCustom && <UnitControl __next40pxDefaultSize={true} value={value} onChange={onChange} />}
		</div>
	);
}

export default RadioToggleGroupInputUI;
