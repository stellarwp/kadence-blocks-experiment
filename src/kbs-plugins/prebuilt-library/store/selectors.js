/**
 * Selectors for the prebuilt library store
 */

export function getAIContext( state ) {
	return state.aiContext;
}

export function getAIContextField( state, field ) {
	return state.aiContext?.[ field ];
}

export function getAICredits( state ) {
	return state.aiCredits;
}

export function getImageCollection( state ) {
	return state.imageCollection;
}

export function getSelectedPattern( state ) {
	return state.selectedPattern;
}

export function getLibrarySettings( state ) {
	return state.librarySettings;
}

export function hasAIContext( state ) {
	const context = state.aiContext;
	return context && Object.values( context ).some( value => value );
}