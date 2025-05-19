import { useSelect } from '@wordpress/data';
/**
 * Get an options array from the global styles preset object.
 */
export default function getMappingOptions(component) {
	var toReturn = [];

	const globalMappings = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalMappings();
	}, []);

	if (globalMappings?.[component] && Object.keys(globalMappings?.[component]).length) {
		Object.keys(globalMappings?.[component]).forEach(function (key, index) {
			toReturn.push({
				value: key,
				label: globalMappings?.[component]?.[key]?.label,
				category: globalMappings?.[component]?.[key]?.category,
			});
		});
	}

	return toReturn;
}
