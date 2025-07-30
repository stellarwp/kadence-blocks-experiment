import { select } from '@wordpress/data';
import getResolvedValue from '../get-resolved-value';

/**
 * Get bundle preset values from global styles
 *
 * This function retrieves the preset value for a block attribute from global styles
 * by looking for bundle preset attributes in the meta. If a bundlePreset attribute
 * has a value, it uses that as a key to retrieve the corresponding preset from the
 * kadenceblocks/global-styles data store, then looks for the initial attribute name
 * in that preset and returns it if set.
 *
 * @param {string} attributeName - The attribute name (e.g., 'typography')
 * @param {object} attributes - The block attributes
 * @param {object} meta - The block meta data containing bundlePreset attributes
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @param {string} type - The specific property type (e.g., 'fontFamily')
 * @param {string[]} globalStylesIds - Array of global style IDs.
 * @param {string|null} [layerKey=null] - Optional layer key for layered attributes.
 * @returns {object} - An object containing { value, source }.
 */
export default function getBundlePresetValue(
	attributeName,
	attributes,
	device,
	meta,
	type,
	globalStylesIds,
	layerKey = null
) {
	// Look for bundlePreset attributes in the meta
	const bundlePresetMetaAttributes = meta?.attributes || {};

	for (const [key, attributeMeta] of Object.entries(bundlePresetMetaAttributes)) {
		if (attributeMeta?.bundlePreset) {
			const initialValue = attributeMeta?.initial;
			const directValue = attributes?.[key];

			const bundlePresetAttributeKey = key;
			const bundlePresetKey = directValue ?? initialValue;
			const bundlePresetComponent = attributeMeta?.component;

			// Fetch the raw preset data object from the store using the bundle preset key
			const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
				globalStylesIds,
				bundlePresetComponent,
				'presets.' + bundlePresetKey
			);

			// Check if we got preset data and extract the specific attribute value for the device
			if (rawPresetData?.attributes && rawPresetData?.attributes?.[attributeName]) {
				// Create a copy of meta without the bundlePreset attribute
				const metaWithoutBundle = {
					...meta,
					attributes: Object.fromEntries(
						Object.entries(meta.attributes).filter(([key]) => key !== bundlePresetAttributeKey)
					),
				};

				// recusively call getResolvedValue to get the value of the attribute
				// this will handle things like individual attribute presets, etc
				const { appliedValue } = getResolvedValue(
					attributeName,
					rawPresetData.attributes,
					device,
					metaWithoutBundle,
					type,
					globalStylesIds
				);

				if (appliedValue !== undefined && appliedValue !== null && appliedValue !== '') {
					console.log(
						'found bundle preset value',
						attributeName,
						appliedValue,
						bundlePresetKey,
						bundlePresetComponent
					);

					console.log(rawPresetData.attributes);
					return { value: appliedValue, source: 'preset' };
				}
			}
		}
	}

	// If no value was found, return undefined
	return { value: undefined, source: undefined };
}
