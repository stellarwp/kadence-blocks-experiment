/**
 * Hook to merge parent global styles with current block's global style IDs
 */

import { useContext, useMemo } from '@wordpress/element';
import { GlobalStylesContext } from '../global-styles-context';

/**
 * Hook to merge parent global styles with current block's global style IDs
 *
 * @param {string|null} globalStyleIds - Comma-separated string of global style IDs for the current block
 * @return {Array} - Array of merged global style IDs
 */
const useGlobalStylesIds = (globalStyleIds) => {
  const parentGlobalStyles = useContext(GlobalStylesContext);
  
  return useMemo(() => {
    const globalStyleIdsArray = globalStyleIds 
      ? globalStyleIds.split(',').filter(Boolean).map(id => parseInt(id, 10)) 
      : [];
    return [...(parentGlobalStyles || []), ...globalStyleIdsArray];
  }, [parentGlobalStyles, globalStyleIds]);
};

export default useGlobalStylesIds; 