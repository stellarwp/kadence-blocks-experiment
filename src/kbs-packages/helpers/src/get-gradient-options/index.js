import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { useSettings } from '@wordpress/block-editor';
/**
 * Get an options array from the global styles preset object.
 */
export default function getGradientOptions() {
	//const [gradients] = useSettings('color.gradients');
	const globalMappings = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalMappings();
	}, []);
	const toReturn = useMemo(() => {
		if (!globalMappings?.['gradients'] || Object.keys(globalMappings?.['gradients']).length === 0) {
			return [];
		}
		// Merge and place theme colors at the end of the object
		const allGradients = { ...globalMappings['gradients'] };
		// Sort the colors put theme colors at the end by moving items with a number as the key to the end of the object.
		const sortedKeys = Object.keys(allGradients).sort((a, b) => {
			const aIsNumber = !isNaN(parseInt(a));
			const bIsNumber = !isNaN(parseInt(b));
			if (aIsNumber && !bIsNumber) return 1;
			if (!aIsNumber && bIsNumber) return -1;
			return 0;
		});
		return sortedKeys.map(function (key, index) {
			return {
				slug: allGradients?.[key]?.slug || key,
				name: allGradients?.[key]?.label || allGradients?.[key]?.name || '',
				gradient: allGradients?.[key]?.value || allGradients?.[key]?.gradient || undefined,
				category: allGradients?.[key]?.category,
			};
		});
	}, [globalMappings]);
	return toReturn;
}
