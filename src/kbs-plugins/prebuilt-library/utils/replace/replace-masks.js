/**
 * WordPress dependencies
 */
export default function replaceMasks(content) {
	if (!content) {
		return content;
	}
	//const searchStr = "https://kbs.startertemplatecloud.com/wp-content/plugins/kadence-blocks/includes/assets/images/masks/";
	const searchStr = new RegExp(
		'https://kbs\\.startertemplatecloud\\.com/wp-content/plugins/kadence-blocks/includes/assets/images/masks/',
		'g'
	);
	// Background.
	content = content.replace(searchStr, window?.kbs_params?.svgMaskPath);

	return content;
}
