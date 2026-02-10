/**
 * Hook to merge parent global styles with current block's global style IDs
 */

import { useContext, useMemo } from '@wordpress/element';
import { GlobalStylesContext } from '../global-styles-context';

// Stable reference for empty array to prevent unnecessary re-renders
const EMPTY_ARRAY = Object.freeze([]);

/**
 * Hook to merge parent global styles with current block's global style IDs
 *
 * @param {Array|null} globalStyleIds - Array of global style IDs or comma-separated string for the current block
 * @return {Array} - Array of merged global style IDs
 */
const useGlobalStylesIds = (globalStyleIds) => {
	const parentGlobalStyles = useContext(GlobalStylesContext);

	// Memoize the processing of globalStyleIds to avoid unnecessary recalculations
	const processedGlobalStyleIds = useMemo(() => {
		// Handle different formats of globalStyleIds
		if (Array.isArray(globalStyleIds) && globalStyleIds.length > 0) {
			return globalStyleIds;
		}
		return EMPTY_ARRAY;
	}, [globalStyleIds]);

	// Memoize the parent global styles to prevent unnecessary re-renders
	const memoizedParentStyles = useMemo(() => {
		return parentGlobalStyles || EMPTY_ARRAY;
	}, [parentGlobalStyles]);

	// Memoize the final merged result with optimized logic
	const result = useMemo(() => {
		// Early returns to avoid unnecessary array operations
		if (memoizedParentStyles.length === 0) {
			return processedGlobalStyleIds;
		}

		if (processedGlobalStyleIds.length === 0) {
			return memoizedParentStyles;
		}

		// Only merge when both arrays have content
		return [...memoizedParentStyles, ...processedGlobalStyleIds];
	}, [memoizedParentStyles, processedGlobalStyleIds]);

	return result;
};

export default useGlobalStylesIds;
