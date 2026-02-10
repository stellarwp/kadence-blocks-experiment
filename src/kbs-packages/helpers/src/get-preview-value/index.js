import { merge } from 'lodash';
import { useMemo } from '@wordpress/element';

import getDeviceAttributeSlug from '../get-device-attribute-slug';

function getInitialWithDeviceSlugs(initialAttribute) {
	if (!initialAttribute) {
		return {};
	}
	// Loop through initialAttribute object and replace the device key with the device slugs.
	const initialAttributeWithDeviceSlugs = {};
	Object.keys(initialAttribute).forEach((key) => {
		const deviceSlug = getDeviceAttributeSlug(key);
		initialAttributeWithDeviceSlugs[deviceSlug] = initialAttribute[key];
	});

	return initialAttributeWithDeviceSlugs;
}
function mergeInitialValue(attributeMeta, attributeValue) {
	if (!attributeMeta) {
		return attributeValue;
	}
	if (attributeMeta?.initial) {
		const initialAttribute = getInitialWithDeviceSlugs(attributeMeta.initial);
		return merge(initialAttribute, attributeValue);
	}
	return attributeValue;
}
/**
 * Simple get a device attribute value.
 */
function getSingleLevelPreviewValue(attributeName, attributes, meta, previewDevice) {
	let mergedAttribute = attributes?.[attributeName] ? attributes?.[attributeName] : {};
	if (meta?.attributes?.[attributeName]) {
		mergedAttribute = mergeInitialValue(meta?.attributes?.[attributeName], mergedAttribute);
	}
	if (previewDevice === 'Mobile') {
		const mobile = getDeviceAttributeSlug('mobile');
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[mobile] &&
			'' !== mergedAttribute?.[mobile] &&
			null !== mergedAttribute?.[mobile]
		) {
			return mergedAttribute?.[mobile];
		} else if (
			undefined !== mergedAttribute?.[tablet] &&
			'' !== mergedAttribute?.[tablet] &&
			null !== mergedAttribute?.[tablet]
		) {
			return mergedAttribute?.[tablet];
		}
	} else if (previewDevice === 'Tablet') {
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[tablet] &&
			'' !== mergedAttribute?.[tablet] &&
			null !== mergedAttribute?.[tablet]
		) {
			return mergedAttribute?.[tablet];
		}
	}
	const desktop = getDeviceAttributeSlug('desktop');
	return undefined !== mergedAttribute?.[desktop] &&
		'' !== mergedAttribute?.[desktop] &&
		null !== mergedAttribute?.[desktop]
		? mergedAttribute?.[desktop]
		: '';
}
/**
 * Simple get a two level device attribute value.
 */
function getTwoLevelPreviewValue(attributePath, attributes, meta, previewDevice) {
	const topLevelAttributeName = attributePath[0];
	const secondLevelAttributeName = attributePath[1];
	let mergedAttribute = attributes?.[topLevelAttributeName] ? attributes?.[topLevelAttributeName] : {};
	if (meta?.attributes?.[topLevelAttributeName]) {
		mergedAttribute = mergeInitialValue(meta?.attributes?.[topLevelAttributeName], mergedAttribute);
	}
	if (previewDevice === 'Mobile') {
		const mobile = getDeviceAttributeSlug('mobile');
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[mobile]?.[secondLevelAttributeName] &&
			'' !== mergedAttribute?.[mobile]?.[secondLevelAttributeName] &&
			null !== mergedAttribute?.[mobile]?.[secondLevelAttributeName]
		) {
			return mergedAttribute?.[mobile]?.[secondLevelAttributeName];
		} else if (
			undefined !== mergedAttribute?.[tablet]?.[secondLevelAttributeName] &&
			'' !== mergedAttribute?.[tablet]?.[secondLevelAttributeName] &&
			null !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]
		) {
			return mergedAttribute?.[tablet]?.[secondLevelAttributeName];
		}
	} else if (previewDevice === 'Tablet') {
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[tablet]?.[secondLevelAttributeName] &&
			'' !== mergedAttribute?.[tablet]?.[secondLevelAttributeName] &&
			null !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]
		) {
			return mergedAttribute?.[tablet]?.[secondLevelAttributeName];
		}
	}
	const desktop = getDeviceAttributeSlug('desktop');
	return undefined !== mergedAttribute?.[desktop]?.[secondLevelAttributeName] &&
		'' !== mergedAttribute?.[desktop]?.[secondLevelAttributeName] &&
		null !== mergedAttribute?.[desktop]?.[secondLevelAttributeName]
		? mergedAttribute?.[desktop]?.[secondLevelAttributeName]
		: '';
}
/**
 * Simple get a three level device attribute value.
 */
function getThreeLevelPreviewValue(attributePath, attributes, meta, previewDevice) {
	const topLevelAttributeName = attributePath[0];
	const secondLevelAttributeName = attributePath[1];
	const thirdLevelAttributeName = attributePath[2];
	let mergedAttribute = attributes?.[topLevelAttributeName] ? attributes?.[topLevelAttributeName] : {};
	if (meta?.attributes?.[topLevelAttributeName]) {
		mergedAttribute = mergeInitialValue(meta?.attributes?.[topLevelAttributeName], mergedAttribute);
	}
	if (previewDevice === 'Mobile') {
		const mobile = getDeviceAttributeSlug('mobile');
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[mobile]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			'' !== mergedAttribute?.[mobile]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			null !== mergedAttribute?.[mobile]?.[secondLevelAttributeName]?.[thirdLevelAttributeName]
		) {
			return mergedAttribute?.[mobile]?.[secondLevelAttributeName]?.[thirdLevelAttributeName];
		} else if (
			undefined !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			'' !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			null !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName]
		) {
			return mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName];
		}
	} else if (previewDevice === 'Tablet') {
		const tablet = getDeviceAttributeSlug('tablet');
		if (
			undefined !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			'' !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
			null !== mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName]
		) {
			return mergedAttribute?.[tablet]?.[secondLevelAttributeName]?.[thirdLevelAttributeName];
		}
	}
	const desktop = getDeviceAttributeSlug('desktop');
	return undefined !== mergedAttribute?.[desktop]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
		'' !== mergedAttribute?.[desktop]?.[secondLevelAttributeName]?.[thirdLevelAttributeName] &&
		null !== mergedAttribute?.[desktop]?.[secondLevelAttributeName]?.[thirdLevelAttributeName]
		? mergedAttribute?.[desktop]?.[secondLevelAttributeName]?.[thirdLevelAttributeName]
		: '';
}
/**
 * Simple get a device attribute value.
 */
export default function getPreviewValue(attributeName, attributes, meta, previewDevice) {
	const returnValue = useMemo(() => {
		// Split the attribute name by . to get the attribute object path.
		const attributePath = attributeName.split('.');
		if (attributePath.length === 2) {
			return getTwoLevelPreviewValue(attributePath, attributes, meta, previewDevice);
		} else if (attributePath.length === 3) {
			return getThreeLevelPreviewValue(attributePath, attributes, meta, previewDevice);
		}
		return getSingleLevelPreviewValue(attributeName, attributes, meta, previewDevice);
	}, [attributes, meta, attributeName, previewDevice]);
	return returnValue;
}
