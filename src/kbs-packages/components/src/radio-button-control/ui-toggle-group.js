/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

function RadioToggleGroupButtonUI({
	value,
	onChange,
	inherited,
	controls = [],
	isDeselectable = true,
	label = __('Align', 'kadence-blocks'),
	isPreset = false,
}) {
	const inheritedValue = isPreset ? inherited?.inheritedValue?.preset : inherited?.inheritedValue;
	return (
		<ToggleGroupControl
			className="kbs-radio-button-control__toggle-group"
			hideLabelFromVision={true}
			label={label}
			onChange={(value) => onChange(value)}
			value={value ? value : undefined}
			isDeselectable={isDeselectable}
			isBlock={true}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		>
			{map(controls, ({ key, title, icon, name }) =>
				icon ? (
					<ToggleGroupControlOptionIcon
						className={`kbs-radio-button-control__toggle_item${value === key ? ' kb-is-pressed' : ''}${!value && key === inheritedValue ? ' kb-is-inherited' : ''}`}
						key={key}
						label={title}
						icon={icon}
						value={key}
					/>
				) : (
					<ToggleGroupControlOption
						className={`kbs-radio-button-control__toggle_item${value === key ? ' kb-is-pressed' : ''}${!value && key === inheritedValue ? ' kb-is-inherited' : ''}`}
						key={key}
						label={name}
						aria-label={title}
						showTooltip={true}
						value={key}
					/>
				)
			)}
		</ToggleGroupControl>
	);
}

export default RadioToggleGroupButtonUI;
