/**
 * Get options based on the select type
 *
 * @param {Object} params The parameters object
 * @param {string} params.type The type of options to get
 * @param {Object} params.attributes The attributes object
 * @param {string} params.previewDevice The preview device
 * @return {Object} The options and loading state
 */
export const useSelectOptions = ({ forStyleBook = false }) => {
	let options = [];

	// Import the select function from WordPress data
	const { select } = wp.data;

	// Get global styles from the store
	const globalStyles = !forStyleBook
		? select('kadenceblocks/global-styles')?.getGlobalStyles() || []
		: select('kadenceblocks/global-styles')?.getStyleBookLocalGlobalStyles() || [];
	const isLoadingOptions = select('kadenceblocks/global-styles')?.isLoading() || false;

	// Map global styles to options format
	if (globalStyles && Object.keys(globalStyles).length > 0) {
		options = Object.keys(globalStyles).map((key) => {
			const style = globalStyles[key];

			return {
				value: key,
				label: style.label || `Style ${key}`,
			};
		});
		if (!forStyleBook) {
			// Find and remove the base style
			options = options.filter((option) => option.value !== 'kbs-base');
		}
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
