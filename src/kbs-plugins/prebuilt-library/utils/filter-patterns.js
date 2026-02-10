/**
 * Filter patterns based on search term and category
 *
 * @param {Array} patterns - Array of pattern objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.searchTerm - Search term to filter by
 * @param {string} filters.category - Category slug to filter by
 * @return {Array} Filtered patterns
 */
export const filterPatterns = (patterns, { searchTerm = '', category = 'all' }) => {
	return patterns.filter((pattern) => {
		// Search filter
		const matchesSearch =
			!searchTerm ||
			pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pattern.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

		// Category filter
		const matchesCategory = category === 'all' || pattern.categories?.includes(category);

		return matchesSearch && matchesCategory;
	});
};
