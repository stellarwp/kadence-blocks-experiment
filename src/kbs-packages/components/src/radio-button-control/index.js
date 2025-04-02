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
import { handleAttributeChange } from '@kadence/kbsHelpers';
import { useEffect } from '@wordpress/element';
import { getRadioConfig } from './controls-config';
import TitleBar from '../title-bar';

import './editor.scss';

/**
 * Build the Radio Button control.
 */
export default function RadioButtonControl( {
	label,
	customOnChange,
	defaultValue,
	attributeName,
	options,
	initial,
	attributes,
	setAttributes,
	isCollapsed = false,
	type = 'textAlign',
	reset = true,
	previewDevice,
	meta,
	previewDirection = 'column',
} ) {
	// Get the globalStylesIds from context
	const globalStylesIds = useContext(GlobalStylesContext);
	
	const radioType = meta?.property ? meta?.property : type;
	const initialValue = meta?.initial ? meta?.initial : initial;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice);
	const inheritedValue = getInheritedDeviceValue(attributeName, attributes, previewDevice, initialValue, meta, type, globalStylesIds);
	const { UIComponent, controls } = getRadioConfig(radioType, previewDirection);

	const onReset = () => {
		let resetValue = undefined;
		if ( defaultValue ) {
			resetValue = defaultValue;
		}
		onChange( resetValue, 'all' );
	}
	const onChange = (value, device, type) => {
		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			meta
		);
	};

	return (
		<div className={ `components-base-control kbs-control kbs-radio-control kbs-radio-control-${ radioType }` }>
			<TitleBar
				label={ label }
				reset={ reset }
				onReset={ onReset }
				hasDeviceControls={true}
			/>
			<div className="kbs-control-inner">
				<UIComponent
					value={ currentValue }
					inherited={ inheritedValue }
					isCollapsed={ isCollapsed }
					onChange={ ( itemValue ) => onChange( itemValue, previewDevice ) }
					controls={ controls ? controls : undefined }
				/>
			</div>
		</div>
	);
}
