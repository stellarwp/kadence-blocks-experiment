/**
 * Gets variable name from category and type
 */
export default function getMappingVariableName(category, type, isBase = false) {
	let prefix = 'kbs-';
	let categorySlug = String(category)
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	if (isBase && (categorySlug === 'colors' || categorySlug === 'gradients')) {
		categorySlug = 'global';
		prefix = '';
	}
	const typeSlug = String(type)
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	return `--${prefix}${categorySlug}-${typeSlug}`;
}
