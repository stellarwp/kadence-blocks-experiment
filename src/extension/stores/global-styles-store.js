import { createReduxStore, register, select } from '@wordpress/data';
import { deepMerge } from '@kadence/kbsHelpers';
import apiFetch from '@wordpress/api-fetch';

/**
 * Default state for the global styles store
 */
const DEFAULT_STATE = {
	globalStyles: [],
	// styleBookLocalGlobalStyles: [],
	styleBookAttributes: {},
	isLoading: false,
	isSavingStyleBook: false,
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
	setIsSavingStyleBook(isSavingStyleBook) {
		return {
			type: 'SET_IS_SAVING_STYLE_BOOK',
			isSavingStyleBook,
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
	setStyleBookAttributes(styleBookAttributes) {
		return {
			type: 'SET_STYLE_BOOK_ATTRIBUTES',
			styleBookAttributes,
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
		// const path = '/kadence-blocks/v1/global-styles';
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
		const styleBookLocalGlobalStyles = yield {
			type: 'SELECT',
			storeName: 'kadenceblocks/global-styles',
			selectorName: 'getStyleBookLocalGlobalStyles',
			args: [],
		};

		//if we don't have any local global styles yet, use the global styles from the server.
		if (styleBookLocalGlobalStyles) {
			return styleBookLocalGlobalStyles;
		} else {
			const globalStyles = yield actions.fetchGlobalStyles();
			yield actions.setStyleBookLocalGlobalStyles(globalStyles);
			return globalStyles;
		}
	},
	*setStyleBookLocalGlobalStyles(styleBookLocalGlobalStyles) {
		return {
			type: 'SET_STYLE_BOOK_LOCAL_GLOBAL_STYLES',
			styleBookLocalGlobalStyles,
		};
	},
	*updateStyleBookLocalGlobalStyles(styleBookLocalGlobalStyles) {
		return {
			type: 'UPDATE_STYLE_BOOK_LOCAL_GLOBAL_STYLES',
			styleBookLocalGlobalStyles,
		};
	},
	*updateStyleBookLocalGlobalStyle(globalStyleId, styleBookLocalGlobalStyle) {
		return {
			type: 'UPDATE_STYLE_BOOK_LOCAL_GLOBAL_STYLE',
			globalStyleId,
			styleBookLocalGlobalStyle,
		};
	},
	*setStyleBookComponentPresetByStyleId(styleId, componentId, presetId, presetVal) {
		return {
			type: 'SET_STYLE_BOOK_COMPONENT_PRESET_BY_STYLE_ID',
			styleId,
			componentId,
			presetId,
			presetVal,
		};
	},
	*setStyleBookComponentPresetAttributesByStyleId(styleId, componentId, presetId, presetAttrs) {
		return {
			type: 'SET_STYLE_BOOK_COMPONENT_PRESET_ATTRIBUTES_BY_STYLE_ID',
			styleId,
			componentId,
			presetId,
			presetAttrs,
		};
	},
	*saveStyleBookGlobalStyles() {
		// Check if we're already loading to prevent duplicate requests
		const isSavingStyleBook = yield {
			type: 'SELECT',
			storeName: 'kadenceblocks/global-styles',
			selectorName: 'isSavingStyleBook',
			args: [],
		};

		// If already loading, don't make another request
		if (isSavingStyleBook) {
			return isSavingStyleBook;
		}
		yield actions.setIsSavingStyleBook(true);

		const styleBookLocalGlobalStyles = yield {
			type: 'SELECT',
			storeName: 'kadenceblocks/global-styles',
			selectorName: 'getStyleBookLocalGlobalStyles',
			args: [],
		};

		if (!styleBookLocalGlobalStyles) {
			return false;
		}

		const path = '/kadence-blocks/v1/global-styles/save';
		try {
			const result = yield {
				type: 'API_FETCH',
				request: {
					path: path,
					method: 'POST',
					data: { data: styleBookLocalGlobalStyles },
				},
			};

			//the saving might have modified the global styles, namely adding a postId so update the data store as well
			if (result.success && result.data) {
				yield {
					type: 'UPDATE_STYLE_BOOK_LOCAL_GLOBAL_STYLES',
					styleBookLocalGlobalStyles: result.data,
				};
			}
			yield actions.setIsSavingStyleBook(false);
			return result;
		} catch (error) {
			console.error('Error saving global styles:', error);
			yield actions.setError(error);
			yield actions.setIsSavingStyleBook(false);
			return [];
		}
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
	*getComponentPresetsBystyleId() {
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
			case 'SET_IS_SAVING_STYLE_BOOK':
				return {
					...state,
					isSavingStyleBook: action.isSavingStyleBook,
				};
			case 'SET_STYLE_BOOK_LOCAL_GLOBAL_STYLES':
				return {
					...state,
					styleBookLocalGlobalStyles: action.styleBookLocalGlobalStyles,
				};
			case 'UPDATE_STYLE_BOOK_LOCAL_GLOBAL_STYLES':
				const stateObject = state?.styleBookLocalGlobalStyles ? state.styleBookLocalGlobalStyles : {};
				return {
					...state,
					styleBookLocalGlobalStyles: Object.assign(stateObject, action.styleBookLocalGlobalStyles),
				};
			case 'UPDATE_STYLE_BOOK_LOCAL_GLOBAL_STYLE':
				const stateObject2 = state?.styleBookLocalGlobalStyles ? state.styleBookLocalGlobalStyles : {};
				return {
					...state,
					styleBookLocalGlobalStyles: Object.assign(stateObject2, {[action.globalStyleId]: action.styleBookLocalGlobalStyle}),
				};
			case 'SET_STYLE_BOOK_COMPONENT_PRESET_BY_STYLE_ID':
				// action.styleId,
				// action.componentId,
				// action.presetId,
				// action.presetVal,

				const presetObjectToSet = {
					[action.styleId]: {
						components: {
							[action.componentId]: {
								presets: {
									[action.presetId]: action.presetVal,
								},
							},
						},
					},
				};
				return {
					...state,
					styleBookLocalGlobalStyles: deepMerge([state.styleBookLocalGlobalStyles, presetObjectToSet]),
				};
			case 'SET_STYLE_BOOK_COMPONENT_PRESET_ATTRIBUTES_BY_STYLE_ID':
				// action.styleId,
				// action.componentId,
				// action.presetId,
				// action.presetAttrs,
				const presetVal = {
					attributes: action.presetAttrs,
				};

				const presetObjectToSet2 = {
					[action.styleId]: {
						components: {
							[action.componentId]: {
								presets: {
									[action.presetId]: presetVal,
								},
							},
						},
					},
				};
				return {
					...state,
					styleBookLocalGlobalStyles: deepMerge([state.styleBookLocalGlobalStyles, presetObjectToSet2]),
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
			case 'SET_STYLE_BOOK_ATTRIBUTES':
				// return {
				// 	...state,
				// 	styleBookAttributes: Object.assign(state.styleBookAttributes, action.styleBookAttributes),
				// };
				return {
					...state,
					styleBookAttributes: { ...state.styleBookAttributes, ...action.styleBookAttributes },
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
		getStyleBookAttributes(state) {
			return state.styleBookAttributes;
		},
		getMergedGlobalStyle(state, styleIds, forStyleBook = false) {
			if (!styleIds || (Array.isArray(styleIds) && styleIds.length === 0)) {
				return {};
			}

			if (!Array.isArray(styleIds)) {
				styleIds = [styleIds];
			}

			// Filter styles that match the provided IDs
			const stylesToMerge = !forStyleBook ? styleIds.map((id) => state.globalStyles?.[id]).filter(Boolean) : styleIds.map((id) => state.styleBookLocalGlobalStyles?.[id]).filter(Boolean); // Remove any undefined values

			if (stylesToMerge.length === 0) {
				return {};
			}

			// Deep merge the styles, with later items in array taking precedence
			const mergedStyles = deepMerge(stylesToMerge);

			// Remove the id property from the merged result
			if (mergedStyles.id) {
				delete mergedStyles.id;
			}

			return mergedStyles;
		},
		isLoading(state) {
			return state.isLoading;
		},
		isSavingStyleBook(state) {
			return state.isSavingStyleBook;
		},
		styleBookLocalGlobalStyles(state) {
			return state.styleBookLocalGlobalStyles;
		},
		getStyleBookLocalGlobalStyles(state) {
			return state.styleBookLocalGlobalStyles;
		},
		getStyleBookComponentPresetByStyleId(state, styleId, componentId, presetId) {
			if (state.styleBookLocalGlobalStyles) {
				const presetToReturn =
					state.styleBookLocalGlobalStyles?.[styleId]?.['components']?.[componentId]?.['presets']?.[presetId];
				if (presetToReturn) {
					return presetToReturn;
				}
			}
			return {};
		},
		getStyleBookComponentPresetsByStyleId(state, styleId, componentId) {
			if (state.styleBookLocalGlobalStyles) {
				const presetToReturn =
					state.styleBookLocalGlobalStyles?.[styleId]?.['components']?.[componentId]?.['presets'];
				if (presetToReturn) {
					return presetToReturn;
				}
			}
			return {};
		},
		getGlobalStylesComponentPresetByStyleId(state, styleId, componentId, presetId) {
			if (state.globalStyles) {
				const presetToReturn =
					state.globalStyles?.[styleId]?.['components']?.[componentId]?.['presets']?.[presetId];
				if (presetToReturn) {
					return presetToReturn;
				}
			}
			return {};
		},
		getGlobalStylesComponentPresetsByStyleId(state, styleId, componentId) {
			if (state.globalStyles) {
				const presetToReturn =
					state.globalStyles?.[styleId]?.['components']?.[componentId]?.['presets'];
				if (presetToReturn) {
					return presetToReturn;
				}
			}
			return {};
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
