import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPONENTS } from '../constants';
/**
 * Simple get a device attribute value.
 */
export default function getDeviceValue( attributeName, attributes, device, type = null ) {
	
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
	// for deviceless values like preset
	if ( device === 'none' ) {
		if ( type ) {
			return attributes?.[attributeName]?.[type] ?? '';
		}
		return attributes?.[attributeName] ?? '';
	}
	// If there are no device specific values, return empty string.
	if ( ! attributes?.[ attributeName ]?.[ deviceSlug ] ) {
		return deviceValue;
	}
	// If the attribute is part of a component, return the device specific value for the sub-attribute or if the subAttribute is set.
	if( type ) {
		return attributes?.[attributeName]?.[deviceSlug]?.[type] ?? '';
	}
	// Return the device specific value for the attribute.
	return attributes[ attributeName ][ deviceSlug ];
}
