import getDeviceAttributeSlug from '../get-device-attribute-slug';
/**
 * Simple get a device attribute value.
 */
export default function getPreviewValue( attributeName, attributes, previewDevice ) {
	const mobile = getDeviceAttributeSlug( 'mobile' );
	const tablet = getDeviceAttributeSlug( 'tablet' );
	const desktop = getDeviceAttributeSlug( 'desktop' );
	if (previewDevice === 'Mobile') {
		if (undefined !== attributes?.[mobile]?.[attributeName] && '' !== attributes?.[mobile]?.[attributeName] && null !== attributes?.[mobile]?.[attributeName]) {
			return attributes?.[mobile]?.[attributeName];
		} else if (undefined !== attributes?.[tablet]?.[attributeName] && '' !== attributes?.[tablet]?.[attributeName] && null !== attributes?.[tablet]?.[attributeName]) {
			return attributes?.[tablet]?.[attributeName];
		}
	} else if (previewDevice === 'Tablet') {
		if (undefined !== attributes?.[tablet]?.[attributeName] && '' !== attributes?.[tablet]?.[attributeName] && null !== attributes?.[tablet]?.[attributeName]) {
			return attributes?.[tablet]?.[attributeName];
		}
	}
	return undefined !== attributes?.[desktop]?.[attributeName] && '' !== attributes?.[desktop]?.[attributeName] && null !== attributes?.[desktop]?.[attributeName] ? attributes?.[desktop]?.[attributeName] : '';
}
