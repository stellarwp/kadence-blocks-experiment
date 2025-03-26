/**
 * Get options based on the select type
 *
 * @param {Object} params The parameters object
 * @param {string} params.type The type of options to get
 * @param {Object} params.attributes The attributes object
 * @param {string} params.previewDevice The preview device
 * @return {Object} The options and loading state
 */
export const useSelectOptions = ({}) => {
	let options = [];

	// Import the select function from WordPress data
	const { select } = wp.data;

	// Get global styles from the store
	const globalStyles = select('kadenceblocks/global-styles')?.getGlobalStyles() || [];
	const isLoadingOptions = select('kadenceblocks/global-styles')?.isLoading() || false;

	// Map global styles to options format
	if (globalStyles && Object.keys(globalStyles).length > 0) {
		options = Object.keys(globalStyles).map((key) => ({
			value: key,
			label: globalStyles[key].name || `Style ${key}`,
		}));
	} else {
		// Fallback options if no global styles are found
		options = [
			{
				value: '1',
				label: 'Global Style 1',
			},
			{
				value: '2',
				label: 'Global Style 2',
			},
		];
	}

	return {
		options,
		isLoadingOptions,
	};
};
