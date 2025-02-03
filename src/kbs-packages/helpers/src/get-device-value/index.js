import getDeviceAttributeSlug from '../get-device-attribute-slug';
/**
 * Simple get a device attribute value.
 */
export default function getDeviceValue( attributeName, attributes, device ) {
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

	return attributes[ attributeName ][ deviceSlug ];
}
