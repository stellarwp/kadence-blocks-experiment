/**
 * Build a Google Font URL from block attributes
 */

/**
 * Get Google Font URL from block attributes
 * @param {Object} attributes - Block attributes
 * @param {Object} attributesMeta - Block attributes metadata
 * @returns {string} The Google Font URL
 */
export default function getLinkHTML(link, children, className = '', enableClick = false) {
	const classString = className + (link?.linkStyle ? ' ' + link?.linkStyle : '');
	let rel = '';
	if (link?.linkTarget) {
		link.target = '_blank';
		rel += 'noreferrer noopener';
	}
	if (link?.linkNoFollow) {
		if (!empty(rel)) {
			rel += ' nofollow';
		} else {
			rel += 'nofollow';
		}
	}
	if (link?.linkSponsored) {
		if (!empty(rel)) {
			rel += ' sponsored';
		} else {
			rel += 'sponsored';
		}
	}

	return (
		<a
			href={link?.url}
			className={classString || undefined}
			target={link?.target}
			rel={rel || undefined}
			onClick={(event) => {
				enableClick ? null : event.preventDefault();
			}}
		>
			{children}
		</a>
	);
}
