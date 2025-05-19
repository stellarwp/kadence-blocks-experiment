import { useSelect } from '@wordpress/data';
/**
 * Get an options array from the global styles preset object.
 */
export default function getColorOptions() {
	var toReturn = [];

	const globalMappings = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalMappings();
	}, []);

	if (globalMappings['colors'] && Object.keys(globalMappings['colors']).length) {
		Object.keys(globalMappings['colors']).forEach(function (key, index) {
			toReturn.push({
				value: key,
				label: globalMappings['colors']?.[key]?.label,
				category: globalMappings['colors']?.[key]?.category,
			});
		});
	}

	return toReturn;
}
