import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPONENTS } from '../handle-attribute-change/constants';
/**
 * Simple get a device attribute value.
 */
export default function getDeviceValue( attributeName, attributes, device, meta, type ) {
	
	const deviceSlug = getDeviceAttributeSlug( device );
	let deviceValue = '';
	if ( ! attributeName ) {
		return deviceValue;
	}
	if ( ! attributes ) {
		return deviceValue;
	}
	if ( ! attributes?.[ attributeName ] ) {
		return deviceValue;
	}
	//for devicless values like preset
	if ( device == 'none' ) {
		return attributes?.[attributeName]?.[type] ?? '';
	}
	if ( ! attributes?.[ attributeName ]?.[ deviceSlug ] ) {
		return deviceValue;
	}

	if( COMPONENTS.includes( meta?.component ) ) {
		return attributes?.[attributeName]?.[deviceSlug]?.[type] ?? '';
	}

	return attributes[ attributeName ][ deviceSlug ];
}
