import getDeviceAttributeSlug from '../get-device-attribute-slug';
import { COMPONENTS } from '../constants';
/**
 * Simple get a device attribute value.
 */
export default function getDeviceValue(attributeName, attributes, device, type = null, layerKey = null) {
	const deviceSlug = getDeviceAttributeSlug(device);
	let deviceValue = '';
	if (!attributeName) {
		return deviceValue;
	}
	if (!attributes) {
		return deviceValue;
	}
	if (!attributes?.[attributeName]) {
		return deviceValue;
	}
	// for device less values like preset.
	if (device === 'none') {
		if (type) {
			return attributes?.[attributeName]?.[type] ?? '';
		}
		return attributes?.[attributeName] ?? '';
	}
	if (null !== layerKey) {
		if (type) {
			return attributes?.[attributeName]?.layers?.[layerKey]?.[deviceSlug]?.[type] ?? '';
		}
		return attributes?.[attributeName]?.layers?.[layerKey]?.[deviceSlug] ?? '';
	}
	if (type) {
		if (device === 'any') {
			const deviceOptions = window?.kbs_params?.responsive_device_options || [];
			for (const deviceOption of deviceOptions) {
				const deviceKey = deviceOption.key;
				const value = attributes?.[attributeName]?.[deviceKey]?.[type];
				if (value) {
					return value;
				}
			}
			return '';
		}
		return attributes?.[attributeName]?.[deviceSlug]?.[type] ?? '';
	}
	// If there are no device specific values, return empty string.
	return attributes?.[attributeName]?.[deviceSlug] ?? '';
}
