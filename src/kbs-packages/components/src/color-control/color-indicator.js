import { ColorIndicator as CoreColorIndicator, Icon } from '@wordpress/components';
import { check as checkIcon } from '@wordpress/icons';

const ColorIndicator = ({ colorValue, isChecked = false }) => (
	<div className="kbs-color-select-control__checked-color-indicator">
		<CoreColorIndicator className="kbs-color-select-control__color-indicator" colorValue={colorValue} />
		{isChecked && <Icon className="kbs-color-select-control__checked-color-icon" icon={checkIcon} size={24} />}
	</div>
);
export default ColorIndicator;
