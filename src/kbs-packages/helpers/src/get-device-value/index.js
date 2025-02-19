import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPLEX_TYPES } from '../handle-attribute-change/constants';
/**
 * Simple get a device attribute value.
 */
export default function getDeviceValue( attributeName, attributes, device, type ) {
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
	if ( ! attributes?.[ attributeName ]?.[ deviceSlug ] ) {
		return deviceValue;
	}

	if( COMPLEX_TYPES.includes( type ) ) {
		return attributes?.[attributeName]?.[deviceSlug]?.[type] ?? '';
	}

	return attributes[ attributeName ][ deviceSlug ];
}
