/**
 * Hook to merge parent global styles with current block's global style IDs
 */

import { useContext, useMemo } from '@wordpress/element';
import { GlobalStylesContext } from '../global-styles-context';

/**
 * Hook to merge parent global styles with current block's global style IDs
 *
 * @param {Array|null} globalStyleIds - Array of global style IDs or comma-separated string for the current block
 * @return {Array} - Array of merged global style IDs
 */
const useGlobalStylesIds = (globalStyleIds) => {
	const parentGlobalStyles = useContext(GlobalStylesContext);

	return useMemo(() => {
		let globalStyleIdsArray = [];

		// Handle different formats of globalStyleIds
		if (Array.isArray(globalStyleIds) && globalStyleIds.length > 0) {
			globalStyleIdsArray = globalStyleIds;
		}

		return [...(parentGlobalStyles || []), ...globalStyleIdsArray];
	}, [parentGlobalStyles, globalStyleIds]);
};

export default useGlobalStylesIds;
