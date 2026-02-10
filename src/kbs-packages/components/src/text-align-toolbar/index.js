/**
 * WordPress dependencies
 */
import { AlignmentToolbar } from '@wordpress/block-editor';
import { getDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import { useSelect } from '@wordpress/data';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function TextAlignToolbar(props) {
	const {
		value,
		onChange,
		attributes,
		setAttributes,
		metadata,
		attributeName = 'textAlign',
		type = 'textAlign',
	} = props;

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);

	const defaultOnChange = (value) => {
		handleAttributeChange(value, previewDevice, attributeName, attributes, setAttributes, null, type, metadata);
	};
	const deviceValue = getDeviceValue(attributeName, attributes, previewDevice, type) || '';
	const onChangeToUse = onChange || defaultOnChange;
	const valueToUse = value || deviceValue;

	return <AlignmentToolbar value={valueToUse} onChange={onChangeToUse} />;
}
