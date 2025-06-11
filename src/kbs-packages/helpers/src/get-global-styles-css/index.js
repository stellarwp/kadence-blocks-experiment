import { useSelect } from '@wordpress/data';
import { useMemo } from 'react';
/**
 * Gets variable name from category and type
 */
export function getMappingVariableName(category, type, isBase = false) {
	let prefix = 'kbs-';
	let categorySlug = String(category)
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	if (isBase && (categorySlug === 'colors' || categorySlug === 'gradients')) {
		categorySlug = 'global';
		prefix = '';
	}
	const typeSlug = String(type)
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	return `--${prefix}${categorySlug}-${typeSlug}`;
}
export default function getGlobalStylesCSSOutput(globalStyleIds = [], selector = '') {
	const { globalStyles } = useSelect(
		(select) => ({
			globalStyles: select('kadenceblocks/global-styles').getGlobalStyles(),
		}),
		[]
	);

	const cssVariables = useMemo(() => {
		let outputCssString = '';
		if (!globalStyles || typeof globalStyles !== 'object') {
			return '';
		}
		if (!globalStyleIds || globalStyleIds.length === 0) {
			return '';
		}

		// Loop through global style ids
		globalStyleIds.forEach((styleId) => {
			const styleData = globalStyles?.[styleId];
			if (!styleData) {
				return;
			}
			let currentCssBlock = ''; // Accumulator for the current styleId

			if (styleData?.mappings && typeof styleData.mappings === 'object') {
				// Loop through mappings
				Object.entries(styleData.mappings).forEach(([category, tokens]) => {
					if (tokens && typeof tokens === 'object') {
						// Loop through mapping values
						Object.entries(tokens).forEach(([token, tokenData]) => {
							if (tokenData.value !== undefined && tokenData.value !== null && tokenData.value !== '') {
								const variableName = getMappingVariableName(category, token);
								currentCssBlock += `  ${variableName}: ${tokenData.value};\n`;
							}
						});
					}
				});
			}

			// Assign the generated CSS block to the correct scope
			if (currentCssBlock) {
				outputCssString += currentCssBlock;
			}
		});
		if (selector === '') {
			return outputCssString;
		}
		const globalStylesCssOutput = outputCssString ? selector + '{ ' + outputCssString + ' }' : '';
		return globalStylesCssOutput;
	}, [globalStyles, globalStyleIds, selector]);

	return cssVariables;
}
