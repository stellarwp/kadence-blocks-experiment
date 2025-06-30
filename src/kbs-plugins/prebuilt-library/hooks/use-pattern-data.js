/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook to fetch and manage pattern data
 * Following WordPress data fetching patterns
 */
export const usePatternData = () => {
	const [ patterns, setPatterns ] = useState( [] );
	const [ categories, setCategories ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchPatterns = async () => {
			try {
				setIsLoading( true );
				
				// Fetch patterns from REST API
				const patternsResponse = await apiFetch( {
					path: '/kadence-blocks/v1/patterns',
				} );
				
				// Fetch categories
				const categoriesResponse = await apiFetch( {
					path: '/kadence-blocks/v1/pattern-categories',
				} );
				
				setPatterns( patternsResponse );
				setCategories( categoriesResponse );
			} catch ( err ) {
				setError( err.message );
			} finally {
				setIsLoading( false );
			}
		};

		fetchPatterns();
	}, [] );

	return {
		patterns,
		categories,
		isLoading,
		error,
	};
};