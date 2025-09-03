import { select, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Get preset values from global styles
 *
 * This function retrieves the preset value for a block attribute from global styles.
 * It handles the inheritance chain: block attribute > block preset > global style
 *
 * @param {string} attributeName - The attribute name (e.g., 'typography')
 * @param {object} attributes - The block attributes
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @param {string} type - The specific property type (e.g., 'fontFamily')
 * @param {boolean} useLayers - Whether to use layers for the preset value.
 * @param {string[]} globalStylesIds - Array of global style IDs.
 * @param {string|null} [basePresetKey=null] - Optional base preset key to look up.
 * @returns {object} - An object containing { value, source }.
 */
export default function getPresetValue(
	attributeName,
	attributes,
	device,
	type,
	layerKey = null,
	globalStylesIds,
	basePresetKey = null,
	meta = null
) {
	// Determine the preset key to use: either the base key or the one from attributes
	const presetKeyToUse = basePresetKey ? basePresetKey : attributes?.[attributeName]?.preset;
	const attributeMeta = meta?.attributes?.[attributeName];
	const componentType = attributeMeta?.component ?? attributeName;

	// If no preset key could be determined, exit early.
	if (!presetKeyToUse) {
		return { value: undefined, source: undefined };
	}

	// Fetch the raw preset data object from the store using the new selector
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		componentType,
		'presets.' + presetKeyToUse
	);

	// Check if we got preset data and extract the specific attribute value for the device
	if (rawPresetData?.attributes) {
		if (device === 'none') {
			if (rawPresetData.attributes?.[type]) {
				return { value: rawPresetData.attributes?.[type], source: 'preset' };
			}
		} else if (null !== layerKey) {
			const attributeValue = rawPresetData.attributes?.layers?.[layerKey]?.[device?.toLowerCase()]?.[type];
			if (attributeValue !== undefined && attributeValue !== null && attributeValue !== '') {
				return { value: attributeValue, source: 'preset' };
			}
		} else if (type?.includes('border') && type?.includes('Radius')) {
			// Special handling for border radius stored as array (check after individual keys)
			const isHover = type.includes('Hover');
			const arrayKey = isHover ? 'borderRadiusHover' : 'borderRadius';

			// Check if borderRadius is stored as an array at the attribute level
			const borderRadiusArray = rawPresetData.attributes?.[device?.toLowerCase()]?.[arrayKey];

			if (Array.isArray(borderRadiusArray)) {
				let cornerValue;
				// Map individual corner keys to array indices
				if (type === 'borderTopLeftRadius' || type === 'borderTopLeftRadiusHover') {
					cornerValue = borderRadiusArray[0];
				} else if (type === 'borderTopRightRadius' || type === 'borderTopRightRadiusHover') {
					cornerValue = borderRadiusArray[1];
				} else if (type === 'borderBottomRightRadius' || type === 'borderBottomRightRadiusHover') {
					cornerValue = borderRadiusArray[2];
				} else if (type === 'borderBottomLeftRadius' || type === 'borderBottomLeftRadiusHover') {
					cornerValue = borderRadiusArray[3];
				}

				if (cornerValue !== undefined && cornerValue !== null && cornerValue !== '') {
					return { value: cornerValue, source: 'preset' };
				}
			}
		} else {
			// Find the attribute value within the preset data for the specific device and type
			const attributeValue = rawPresetData.attributes?.[device?.toLowerCase()]?.[type];

			if (attributeValue !== undefined && attributeValue !== null && attributeValue !== '') {
				// Return the found value and indicate the source as 'preset'
				return { value: attributeValue, source: 'preset' };
			}
		}
	}

	// If no value was found, return undefined
	return { value: undefined, source: undefined };
}
