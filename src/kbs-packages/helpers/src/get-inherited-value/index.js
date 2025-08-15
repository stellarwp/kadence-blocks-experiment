import getDeviceValue from '../get-device-value';
import getPresetValue from '../get-preset-value';
import { useMemo } from '@wordpress/element';

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
export default function getInheritedValue(
	attributeName,
	attributes,
	device,
	meta,
	type,
	globalStylesIds,
	layerKey = null
) {
	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	const attributeMeta = meta?.attributes?.[attributeName];
	const initialValue = attributeMeta?.initial ? attributeMeta?.initial : null;
	const currentDeviceIndex = deviceOptions.findIndex(
		(option) =>
			option.key?.toLowerCase() === device?.toLowerCase() || option.name?.toLowerCase() === device?.toLowerCase()
	);

	// Check if there's a direct value on the block (highest priority)
	const directValue = getDeviceValue(attributeName, attributes, device, type, layerKey);
	if (directValue) {
		return { inheritedValue: directValue, inheritedSource: 'direct', inheritedType: 'direct' };
	}

	if (device !== 'none') {
		// Check direct value from parent device
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key || parentDevice.name;

			const parentValue = getDeviceValue(attributeName, attributes, parentDeviceName, type, layerKey);
			if (parentValue) {
				return { inheritedValue: parentValue, inheritedSource: 'parent', inheritedType: 'parent' };
			}
		}
	}

	// If no direct value, check for preset value for current device
	const { value: presetValue, source: presetSource } = getPresetValue(
		attributeName,
		attributes,
		device,
		type,
		layerKey,
		globalStylesIds
	);
	if (presetValue) {
		return {
			inheritedValue: presetValue,
			inheritanceType: 'preset',
			inheritedSource: presetSource,
			inheritedType: 'preset',
		};
	}
	if (device !== 'none') {
		// Check preset value from parent device
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key;

			const { value: parentPresetValue, source: parentPresetSource } = getPresetValue(
				attributeName,
				attributes,
				parentDeviceName,
				type,
				layerKey,
				globalStylesIds
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
	}

	if ('none' === device) {
		if (type) {
			if (initialValue?.[type]) {
				return {
					inheritedValue: initialValue?.[type],
					inheritedSource: 'initial',
					inheritedType: 'initial',
				};
			}
		} else if (initialValue) {
			return {
				inheritedValue: initialValue,
				inheritedSource: 'initial',
				inheritedType: 'initial',
			};
		}
	}
	if (null !== layerKey) {
		if (type) {
			if (device !== 'none') {
				// Check initial values for current and parent devices
				for (let i = currentDeviceIndex; i >= 0; i--) {
					const deviceOption = deviceOptions[i];
					const deviceKey = deviceOption.key || deviceOption.name;
					if (initialValue?.layers?.[layerKey]?.[deviceKey]?.[type]) {
						return {
							inheritedValue: initialValue?.layers?.[layerKey]?.[deviceKey]?.[type],
							inheritedSource: 'initial',
							inheritedType: 'initial',
						};
					}
				}
			}
		} else if (initialValue?.layers?.[layerKey]) {
			return {
				inheritedValue: initialValue?.layers?.[layerKey],
				inheritedSource: 'initial',
				inheritedType: 'initial',
			};
		}
	}
	if (device !== 'none') {
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
