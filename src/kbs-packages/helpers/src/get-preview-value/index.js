import { merge } from 'lodash';
import { useMemo } from '@wordpress/element';

import getDeviceAttributeSlug from '../get-device-attribute-slug';

function getInitialWithDeviceSlugs( initialAttribute ) {
	if ( ! initialAttribute ) {
		return {};
	}
	// Loop through initialAttribute object and replace the device key with the device slugs.
	const initialAttributeWithDeviceSlugs = {};
	Object.keys(initialAttribute).forEach(key => {
		const deviceSlug = getDeviceAttributeSlug(key);
		initialAttributeWithDeviceSlugs[deviceSlug] = initialAttribute[key];
	});

	return initialAttributeWithDeviceSlugs;
}
function mergeInitialValue( attributeMeta, attributeValue ) {
	if ( ! attributeMeta ) {
		return attributeValue;
	}
	if ( attributeMeta?.initial ) {
		const initialAttribute = getInitialWithDeviceSlugs( attributeMeta.initial );
		return merge( initialAttribute, attributeValue );
	}
	return attributeValue;
}
/**
 * Simple get a device attribute value.
 */
export default function getPreviewValue( attributeName, attributes, meta, previewDevice ) {
	const returnValue = useMemo(() => {
		const mobile = getDeviceAttributeSlug( 'mobile' );
		const tablet = getDeviceAttributeSlug( 'tablet' );
		const desktop = getDeviceAttributeSlug( 'desktop' );
		let mergedAttribute = attributes?.[attributeName] ? attributes?.[attributeName] : {};
		if ( meta?.attributes?.[attributeName] ) {
			mergedAttribute = mergeInitialValue( meta?.attributes?.[attributeName], mergedAttribute );
		}
		if (previewDevice === 'Mobile') {
			if (undefined !== mergedAttribute?.[mobile] && '' !== mergedAttribute?.[mobile] && null !== mergedAttribute?.[mobile]) {
				return mergedAttribute?.[mobile];
			} else if (undefined !== mergedAttribute?.[tablet] && '' !== mergedAttribute?.[tablet] && null !== mergedAttribute?.[tablet]) {
				return mergedAttribute?.[tablet];
			}
		} else if (previewDevice === 'Tablet') {
			if (undefined !== mergedAttribute?.[tablet] && '' !== mergedAttribute?.[tablet] && null !== mergedAttribute?.[tablet]) {
				return mergedAttribute?.[tablet];
			}
		}
		return undefined !== mergedAttribute?.[desktop] && '' !== mergedAttribute?.[desktop] && null !== mergedAttribute?.[desktop] ? mergedAttribute?.[desktop] : '';
	}, [attributes, meta, attributeName, previewDevice]);
	return returnValue;
}
