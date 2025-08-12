import { merge } from 'lodash';
import getDeviceAttributeSlug from '../../get-device-attribute-slug';

const deviceOptions = window?.kbs_params?.responsive_device_options || [];

/**
 * Merge the initial attribute with provided values
 * @param {Object} meta - The metadata of the attribute
 * @param {Object} attributeValue - The value of the attribute
 * @returns {Object} - The merged attribute
 */
export function mergeInitialAttribute(meta, attributeValue) {
	if (!meta || !attributeValue) {
		return null;
	}

	if (meta?.initial) {
		const initialAttribute = getInitialWithDeviceSlugs(meta.initial);
		return merge(initialAttribute, attributeValue);
	}

	return attributeValue;
}

/**
 * Get the initial attribute with device slugs
 * @param {Object} initialAttribute - The initial attribute
 * @returns {Object} - The initial attribute with device slugs
 */
export function getInitialWithDeviceSlugs(initialAttribute) {
	if (!initialAttribute) {
		return {};
	}

	// Loop through initialAttribute object and replace the device key with the device slugs
	const initialAttributeWithDeviceSlugs = {};
	Object.keys(initialAttribute).forEach((key) => {
		const deviceSlug = getDeviceAttributeSlug(key);
		initialAttributeWithDeviceSlugs[deviceSlug] = initialAttribute[key];
	});

	return initialAttributeWithDeviceSlugs;
}

/**
 * Get the preview property value for a specific device
 * @param {string} attributeValue - The value of the attribute
 * @param {string} previewDevice - The preview device
 * @returns {string} - The preview property
 */
export function getPreviewProperty(attributeValue, previewDevice) {
	// Get the current device option
	const currentDevice = deviceOptions.find((device) => device.name === previewDevice);
	if (!currentDevice) {
		// Default to desktop if device not found
		const desktop = deviceOptions.find((device) => device.key === 'desktop')?.attributeSlug || 'desktop';
		return attributeValue?.[desktop] || '';
	}

	// Get the attribute slug for the current device
	const currentDeviceSlug = currentDevice.attributeSlug;

	// Check if we have a value for the current device
	if (
		attributeValue?.[currentDeviceSlug] !== undefined &&
		attributeValue?.[currentDeviceSlug] !== '' &&
		attributeValue?.[currentDeviceSlug] !== null
	) {
		return attributeValue[currentDeviceSlug];
	}

	// Find the current device index in the array
	const currentDeviceIndex = deviceOptions.findIndex((device) => device.name === previewDevice);

	// Implement inheritance based on device order
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const inheritFromSlug = deviceOptions[i].attributeSlug;

		if (
			attributeValue?.[inheritFromSlug] !== undefined &&
			attributeValue?.[inheritFromSlug] !== '' &&
			attributeValue?.[inheritFromSlug] !== null
		) {
			return attributeValue[inheritFromSlug];
		}
	}

	return '';
}

/**
 * Check if a component has layers
 * @param {Object} meta - Component metadata
 * @returns {boolean}
 */
export function hasLayers(meta) {
	return meta?.hasLayers === true;
}

/**
 * Check if a property is non-inheritable
 * @param {Object} meta - Component metadata
 * @returns {boolean}
 */
export function isNonInheritable(meta) {
	return meta?.nonInheritable === true;
}