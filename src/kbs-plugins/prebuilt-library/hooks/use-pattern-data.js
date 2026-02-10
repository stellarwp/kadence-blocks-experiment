/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

import { SafeParseJSON } from '@kadence/kbsHelpers';

/**
 * Custom hook to fetch and manage pattern data
 * Following WordPress data fetching patterns
 */
export const usePatternData = () => {
	const [patterns, setPatterns] = useState([]);
	const [categories, setCategories] = useState([]);
	const [patternsHTML, setPatternsHTML] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reloadLibrary, setReloadLibrary] = useState(false);

	useEffect(() => {
		const fetchPatterns = async () => {
			try {
				setIsLoading(true);

				// Make all API requests in parallel
				const [patternsResponse, patternsHTMLResponse, categoriesResponse] = await Promise.all([
					apiFetch({
						path: addQueryArgs('/kadence-blocks/v1/patterns', {
							force_reload: reloadLibrary,
							library: 'patterns',
							key: 'info',
						}),
					}),
					apiFetch({
						path: addQueryArgs('/kadence-blocks/v1/patterns', {
							force_reload: reloadLibrary,
							library: 'patterns',
							key: 'html',
						}),
					}),
					apiFetch({
						path: addQueryArgs('/kadence-blocks/v1/patterns-categories', {
							force_reload: reloadLibrary,
							library: 'section',
							key: 'section',
						}),
					}),
				]);

				// Process all responses
				if (patternsResponse) {
					setPatterns(SafeParseJSON(patternsResponse));
				}
				if (patternsHTMLResponse) {
					setPatternsHTML(SafeParseJSON(patternsHTMLResponse));
				}
				setCategories(categoriesResponse);
			} catch (err) {
				console.log('catch ERROR', err);
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPatterns();
	}, [reloadLibrary]);

	return {
		patterns,
		categories,
		patternsHTML,
		isLoading,
		error,
		setReloadLibrary,
	};
};
