import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPLEX_PROPERTIES } from './constants';

/**
 * Helper function to handle attribute changes in Kadence controls
 * 
 * @param {*} value The new value to set
 * @param {string} device The device type ('all', 'Desktop', 'Tablet', 'Mobile')
 * @param {string} attributeName The name of the attribute to update
 * @param {Object} attributes Current attributes object
 * @param {Function} setAttributes Function to update attributes
 * @param {Function|undefined} customOnChange Optional custom onChange handler
 * @param {string} type The type of attribute being changed
 */
export const handleAttributeChange = (
	value,
	device,
	attributeName,
	attributes,
	setAttributes,
	customOnChange,
	type,
    meta
) => {
	if (customOnChange) {
		customOnChange(value, device, type);
		return;
	}

	// Deep clone the attributes object to trigger an update
	const newAttributes = JSON.parse(JSON.stringify(attributes));
	const isComplexType = COMPLEX_PROPERTIES.includes( meta?.property );
	const deviceOptions = kadence_blocks_params?.responsive_device_options || [];

	// Handle simple 'all' device case first
	if (device === 'all') {
		if (!isComplexType) {
			newAttributes[attributeName] = value;
		} else {
			// Set value for all devices for complex types
			const deviceValues = deviceOptions.reduce((acc, deviceOption) => ({
				...acc,
				[deviceOption.key]: {
					...newAttributes[attributeName]?.[deviceOption.key],
					[type]: value
				}
			}), {});
			
			newAttributes[attributeName] = {
				...newAttributes[attributeName],
				...deviceValues
			};
		}
	} else {
		// Handle device-specific changes
		const deviceSlug = getDeviceAttributeSlug(device);
		
		if (!isComplexType) {
			if (!newAttributes[attributeName]) {
				newAttributes[attributeName] = {};
			}
			newAttributes[attributeName][deviceSlug] = value;
		} else {
			newAttributes[attributeName] = {
				...newAttributes[attributeName],
				[deviceSlug]: {
					...newAttributes[attributeName]?.[deviceSlug],
					[type]: value
				}
			};
		}
	}

	setAttributes(newAttributes);
};