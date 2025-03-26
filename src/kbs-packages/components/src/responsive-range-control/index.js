import { RangeControl } from '@wordpress/components';
import TitleBar from '../title-bar';
import { __ } from '@wordpress/i18n';
import { handleAttributeChange, getDeviceValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';

const ATTRIBUTE_NAME = 'fontWeight';

export default function ResponsiveRangeControl({
	label,
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesJson,
	customOnChange,
	forStyleBook,
	min,
	max,
	initialPosition = null,
	step = 1,
}) {

	const onReset = () => {
		let resetValue = '';
		onChange( resetValue, 'all' );
	}
	const onChange = (value, device) => {
		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			ATTRIBUTE_NAME,
			meta
		);
	};

	const initialValue = meta?.initial ? meta?.initial : initial ? initial : '';
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, meta, ATTRIBUTE_NAME);
	const inheritedValue = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		initialValue,
		meta,
		ATTRIBUTE_NAME,
		globalStylesJson
	);
	const actualValue = currentValue || inheritedValue;

	return (
		<div className={ `components-base-control kbs-control kbs-radio-control kbs-radio-control` }>
			<TitleBar
				label={ label }
				reset={ true }
				onReset={ onReset }
				hasDeviceControls={true}
			/>
			<div className="kbs-control-inner">
				<RangeControl
					key={ previewDevice }
					onChange={ ( value ) => onChange( value, previewDevice ) }
					value={ actualValue }
					min={ min }
					max={ max }
					step={ step }
					initialPosition={ initialPosition }
				/>
			</div>
		</div>
	);
}
