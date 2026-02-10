import getDeviceAttributeSlug from '../get-device-attribute-slug';

/**
 * Handles updating attributes for all devices
 * @param {*} value The value to set
 * @param {Object} layerAttributes Current layer attributes object being modified
 * @param {string} layerKey The key of the layer to update
 * @param {Array} deviceOptions Array of device options
 * @param {string} type The type of attribute being changed
 * @returns {Object} Updated attributes
 */
const handleLayerAllDevices = (value, layerAttributes, layerKey, deviceOptions, type) => {
	if (!type) {
		if (value === undefined) {
			if (layerAttributes?.[layerKey]) {
				delete layerAttributes[layerKey];
			}
		} else {
			layerAttributes[layerKey] = value;
		}
		return layerAttributes;
	}

	const deviceValues = deviceOptions.reduce(
		(acc, deviceOption) => ({
			...acc,
			[deviceOption.key]: {
				...layerAttributes[layerKey]?.[deviceOption.key],
				...(typeof value === 'object' && value !== null ? value : { [type]: value }),
			},
		}),
		{}
	);

	layerAttributes[layerKey] = {
		...layerAttributes[layerKey],
		...deviceValues,
	};

	return layerAttributes;
};

/**
 * Handles updating attributes for a deviceless attribute
 * @param {*} value The value to set
 * @param {Object} layerAttributes Current layer attributes object being modified
 * @param {string} layerKey The key of the layer to update
 * @param {string} type The type of attribute being changed
 * @returns {Object} Updated attributes
 */
const handleLayerNoDevice = (value, layerAttributes, layerKey, type) => {
	if (!type) {
		if (value === undefined) {
			if (layerAttributes?.[layerKey]) {
				delete layerAttributes[layerKey];
			}
		} else {
			layerAttributes[layerKey] = value;
		}
		return layerAttributes;
	}

	layerAttributes[layerKey] = {
		...layerAttributes[layerKey],
		...(typeof value === 'object' && value !== null ? value : { [type]: value }),
	};

	return layerAttributes;
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
const handleLayerSpecificDevice = (value, layerAttributes, layerKey, deviceSlug, type) => {
	if (!type) {
		if (value === undefined) {
			if (layerAttributes?.[layerKey]?.[deviceSlug]) {
				delete layerAttributes[layerKey][deviceSlug];
			}
		} else {
			layerAttributes[layerKey][deviceSlug] = value;
		}
		return layerAttributes;
	}
	if (value === undefined) {
		if (layerAttributes?.[layerKey]?.[deviceSlug]?.[type]) {
			delete layerAttributes[layerKey][deviceSlug][type];
		}
		return layerAttributes;
	}
	layerAttributes[layerKey] = {
		...layerAttributes[layerKey],
		[deviceSlug]: {
			...layerAttributes[layerKey]?.[deviceSlug],
			...(typeof value === 'object' && value !== null ? value : { [type]: value }),
		},
	};
	return layerAttributes;
};
export const handleSingleLayerAttributeChange = (
	value,
	device,
	attributeName,
	attributes,
	setAttributes,
	customOnChange,
	type = null,
	meta,
	layerKey
) => {
	if (customOnChange) {
		customOnChange(value, device, attributeName, type, layerKey);
		return;
	}

	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	let newLayers = attributes?.[attributeName]?.layers
		? JSON.parse(JSON.stringify(attributes?.[attributeName]?.layers))
		: [];
	if (!newLayers?.[layerKey]) {
		newLayers[layerKey] = {};
	}
	if (device === 'all') {
		newLayers = handleLayerAllDevices(value, newLayers, layerKey, deviceOptions, type);
	} else if (device === 'none') {
		newLayers = handleLayerNoDevice(value, newLayers, layerKey, type);
	} else {
		const deviceSlug = getDeviceAttributeSlug(device);
		newLayers = handleLayerSpecificDevice(value, newLayers, layerKey, deviceSlug, type);
	}
	setAttributes({ [attributeName]: { ...attributes?.[attributeName], layers: newLayers } });
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
export const handleLayerAttributeChange = (
	value,
	device,
	attributeName,
	attributes,
	setAttributes,
	customOnChange,
	type = null,
	meta,
	layerKey
) => {
	if (customOnChange) {
		customOnChange(value, device, attributeName, type, layerKey);
		return;
	}

	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	if (Array.isArray(type)) {
		let newLayers = attributes?.[attributeName]?.layers
			? JSON.parse(JSON.stringify(attributes?.[attributeName]?.layers))
			: [];
		if (!newLayers?.[layerKey]) {
			newLayers[layerKey] = {};
		}
		type.forEach((itemType, index) => {
			if (device === 'all') {
				newLayers = handleLayerAllDevices(value[index], newLayers, layerKey, deviceOptions, itemType);
			} else if (device === 'none') {
				newLayers = handleLayerNoDevice(value[index], newLayers, layerKey, itemType);
			} else {
				const deviceSlug = getDeviceAttributeSlug(device);
				newLayers = handleLayerSpecificDevice(value[index], newLayers, layerKey, deviceSlug, itemType);
			}
		});
		setAttributes({ [attributeName]: { ...attributes?.[attributeName], layers: newLayers } });
	} else {
		handleSingleLayerAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			meta,
			layerKey
		);
	}
};
