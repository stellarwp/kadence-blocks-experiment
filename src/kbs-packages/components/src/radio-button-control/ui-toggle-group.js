/**
 * WordPress dependencies
 */
import classnames from 'classnames';
import { __, isRTL } from '@wordpress/i18n';
import { map } from 'lodash';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { alignLeft, alignRight, alignCenter } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import { TEXT_ALIGNMENT_OPTIONS } from './constants';

function RadioToggleGroupButtonUI({
	value,
	onChange,
	inherited,
	controls = TEXT_ALIGNMENT_OPTIONS,
	label = __('Align text', 'kadence-blocks'),
}) {
	return (
		<ToggleGroupControl
			className="kadence-radio-button-control__toggle-group"
			hideLabelFromVision={true}
			label={label}
			onChange={(value) => onChange(value)}
			value={value}
			isDeselectable={true}
			isBlock={true}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		>
			{map(controls, ({ align, title, icon }) => (
				<ToggleGroupControlOptionIcon
					className={`kadence-radio-button-control__toggle_item${value === align ? ' kb-is-pressed' : ''}${!value && align === inherited?.inheritedValue ? ' kb-is-inherited' : ''}`}
					key={align}
					label={title}
					icon={icon}
					value={align}
				/>
			))}
		</ToggleGroupControl>
	);
}

export default RadioToggleGroupButtonUI;
