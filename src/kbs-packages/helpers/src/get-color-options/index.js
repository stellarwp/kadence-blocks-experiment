import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { useSettings } from '@wordpress/block-editor';
/**
 * Get an options array from the global styles preset object.
 */
export default function getColorOptions() {
	const [colors] = useSettings('color.palette');
	const globalMappings = useSelect((select) => {
		return select('kadenceblocks/global-styles').getGlobalMappings();
	}, []);
	// Remove Kadence Theme Colors from the colors array
	const themeColors = useMemo(() => {
		let additionalThemeColors = JSON.parse(JSON.stringify(colors));
		if (window?.kbs_params?.isKadenceTheme) {
			additionalThemeColors = additionalThemeColors.filter((color) => !color.slug.startsWith('theme-palette'));
		}
		return additionalThemeColors;
	}, [colors]);
	const toReturn = useMemo(() => {
		if (!globalMappings?.['colors'] || Object.keys(globalMappings?.['colors']).length === 0) {
			return themeColors;
		}
		// Merge and place theme colors at the end of the object
		const allColors = { ...globalMappings['colors'], ...themeColors };
		// Sort the colors put theme colors at the end by moving items with a number as the key to the end of the object.
		const sortedKeys = Object.keys(allColors).sort((a, b) => {
			const aIsNumber = !isNaN(parseInt(a));
			const bIsNumber = !isNaN(parseInt(b));
			if (aIsNumber && !bIsNumber) return 1;
			if (!aIsNumber && bIsNumber) return -1;
			return 0;
		});
		return sortedKeys.map(function (key, index) {
			return {
				slug: allColors?.[key]?.slug || key,
				name: allColors?.[key]?.label || allColors?.[key]?.name || '',
				category: allColors?.[key]?.category || '',
				color: allColors?.[key]?.color || undefined,
			};
		});
	}, [globalMappings, themeColors]);
	return toReturn;
}
