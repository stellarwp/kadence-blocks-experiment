/**
 * Global Styles Context
 * 
 * This context is used to pass global styles information down the component tree
 */

import { createContext } from '@wordpress/element';

// Create a React context for global styles with an empty array as default value
const GlobalStylesContext = createContext([]);

// Export the context
export { GlobalStylesContext }; 