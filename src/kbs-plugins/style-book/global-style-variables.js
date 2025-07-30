import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { store as editPostStore } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Gets variable name from category and type
 */
export function getMappingVariableName(category, type, isBase = false) {
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

/**
 * Component to output global style variables to the editor
 */
const specialTypographyPresets = [
	'body',
	'heading',
	'heading-1',
	'heading-2',
	'heading-3',
	'heading-4',
	'heading-5',
	'heading-6',
];

export const GlobalStyleVariableOutput = () => {
	const { globalStyles, previewDevice, googleFonts } = useSelect(
		(select) => ({
			globalStyles: select('kadenceblocks/global-styles').getGlobalStyles(),
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			googleFonts: select('kadenceblocks/data').getGoogleFonts(),
		}),
		[]
	);

	const cssVariables = useMemo(() => {
		let rootCssString = '';
		const classCssStrings = {}; // Store CSS strings per class selector

		if (!globalStyles || typeof globalStyles !== 'object') {
			return '';
		}

		const deviceOptions = window?.kbs_params?.responsive_device_options || [];
		const currentDeviceIndex = deviceOptions.findIndex(
			(option) =>
				option.key?.toLowerCase() === previewDevice.toLowerCase() ||
				option.name?.toLowerCase() === previewDevice.toLowerCase()
		);

		// Loop through global styles
		Object.entries(globalStyles).forEach(([styleId, styleData]) => {
			if (styleId !== 'kbs-base') {
				return;
			}
			let currentCssBlock = ''; // Accumulator for the current styleId

			if (styleData?.mappings && typeof styleData.mappings === 'object') {
				// Loop through mappings
				Object.entries(styleData.mappings).forEach(([category, tokens]) => {
					if (tokens && typeof tokens === 'object') {
						// Loop through mapping values
						Object.entries(tokens).forEach(([token, tokenData]) => {
							if (tokenData.value !== undefined && tokenData.value !== null && tokenData.value !== '') {
								const variableName = getMappingVariableName(category, token);
								if ((category === 'colors' || category === 'gradients') && styleId === 'kbs-base') {
									const baseVariableName = getMappingVariableName(category, token, true);
									currentCssBlock += `  ${variableName}: ${tokenData.value};\n`;
									currentCssBlock += `  ${baseVariableName}: ${tokenData.value};\n`;
								} else {
									currentCssBlock += `  ${variableName}: ${tokenData.value};\n`;
								}
							}
						});
					}
				});
			}

			// Loop through components
			if (styleData?.components && typeof styleData.components === 'object') {
				Object.entries(styleData.components).forEach(([component, componentData]) => {
					// Loop through special presets on components
					if (componentData?.presets && typeof componentData.presets === 'object') {
						Object.entries(componentData.presets).forEach(([preset, presetData]) => {
							if ('typography' === component && specialTypographyPresets.includes(preset)) {
								// Try to get attributes for the current device
								let attributes = presetData?.attributes?.[previewDevice.toLowerCase()];

								// If attributes aren't found for the current device, check parent devices
								if (!attributes && currentDeviceIndex > 0) {
									for (let i = currentDeviceIndex - 1; i >= 0; i--) {
										const parentDevice = deviceOptions[i];
										const parentDeviceName = parentDevice.key || parentDevice.name;

										if (presetData?.attributes?.[parentDeviceName]) {
											attributes = presetData.attributes[parentDeviceName];
											break;
										}
									}
								}

								if (typeof attributes === 'object' && attributes !== null) {
									Object.entries(attributes).forEach(([key, value]) => {
										const kebabCaseKey = String(key)
											.replace(/([A-Z])/g, '-$1')
											.replace(/^-+|-+$/g, '')
											.toLowerCase();

										// Initialize mappingValue variable
										let mappingValue;

										if (
											key === 'fontSize' &&
											styleData.mappings &&
											styleData.mappings[key] &&
											styleData.mappings[key][value]
										) {
											// Get mapping value
											mappingValue = styleData.mappings[key][value];
										}
										const returnValue = mappingValue !== undefined ? mappingValue.value : value;
										const variableName = getMappingVariableName(kebabCaseKey, preset);
										currentCssBlock += `  ${variableName}: ${returnValue};\n`;
									});
								}
							}
						});
					}
				});
			}

			// Assign the generated CSS block to the correct scope
			if (currentCssBlock) {
				if (styleId === 'kbs-base') {
					rootCssString += currentCssBlock;
				} else {
					const styleSlug = String(styleId)
						.replace(/[^a-zA-Z0-9-_]/g, '-')
						.replace(/^-+|-+$/g, '');
					const className = `.kbs-global-style-${styleSlug}`;
					if (!classCssStrings[className]) {
						classCssStrings[className] = '';
					}
					classCssStrings[className] += currentCssBlock;
				}
			}
		});

		// Construct the final CSS string
		let finalCssString = '';
		if (rootCssString) {
			finalCssString += `:root {\n${rootCssString}}\n`;
		}
		Object.entries(classCssStrings).forEach(([className, cssProps]) => {
			if (cssProps) {
				finalCssString += `${className} {\n${cssProps}}\n`;
			}
		});

		//console.log(finalCssString);

		return finalCssString;
	}, [globalStyles, previewDevice]);

	const googleFontsUrls = useMemo(() => {
		if (!googleFonts || typeof googleFonts !== 'object') {
			return [];
		}

		const fontUrls = Object.entries(googleFonts).flatMap(([fontFamily, data]) => {
			if (data?.variable) {
				return [
					{
						url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${data?.variable}&display=swap`,
						id: fontFamily.replace(/ /g, '-').toLowerCase(),
					},
				];
			} else if (data.weights && data.weights.length > 0) {
				//const weights = data.weights.join(',');
				return data.weights.map((weight) => {
					return {
						url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${weight}&display=swap`,
						id: fontFamily.replace(/ /g, '-').toLowerCase() + '-' + weight,
					};
				});
			} else {
				return [
					{
						url: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`,
						id: fontFamily.replace(/ /g, '-').toLowerCase(),
					},
				];
			}
		});

		return fontUrls;
	}, [googleFonts]);

	useEffect(() => {
		const styleId = 'kadence-global-styles-variables';
		let iframeDoc;
		try {
			iframeDoc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document;
		} catch (e) {
			console.error('Could not access iframe document:', e);
			return;
		}

		const updateOrCreateStyleTag = (doc, id, css) => {
			let styleTag = doc.getElementById(id);

			if (!css || !/\S/.test(css.replace(/:root\s*{\s*}\s*/g, '').replace(/\.\S+\s*{\s*}\s*/g, ''))) {
				// If CSS is empty or effectively empty, remove the style tag if it exists
				if (styleTag) {
					styleTag.remove();
				}
				return;
			}

			if (!styleTag) {
				styleTag = doc.createElement('style');
				styleTag.id = id;
				if (doc?.head) {
					doc.head.appendChild(styleTag);
				}
			}
			if (styleTag.textContent !== css) {
				styleTag.textContent = css;
			}
		};
		if (!iframeDoc) {
			const timeoutId = setTimeout(() => {
				iframeDoc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document;
				if (iframeDoc) {
					updateOrCreateStyleTag(iframeDoc, styleId, cssVariables);
					updateOrCreateStyleTag(document, styleId, cssVariables);
				} else {
					console.warn('Editor iframe still not found after delay.');
				}
			}, 250);
			return () => clearTimeout(timeoutId);
		}
		updateOrCreateStyleTag(iframeDoc, styleId, cssVariables);
		updateOrCreateStyleTag(document, styleId, cssVariables);

		// Cleanup the style tag when the component unmounts
		return () => {
			if (iframeDoc) {
				const styleTag = iframeDoc.getElementById(styleId);
				if (styleTag) {
					styleTag.remove();
				}
			}
			const docStyleTag = document.getElementById(styleId);
			if (docStyleTag) {
				docStyleTag.remove();
			}
		};
	}, [cssVariables, previewDevice]);

	useEffect(() => {
		const styleId = 'kadence-global-fonts-';
		let iframeDoc;
		try {
			iframeDoc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document;
		} catch (e) {
			console.error('Could not access iframe document:', e);
			return;
		}

		const updateOrCreateLinkTags = (doc, id, fontUrls) => {
			console.log('fontUrls', fontUrls);
			fontUrls.map((font) => {
				const linkID = id + font.id; // Make lowercase and replace spaces with hyphens
				let linkTag = doc.getElementById(linkID);
				if (!linkTag) {
					linkTag = doc.createElement('link');
					linkTag.id = linkID;
					linkTag.rel = 'stylesheet';
					linkTag.href = font.url;
					if (doc?.head) {
						doc.head.appendChild(linkTag);
					}
				}
			});
		};
		if (!iframeDoc) {
			const timeoutId = setTimeout(() => {
				iframeDoc = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document;
				if (iframeDoc) {
					updateOrCreateLinkTags(iframeDoc, styleId, googleFontsUrls);
					updateOrCreateLinkTags(document, styleId, googleFontsUrls);
				} else {
					console.warn('Editor iframe still not found after delay.');
				}
			}, 250);
			return () => clearTimeout(timeoutId);
		}
		updateOrCreateLinkTags(iframeDoc, styleId, googleFontsUrls);
		updateOrCreateLinkTags(document, styleId, googleFontsUrls);

		// Cleanup the style tag when the component unmounts
		return () => {
			if (iframeDoc) {
				fontUrls.map((font) => {
					const linkID = id + font.id;
					const linkTag = iframeDoc.getElementById(linkID);
					if (linkTag) {
						linkTag.remove();
					}
				});
			}
			fontUrls.map((font) => {
				const linkID = id + font.id;
				const linkTag = document.getElementById(linkID);
				if (linkTag) {
					linkTag.remove();
				}
			});
		};
	}, [previewDevice, googleFontsUrls]);

	return null;
};

registerPlugin('kadence-global-style-variable-output', {
	render: GlobalStyleVariableOutput,
	icon: null,
});
