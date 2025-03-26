/**
 * Get an options array from a global styles preset object.
 */
export default function getGlobalStylesPresetOptions(globalStyles, globalStyle, component) {
	const presetsObject = globalStyles?.[globalStyle]?.components?.[component]?.presets;
	var toReturn = [];

	if (presetsObject && Object.keys(presetsObject).length) {
		Object.keys(presetsObject).forEach(function (key, index) {
			toReturn.push({ value: key, label: presetsObject[key].name });
		});
	}

	return toReturn;
}
