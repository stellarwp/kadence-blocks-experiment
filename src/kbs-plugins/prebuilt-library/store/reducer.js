/**
 * Reducer for the prebuilt library store
 */

const DEFAULT_STATE = {
	aiContext: {
		businessName: '',
		businessType: '',
		businessDescription: '',
		keywords: '',
		location: '',
		tone: 'professional',
	},
	aiCredits: 0,
	imageCollection: null,
	selectedPattern: null,
	librarySettings: {
		viewMode: 'grid',
		useAI: false,
		defaultTab: 'patterns',
	},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_AI_CONTEXT':
			return {
				...state,
				aiContext: action.context,
			};

		case 'UPDATE_AI_CONTEXT_FIELD':
			return {
				...state,
				aiContext: {
					...state.aiContext,
					[ action.field ]: action.value,
				},
			};

		case 'SET_AI_CREDITS':
			return {
				...state,
				aiCredits: action.credits,
			};

		case 'SET_IMAGE_COLLECTION':
			return {
				...state,
				imageCollection: action.collection,
			};

		case 'SET_SELECTED_PATTERN':
			return {
				...state,
				selectedPattern: action.pattern,
			};

		case 'SET_LIBRARY_SETTINGS':
			return {
				...state,
				librarySettings: {
					...state.librarySettings,
					...action.settings,
				},
			};

		default:
			return state;
	}
};

export default reducer;