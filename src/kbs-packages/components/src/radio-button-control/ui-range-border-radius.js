import { __ } from '@wordpress/i18n';
import InputUIControl from './ui-input';

/**
 * BorderRadiusRangeUIControls Component
 *
 * A component that presents four separate InputUIControl components for each corner of a border.
 * It has a combined onChange method that puts together each corner value into an array.
 */
function BorderRadiusRangeUIControls({
	value = ['', '', '', ''],
	onChange,
	controls = [],
	units,
	placeholder = '',
	inherited,
}) {
	// Handle individual corner changes
	const handleCornerChange = (cornerIndex, cornerValue) => {
		if (typeof onChange !== 'function') {
			return;
		}
		switch (cornerIndex) {
			case 0:
				onChange([cornerValue, value[1], value[2], value[3]]);
				break;
			case 1:
				onChange([value[0], cornerValue, value[2], value[3]]);
				break;
			case 2:
				onChange([value[0], value[1], cornerValue, value[3]]);
				break;
			case 3:
				onChange([value[0], value[1], value[2], cornerValue]);
				break;
		}
	};

	// Corner configurations
	const corners = [
		{
			index: 0,
			label: __('Top Left', 'kadence-blocks'),
			value: value[0],
		},
		{
			index: 1,
			label: __('Top Right', 'kadence-blocks'),
			value: value[1],
		},
		{
			index: 2,
			label: __('Bottom Right', 'kadence-blocks'),
			value: value[2],
		},
		{
			index: 3,
			label: __('Bottom Left', 'kadence-blocks'),
			value: value[3],
		},
	];

	return (
		<div className="kbs-border-radius-range-controls">
			{corners.map((corner) => (
				<InputUIControl
					key={corner.index}
					value={corner.value}
					onChange={(newValue) => handleCornerChange(corner.index, newValue)}
					controls={controls}
					units={units}
					placeholder={placeholder}
					inherited={inherited}
				/>
			))}
		</div>
	);
}

export default BorderRadiusRangeUIControls;
