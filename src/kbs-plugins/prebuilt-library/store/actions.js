/**
 * Action creators for the prebuilt library store
 */

export function setAIContext( context ) {
	return {
		type: 'SET_AI_CONTEXT',
		context,
	};
}

export function updateAIContextField( field, value ) {
	return {
		type: 'UPDATE_AI_CONTEXT_FIELD',
		field,
		value,
	};
}

export function setAICredits( credits ) {
	return {
		type: 'SET_AI_CREDITS',
		credits,
	};
}

export function setImageCollection( collection ) {
	return {
		type: 'SET_IMAGE_COLLECTION',
		collection,
	};
}

export function setSelectedPattern( pattern ) {
	return {
		type: 'SET_SELECTED_PATTERN',
		pattern,
	};
}

export function setLibrarySettings( settings ) {
	return {
		type: 'SET_LIBRARY_SETTINGS',
		settings,
	};
}