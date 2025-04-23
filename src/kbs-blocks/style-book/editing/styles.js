import { useRef, useMemo } from '@wordpress/element';
import { cssGenerator, getGoogleFontUrl } from '@kadence/kbsHelpers';

export default function Styles(props) {
	const {
		previewDevice,
		styleBookAttributes,
		styleBookLocalGlobalStyles,
		currentGlobalStyleId,
		currentPreset,
		selectedComponent,
		selectedTab,
	} = props;

	const fakeMetaData = {
		attributes: {
			typography: {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview',
				initial: {},
				type: 'object',
			},
		},
	};

	var attributes =
		styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]?.presets?.[currentPreset]
			?.attributes;

	const cssOutput = useMemo(() => {
		const selector = '.kbs-style-book-preview-typography';
		const css = new cssGenerator(selector);

		if (selectedTab == 'presets') {
			css.addComponent(
				selectedComponent,
				fakeMetaData.attributes[selectedComponent],
				{ attributes, previewDevice },
				fakeMetaData
			);
		} else {
			const componentsToRender = ['typography'];
			const presetToRender = 'text-heading';
			componentsToRender.forEach((componentToRender) => {
				attributes =
					styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[componentToRender]?.presets?.[
						presetToRender
					]?.attributes;

				css.addComponent(
					componentToRender,
					fakeMetaData.attributes[componentToRender],
					{ attributes, previewDevice },
					fakeMetaData
				);
			});
		}

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice, selectedTab]);

	// console.log('style', cssOutput, selectedComponent, attributes, styleBookLocalGlobalStyles);

	const googleFontUrl = useMemo(() => {
		if (!fakeMetaData.attributes) {
			return '';
		}
		return getGoogleFontUrl(attributes, fakeMetaData.attributes);
	}, [attributes]);

	return (
		<>
			{googleFontUrl && <link href={googleFontUrl} rel="stylesheet" />}
			<style>{cssOutput}</style>
		</>
	);
}
