import { useSelect } from '@wordpress/data';
/**
 * Get an options array from the global styles preset object.
 */
export default function getPresetOptions(component) {
	const toReturn = [];

	const globalPresets = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalPresets();
	}, []);
	if (globalPresets?.[component] && Object.keys(globalPresets?.[component]).length) {
		Object.keys(globalPresets?.[component]).forEach(function (key, index) {
			toReturn.push({
				value: key,
				label: globalPresets?.[component]?.[key]?.label,
				description: globalPresets?.[component]?.[key]?.description,
			});
		});
	}

	return toReturn;
}
