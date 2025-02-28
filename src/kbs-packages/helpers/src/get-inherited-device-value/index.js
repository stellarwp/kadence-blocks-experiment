import getDeviceValue from '../get-device-value';
import getGlobalStylesDeviceValue from '../get-global-styles-device-value';

/**
 * Get the inherited value for a device, following the inheritance chain
 */
export default function getInheritedDeviceValue( attributeName, attributes, device, initialValue = {}, meta, type, globalStylesJson ) {
	const deviceOptions = kadence_blocks_params?.responsive_device_options || [];
	const currentDeviceIndex = deviceOptions.findIndex(option => option.key === device.toLowerCase());
	
	// First check immediate parent values in order
	for (let i = currentDeviceIndex - 1; i >= 0; i--) {
		const parentDevice = deviceOptions[i];
		const parentValue = getDeviceValue(attributeName, attributes, parentDevice.name, meta, type);
		if (parentValue) {
			return parentValue;
		}
	}

	// Check global styles for the current component type
	if (globalStylesJson && type === 'fontFamily') {
		const globalValue = getGlobalStylesDeviceValue(
			attributeName,
			globalStylesJson,
			device.toLowerCase(),
			type
		);

		if (globalValue) {
			return globalValue;
		}
	}
		
	
	// 	// Check global styles json for current device
	// 	const deviceKey = deviceOptions.find(option => option.name === device)?.key;

	// 	const get

	// 	if (globalStylesJson?.[deviceKey]) {
	// 		console.log( 'globalStylesJson for device', device, globalStylesJson );
	// 		// return globalStylesJson[device];
	// 	}
	
	// }

	// Check initial values for current and parent devices
	for (let i = currentDeviceIndex; i >= 0; i--) {
		const device = deviceOptions[i];
		if (initialValue?.[device.key]) {
			return initialValue[device.key];
		}
	}

	return '';
} 
