/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook to fetch and manage template data
 */
export const useTemplateData = () => {
	const [ templates, setTemplates ] = useState( [] );
	const [ templateTypes, setTemplateTypes ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchTemplates = async () => {
			try {
				setIsLoading( true );
				
				// Fetch templates from REST API
				const templatesResponse = await apiFetch( {
					path: '/kadence-blocks/v1/templates',
				} );
				
				// Fetch template types
				const typesResponse = await apiFetch( {
					path: '/kadence-blocks/v1/template-types',
				} );
				
				setTemplates( templatesResponse );
				setTemplateTypes( typesResponse );
			} catch ( err ) {
				setError( err.message );
			} finally {
				setIsLoading( false );
			}
		};

		fetchTemplates();
	}, [] );

	return {
		templates,
		templateTypes,
		isLoading,
		error,
	};
};