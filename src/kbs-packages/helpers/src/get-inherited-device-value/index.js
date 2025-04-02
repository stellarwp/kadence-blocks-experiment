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
 * @returns {object} - An object containing the value and its source
 */
export default function getInheritedDeviceValue(attributeName, attributes, device, meta, type, mergedGlobalStyle) {
	const deviceOptions = window?.kadence_blocks_params?.responsive_device_options || [];
	const initialValue = attributeMeta?.initial[device] ? attributeMeta?.initial[device] : null;

	const currentDeviceIndex = deviceOptions.findIndex(option => 
		option.key?.toLowerCase() === device?.toLowerCase() || 
		option.name?.toLowerCase() === device?.toLowerCase()
	);
	
	// Check if there's a direct value on the block (highest priority)
	const directValue = getDeviceValue(attributeName, attributes, device, attributeMeta, type);
	if (directValue) {
		return { inheritedValue: directValue, inheritedSource: 'direct' };
	}
		
	// Check direct value from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key || parentDevice.name;
		
		const parentValue = getDeviceValue(attributeName, attributes, parentDeviceName, attributeMeta, type);
		if (parentValue) {
			return { inheritedValue: parentValue, inheritedSource: 'parent' };
		}
	}


	// If no direct value, check for preset value for current device
	const presetValue = getPresetValue(attributeName, attributes, device, type, mergedGlobalStyle, meta);
	if (presetValue) {
		return { inheritedValue: presetValue, inheritedSource: 'preset' };
	}

	// Check preset value from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key;
		
		const parentPresetValue = getPresetValue(attributeName, attributes, parentDeviceName, type, mergedGlobalStyle, meta);
		
		if (parentPresetValue) {
			return { inheritedValue: parentPresetValue, inheritedSource: 'preset' };
		}
	}
	
	// Check initial values for current and parent devices
	// for (let i = currentDeviceIndex; i >= 0; i--) {
	// 	const deviceOption = deviceOptions[i];
	// 	const deviceKey = deviceOption.key || deviceOption.name;
	// 	if (initialValue?.[deviceKey]) {
	// 		return { inheritedValue: initialValue[deviceKey], inheritedSource: 'initial' };
	// 	}
	// }

	// Return empty values if nothing found
	return { inheritedValue: '', inheritedSource: 'none' };
} 
