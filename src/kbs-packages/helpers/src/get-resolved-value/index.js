import getDeviceValue from '../get-device-value';
import getInheritedDeviceValue from '../get-inherited-device-value';

/**
 * Resolves both the direct device-specific value and the inherited value for an attribute.
 *
 * @param {string} attributeName - The name of the attribute.
 * @param {Object} attributes - The block's attributes.
 * @param {string} device - The current preview device ('desktop', 'tablet', 'mobile').
 * @param {Object} meta - The block's metadata.
 * @param {string} type - The attribute type (e.g., 'fontFamily', 'integer').
 * @param {Object} mergedGlobalStyle - The merged global style object.
 * @returns {Object} An object containing { directValue, inheritedValue, inheritedSource, isInherited }.
 */
export default function getResolvedValue( attributeName, attributes, device, meta, type, mergedGlobalStyle ) {
	const attributeMeta = meta?.attributes?.[attributeName];

	// Get the direct value set for the specific device.
	const directValue = getDeviceValue( attributeName, attributes, device, attributeMeta, type );

	// Get the inherited value and its source.
	const { inheritedValue, inheritedSource } = getInheritedDeviceValue(
		attributeName,
		attributes,
		device,
		meta,
		type,
		mergedGlobalStyle
	);

	const isInherited = directValue === '';

	return {
		directValue, // The value set directly for the current device.
		inheritedValue, // The value inherited from a parent device.
		inheritedSource, // The source of the inherited value ('direct', 'parent', 'preset').
		isInherited, // Whether the current value is inherited.
		appliedValue: isInherited ? inheritedValue : directValue, // The value to be applied to the element.
	};
} 