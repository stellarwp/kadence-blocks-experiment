import { createReduxStore, register, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { find } from 'lodash';

/**
 * Default state for the global styles store
 */
const DEFAULT_STATE = {
	globalStyles: [],
	isLoading: false,
	hasResolved: false,
	error: null,
};

/**
 * Controls for handling API requests
 */
const controls = {
	API_FETCH({ request }) {
		return apiFetch(request);
	},
	SELECT({ storeName, selectorName, args }) {
		return select(storeName)[selectorName](...args);
	},
};

/**
 * Store actions
 */
const actions = {
	setGlobalStyles(globalStyles) {
		return {
			type: 'SET_GLOBAL_STYLES',
			globalStyles,
		};
	},
	setIsLoading(isLoading) {
		return {
			type: 'SET_IS_LOADING',
			isLoading,
		};
	},
	setHasResolved(hasResolved) {
		return {
			type: 'SET_HAS_RESOLVED',
			hasResolved,
		};
	},
	setError(error) {
		return {
			type: 'SET_ERROR',
			error,
		};
	},
	*fetchGlobalStyles() {
		// Check if we're already loading to prevent duplicate requests
		const isLoading = yield {
			type: 'SELECT',
			storeName: 'kadenceblocks/global-styles',
			selectorName: 'isLoading',
			args: [],
		};

		// If already loading, don't make another request
		if (isLoading) {
			// Return current state of global styles
			return yield {
				type: 'SELECT',
				storeName: 'kadenceblocks/global-styles',
				selectorName: 'getGlobalStyles',
				args: [],
			};
		}

		yield actions.setIsLoading(true);
		const path = '/kadence-blocks/v1/global-styles/get-demo';
		try {
			const globalStyles = yield {
				type: 'API_FETCH',
				request: { path },
			};
			yield actions.setGlobalStyles(globalStyles);
			yield actions.setHasResolved(true);
			yield actions.setIsLoading(false);
			return globalStyles;
		} catch (error) {
			console.error('Error fetching global styles:', error);
			yield actions.setError(error);
			yield actions.setHasResolved(true);
			yield actions.setIsLoading(false);
			return [];
		}
	},
	*fetchStyleBookLocalGlobalStyles() {
		// Check if we're already loading to prevent duplicate requests
		const isLoading = yield {
			type: 'SELECT',
			storeName: 'kadenceblocks/global-styles',
			selectorName: 'styleBookLocalGlobalStyles',
			args: [],
		};
	},
	*setStyleBookLocalGlobalStyles(styleBookLocalGlobalStyles) {
		return {
			type: 'SET_STYLE_BOOK_LOCAL_GLOBAL_STYLES',
			styleBookLocalGlobalStyles,
		};
	},
};

/**
 * Resolvers for the store
 */
const resolvers = {
	*getGlobalStyles() {
		// Directly initiate the fetch without any checks for the first load
		return yield actions.fetchGlobalStyles();
	},
	*getStyleBookLocalGlobalStyles() {
		// Directly initiate the fetch without any checks for the first load
		return yield actions.fetchStyleBookLocalGlobalStyles();
	},
	*getGlobalStyleByName() {
		yield resolvers.getGlobalStyles();
	},
	*getGlobalStyleById() {
		yield resolvers.getGlobalStyles();
	},
	*getComponentPresets() {
		yield resolvers.getGlobalStyles();
	},
	*getComponentPresetsByStyleName() {
		yield resolvers.getGlobalStyles();
	},
	*getMergedGlobalStyle() {
		yield resolvers.getGlobalStyles();
	},
};

/**
 * The global styles store
 */
const store = createReduxStore('kadenceblocks/global-styles', {
	reducer(state = DEFAULT_STATE, action) {
		switch (action.type) {
			case 'SET_GLOBAL_STYLES':
				return {
					...state,
					globalStyles: action.globalStyles,
				};
			case 'SET_IS_LOADING':
				return {
					...state,
					isLoading: action.isLoading,
				};
			case 'SET_STYLE_BOOK_LOCAL_GLOBAL_STYLES':
				return {
					...state,
					styleBookLocalGlobalStyles: action.styleBookLocalGlobalStyles,
				};
			case 'SET_HAS_RESOLVED':
				return {
					...state,
					hasResolved: action.hasResolved,
				};
			case 'SET_ERROR':
				return {
					...state,
					error: action.error,
				};
			default:
				return state;
		}
	},
	actions,
	controls,
	selectors: {
		getGlobalStyles(state) {
			return state.globalStyles;
		},
		getMergedGlobalStyle(state, styleIds) {
			if (!styleIds || (Array.isArray(styleIds) && styleIds.length === 0)) {
				return {};
			}

			if (!Array.isArray(styleIds)) {
				styleIds = [styleIds];
			}

			// Filter styles that match the provided IDs
			const stylesToMerge = styleIds.map((id) => find(state.globalStyles, { id })).filter(Boolean); // Remove any undefined values

			if (stylesToMerge.length === 0) {
				return {};
			}

			// Deep merge the styles, with later items in array taking precedence
			const mergedStyles = stylesToMerge.reduce((result, style) => {
				// Deep merging objects
				const deepMerge = (target, source) => {
					const output = { ...target };

					if (isObject(target) && isObject(source)) {
						Object.keys(source).forEach((key) => {
							if (isObject(source[key])) {
								if (!(key in target)) {
									Object.assign(output, { [key]: source[key] });
								} else {
									output[key] = deepMerge(target[key], source[key]);
								}
							} else {
								Object.assign(output, { [key]: source[key] });
							}
						});
					}
					return output;
				};

				// Helper to check if value is an object
				const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

				return deepMerge(result, style);
			}, {});

			// Remove the id property from the merged result
			if (mergedStyles.id) {
				delete mergedStyles.id;
			}

			return mergedStyles;
		},
		isLoading(state) {
			return state.isLoading;
		},
		styleBookLocalGlobalStyles(state) {
			return state.styleBookLocalGlobalStyles;
		},
		getStyleBookLocalGlobalStyles(state) {
			return state.styleBookLocalGlobalStyles;
		},
		hasResolved(state) {
			return state.hasResolved;
		},
		getError(state) {
			return state.error;
		},
	},
	resolvers,
});

register(store);
