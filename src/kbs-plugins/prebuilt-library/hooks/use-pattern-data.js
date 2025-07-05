/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Custom hook to fetch and manage pattern data
 * Following WordPress data fetching patterns
 */
export const usePatternData = () => {
	const [patterns, setPatterns] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reloadLibrary, setReloadLibrary] = useState(false);

	useEffect(() => {
		const fetchPatterns = async () => {
			try {
				setIsLoading(true);

				const patternsResponse = await apiFetch({
					path: addQueryArgs('/kadence-blocks/v1/patterns', {
						force_reload: reloadLibrary,
						library: 'section',
						key: 'section',
					}),
				});
				// Fetch categories
				const categoriesResponse = await apiFetch({
					path: addQueryArgs('/kadence-blocks/v1/patterns-categories', {
						force_reload: reloadLibrary,
						library: 'section',
						key: 'section',
					}),
				});

				setPatterns(patternsResponse);
				setCategories(categoriesResponse);
			} catch (err) {
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
		isLoading,
		error,
		setReloadLibrary,
	};
};
