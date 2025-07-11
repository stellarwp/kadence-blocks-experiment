/**
 * WordPress dependencies
 */
export default function replaceBackgrounds(content, backgrounds = {}) {
	if (!content) {
		return content;
	}
	const variant1 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-1"></div>', 'g');
	const variant2 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-2"></div>', 'g');
	const variant3 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-3"></div>', 'g');
	const variant4 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-4"></div>', 'g');
	const variant5 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-5"></div>', 'g');
	const variant6 = new RegExp('<div class="kbs-bg-placeholder-kbs-bg-variant-6"></div>', 'g');
	console.log(backgrounds);
	// Background.
	content = content.replace(
		variant1,
		backgrounds?.['kbs-bg-variant-1']?.html + '<style>' + backgrounds?.['kbs-bg-variant-1']?.css + '</style>'
	);
	content = content.replace(
		variant2,
		backgrounds?.['kbs-bg-variant-2']?.html + '<style>' + backgrounds?.['kbs-bg-variant-2']?.css + '</style>'
	);
	content = content.replace(
		variant3,
		backgrounds?.['kbs-bg-variant-3']?.html + '<style>' + backgrounds?.['kbs-bg-variant-3']?.css + '</style>'
	);
	content = content.replace(
		variant4,
		backgrounds?.['kbs-bg-variant-4']?.html + '<style>' + backgrounds?.['kbs-bg-variant-4']?.css + '</style>'
	);
	content = content.replace(
		variant5,
		backgrounds?.['kbs-bg-variant-5']?.html + '<style>' + backgrounds?.['kbs-bg-variant-5']?.css + '</style>'
	);
	content = content.replace(
		variant6,
		backgrounds?.['kbs-bg-variant-6']?.html + '<style>' + backgrounds?.['kbs-bg-variant-6']?.css + '</style>'
	);
	return content;
}
