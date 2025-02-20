import getDeviceValue from '../get-device-value';

/**
 * Get the inherited value for a device, following the inheritance chain
 */
export default function getInheritedDeviceValue( attributeName, attributes, device, initialValue = {} ) {
	const deviceOptions = kadence_blocks_params?.responsive_device_options || [];
	const currentDeviceIndex = deviceOptions.findIndex(option => option.key === device.toLowerCase());
	
	// First check immediate parent values in order
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentValue = getDeviceValue(attributeName, attributes, parentDevice.name);
		if (parentValue) {
			return parentValue;
		}
	}

	// Check initial values for current and parent devices
	for (let i = currentDeviceIndex; i >= 0; i--) {
		const device = deviceOptions[i];
		if (initialValue?.[device.key]) {
			return initialValue[device.key];
		}
	}

	return '';
} 