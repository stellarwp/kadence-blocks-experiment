import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPONENTS } from '../constants';

/**
 * Handles updating attributes for all devices
 * @param {*} value The value to set
 * @param {Object} newAttributes Current attributes object being modified
 * @param {string} attributeName The name of the attribute to update
 * @param {boolean} isComponent Whether this is a complex property type
 * @param {Array} deviceOptions Array of device options
 * @param {string} type The type of attribute being changed
 * @returns {Object} Updated attributes
 */
const handleAllDevices = (value, newAttributes, attributeName, deviceOptions, type) => {
	if (!type) {
		if (typeof value === 'object' && value !== null) {
			Object.entries(value).forEach(([key, val]) => {
				newAttributes[key] = val;
			});
		} else {
			newAttributes[attributeName] = value;
		}
		return newAttributes;
	}

	const deviceValues = deviceOptions.reduce(
		(acc, deviceOption) => ({
			...acc,
			[deviceOption.key]: {
				...newAttributes[attributeName]?.[deviceOption.key],
				...(typeof value === 'object' && value !== null ? value : { [type]: value }),
			},
		}),
		{}
	);

	newAttributes[attributeName] = {
		...newAttributes[attributeName],
		...deviceValues,
	};

	return newAttributes;
};

/**
 * Handles updating attributes for a deviceless attribute
 * @param {*} value The value to set
 * @param {Object} newAttributes Current attributes object being modified
 * @param {string} attributeName The name of the attribute to update
 * @param {boolean} isComponent Whether this is a complex property type
 * @param {Array} deviceOptions Array of device options
 * @param {string} type The type of attribute being changed
 * @returns {Object} Updated attributes
 */
const handleNoDevice = (value, newAttributes, attributeName, type) => {
	if (!type) {
		if (typeof value === 'object' && value !== null) {
			Object.entries(value).forEach(([key, val]) => {
				newAttributes[key] = val;
			});
		} else {
			newAttributes[attributeName] = value;
		}
		return newAttributes;
	}

	newAttributes[attributeName] = {
		...newAttributes[attributeName],
		...(typeof value === 'object' && value !== null ? value : { [type]: value }),
	};

	return newAttributes;
};

/**
 * Handles updating attributes for a specific device
 * @param {*} value The value to set
 * @param {Object} newAttributes Current attributes object being modified
 * @param {string} attributeName The name of the attribute to update
 * @param {boolean} isComponent Whether this is a complex property type
 * @param {string} deviceSlug The device slug (e.g., 'Desktop', 'Tablet')
 * @param {string} type The type of attribute being changed
 * @returns {Object} Updated attributes
 */
const handleSpecificDevice = (value, newAttributes, attributeName, deviceSlug, type) => {
	if (!type) {
		if (!newAttributes[attributeName]) {
			newAttributes[attributeName] = {};
		}
		if (typeof value === 'object' && value !== null) {
			Object.entries(value).forEach(([key, val]) => {
				if (!newAttributes[key]) {
					newAttributes[key] = {};
				}
				newAttributes[key][deviceSlug] = val;
			});
		} else {
			newAttributes[attributeName][deviceSlug] = value;
		}
		return newAttributes;
	}
	if (value === undefined) {
		if (newAttributes?.[attributeName]?.[deviceSlug]?.[type]) {
			delete newAttributes[attributeName][deviceSlug][type];
		}
		return newAttributes;
	}
	newAttributes[attributeName] = {
		...newAttributes[attributeName],
		[deviceSlug]: {
			...newAttributes[attributeName]?.[deviceSlug],
			...(typeof value === 'object' && value !== null ? value : { [type]: value }),
		},
	};
	return newAttributes;
};

/**
 * Helper function to handle attribute changes in Kadence controls
 *
 * @param {*} value The new value to set - can be a single value or an object of values
 * @param {string} device The device type ('all', 'Desktop', 'Tablet', 'Mobile')
 * @param {string} attributeName The name of the attribute to update
 * @param {Object} attributes Current attributes object
 * @param {Function} setAttributes Function to update attributes
 * @param {Function|undefined} customOnChange Optional custom onChange handler
 * @param {string} type The type of attribute being changed
 * @param {Object} meta The meta object
 */
export const handleAttributeChange = (
	value,
	device,
	attributeName,
	attributes,
	setAttributes,
	customOnChange,
	type = null,
	meta
) => {
	if (customOnChange) {
		customOnChange(value, device, attributeName, type);
		return;
	}

	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	let newAttributes = JSON.parse(JSON.stringify(attributes));
	if (device === 'all') {
		newAttributes = handleAllDevices(value, newAttributes, attributeName, deviceOptions, type);
	} else if (device === 'none') {
		newAttributes = handleNoDevice(value, newAttributes, attributeName, type);
	} else {
		const deviceSlug = getDeviceAttributeSlug(device);
		newAttributes = handleSpecificDevice(value, newAttributes, attributeName, deviceSlug, type);
	}
	setAttributes(newAttributes);
};

/**
 * Helper function to handle attribute changes in Kadence controls
 *
 * @param {*} value The new value to set - can be a single value or an object of values
 * @param {string} device The device type ('all', 'Desktop', 'Tablet', 'Mobile')
 * @param {string} attributeName The name of the attribute to update
 * @param {Object} attributes Current attributes object
 * @param {Function} setAttributes Function to update attributes
 * @param {Function|undefined} customOnChange Optional custom onChange handler
 * @param {string} type The type of attribute being changed
 * @param {Object} meta The meta object
 */
export const handleMultipleAttributeChange = (
	value,
	device,
	attributeName,
	attributes,
	setAttributes,
	customOnChange,
	type = null,
	meta
) => {
	if (customOnChange) {
		customOnChange(value, device, attributeName, type);
		return;
	}
	console.log('here?');

	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	let newAttributes = JSON.parse(JSON.stringify(attributes));
	if (Array.isArray(type)) {
		type.forEach((itemType, index) => {
			if (device === 'all') {
				newAttributes = handleAllDevices(value[index], newAttributes, attributeName, deviceOptions, itemType);
			} else if (device === 'none') {
				newAttributes = handleNoDevice(value[index], newAttributes, attributeName, itemType);
			} else {
				const deviceSlug = getDeviceAttributeSlug(device);
				newAttributes = handleSpecificDevice(value[index], newAttributes, attributeName, deviceSlug, itemType);
			}
		});
		setAttributes(newAttributes);
	} else {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	}
};
