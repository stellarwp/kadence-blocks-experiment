import getDeviceValue from '../get-device-value';
import getPresetValue from '../get-preset-value';

/**
 * Get the inherited value for a device, following the inheritance chain
 *
 * @param {string} attributeName - The attribute name (e.g., 'typography')
 * @param {object} attributes - The block attributes
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @param {object} meta - Metadata object for the attribute
 * @param {string} type - The specific property type (e.g., 'fontFamily')
 * @param {string[]} globalStylesIds - Array of global style IDs.
 * @returns {object} - An object containing the value and its source
 */
export default function getInheritedDeviceValue(attributeName, attributes, device, meta, type, globalStylesIds) {
	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	const attributeMeta = meta?.attributes?.[attributeName];
	const initialValue = attributeMeta?.initial ? attributeMeta?.initial : null;

	const currentDeviceIndex = deviceOptions.findIndex(
		(option) =>
			option.key?.toLowerCase() === device?.toLowerCase() || option.name?.toLowerCase() === device?.toLowerCase()
	);

	// Check if there's a direct value on the block (highest priority)
	const directValue = getDeviceValue(attributeName, attributes, device, type);
	if (directValue) {
		return { inheritedValue: directValue, inheritedSource: 'direct', inheritedType: 'direct' };
	}

	// Check direct value from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key || parentDevice.name;

		const parentValue = getDeviceValue(attributeName, attributes, parentDeviceName, type);
		if (parentValue) {
			return { inheritedValue: parentValue, inheritedSource: 'parent', inheritedType: 'parent' };
		}
	}

	// If no direct value, check for preset value for current device
	const { value: presetValue, source: presetSource } = getPresetValue(
		attributeName,
		attributes,
		device,
		type,
		null,
		globalStylesIds,
		null
	);

	if (presetValue) {
		return {
			inheritedValue: presetValue,
			inheritanceType: 'preset',
			inheritedSource: presetSource,
			inheritedType: 'preset',
		};
	}

	// Check preset value from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key;

		const { value: parentPresetValue, source: parentPresetSource } = getPresetValue(
			attributeName,
			attributes,
			parentDeviceName,
			type,
			null,
			globalStylesIds,
			null
		);

		if (parentPresetValue) {
			return {
				inheritedValue: parentPresetValue,
				inheritanceType: 'preset-parent',
				inheritedSource: parentPresetSource,
				inheritedType: 'preset',
			};
		}
	}

	if (attributeMeta?.hasLayers) {
		// Check initial values for current and parent devices
		for (let i = currentDeviceIndex; i >= 0; i--) {
			const deviceOption = deviceOptions[i];
			const deviceKey = deviceOption.key || deviceOption.name;
			if (type) {
				const { indexKey, itemType } = type.split(':');
				if (indexKey && itemType) {
					if (initialValue?.layers?.[indexKey]?.[deviceKey]?.[itemType]) {
						return {
							inheritedValue: initialValue?.layers?.[indexKey]?.[deviceKey]?.[itemType],
							inheritedSource: 'initial',
							inheritedType: 'initial',
						};
					}
				}
			} else {
				if (initialValue?.layers) {
					return {
						inheritedValue: initialValue?.layers,
						inheritedSource: 'initial',
						inheritedType: 'initial',
					};
				}
			}
		}
	} else {
		// Check initial values for current and parent devices
		for (let i = currentDeviceIndex; i >= 0; i--) {
			const deviceOption = deviceOptions[i];
			const deviceKey = deviceOption.key || deviceOption.name;
			if (initialValue?.[deviceKey]?.[type]) {
				return {
					inheritedValue: initialValue?.[deviceKey]?.[type],
					inheritedSource: 'initial',
					inheritedType: 'initial',
				};
			}
		}
	}

	// Return empty values if nothing found
	return { inheritedValue: '', inheritedSource: 'none', inheritedType: 'none' };
}
