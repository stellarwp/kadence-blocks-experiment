import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
/**
 * Get an options array from the global styles preset object.
 */
export default function getColorOptions() {

	const globalMappings = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalMappings();
	}, []);
	const toReturn = useMemo(() => {
		if (! globalMappings?.['colors'] || Object.keys(globalMappings?.['colors']).length === 0) {
			return [];
		}
		return Object.keys(globalMappings['colors']).map(function (key, index) {
			return {
				slug: key,
				name: globalMappings['colors']?.[key]?.label,
				category: globalMappings['colors']?.[key]?.category,
			};
		});
	}, [globalMappings]);

	return toReturn;
}
