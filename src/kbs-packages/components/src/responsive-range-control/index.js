import { RangeControl } from '@wordpress/components';
import TitleBar from '../title-bar';
import { __ } from '@wordpress/i18n';
import { handleAttributeChange, getResolvedValue } from '@kadence/kbsHelpers';
import InheritanceIndicator from '../inheritance-indicator';
export default function ResponsiveRangeControl({
	label,
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	customOnChange,
	min,
	max,
	type,
	initialPosition = null,
	step = 1,
	globalStylesIds
}) {

	const attributeMeta = meta?.attributes?.[attributeName];
	const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue, inheritedType } = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type,
		globalStylesIds
	);
	
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
			'fontWeight',
			attributeMeta
		);
	};

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
					value={ appliedValue }
					min={ min }
					max={ max }
					step={ step }
					initialPosition={ initialPosition }
				/>
			</div>
			<InheritanceIndicator inheritedSource={inheritedSource} inheritedType={inheritedType} />
		</div>
	);
}
