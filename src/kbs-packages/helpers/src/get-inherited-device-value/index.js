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
	const attributeMeta = meta?.attributes?.[attributeName];
	const initialValue = attributeMeta?.initial ? attributeMeta?.initial : null;

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
	const { value: presetValue, source: presetSource } = getPresetValue(attributeName, attributes, device, type, mergedGlobalStyle);
	if (presetValue) {
		return { inheritedValue: presetValue, inheritanceType: 'preset', inheritedSource: presetSource };
	}

	// Check preset value from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key;
		
		const { value: parentPresetValue, source: parentPresetSource } = getPresetValue(attributeName, attributes, parentDeviceName, type, mergedGlobalStyle);
		
		if (parentPresetValue) {
			return { inheritedValue: parentPresetValue, inheritanceType: 'preset-parent', inheritedSource: parentPresetSource };
		}
	}

	// Check base styles
	const basePresetKey = getBasePresetKey(attributeName, meta);

	const { value: basePresetValue, source: basePresetSource } = getPresetValue(attributeName, attributes, device, type, mergedGlobalStyle, basePresetKey);
	if (basePresetValue) {
		return { inheritedValue: basePresetValue, inheritanceType: 'preset-base', inheritedSource: basePresetKey };
	}
	
	// Check base styles from parent device
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentDeviceName = parentDevice.key;
		
		const { value: parentBasePresetValue, source: parentBasePresetSource } = getPresetValue(attributeName, attributes, parentDeviceName, type, mergedGlobalStyle, basePresetKey);
		if (parentBasePresetValue) {
			return { inheritedValue: parentBasePresetValue, inheritanceType: 'preset-base-parent', inheritedSource: basePresetKey };
		}
	}
	
	// Check initial values for current and parent devices
	for (let i = currentDeviceIndex; i >= 0; i--) {
		const deviceOption = deviceOptions[i];
		const deviceKey = deviceOption.key || deviceOption.name;
		if (initialValue?.[deviceKey]?.[type]) {
			return { inheritedValue: initialValue?.[deviceKey]?.[type], inheritedSource: 'initial' };
		}
	}

	// Return empty values if nothing found
	return { inheritedValue: '', inheritedSource: 'none' };
} 

function getBasePresetKey(attributeName, meta) {
	const component = meta?.attributes?.[attributeName]?.component;

	if( component === 'typography' ) {
		const tag = meta?.attributes?.[attributeName]?.tag || 'p';

		switch( tag ) {
			case 'h1':
				return 'text-heading-1';
			case 'h2':
				return 'text-heading-2';
			case 'h3':
				return 'text-heading-3';
			case 'h4':
				return 'text-heading-4';
			case 'h5':
				return 'text-heading-5';
			case 'h6':
				return 'text-heading-6';
			case 'p':
				return 'text-body';
			case 'span':
				return 'text-body';
			default:
				return 'text-body';
		}
	}

	return 'NONE';
}