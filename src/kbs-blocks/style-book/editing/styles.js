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
				selector: '--kbs-preview-heading',
				initial: {},
				type: 'object',
			},
			'text-heading': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading',
				initial: {},
				type: 'object',
			},
			'text-heading-1': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-1',
				initial: {},
				type: 'object',
			},
			'text-heading-2': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-2',
				initial: {},
				type: 'object',
			},
			'text-heading-3': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-3',
				initial: {},
				type: 'object',
			},
			'text-heading-4': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-4',
				initial: {},
				type: 'object',
			},
			'text-heading-5': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-5',
				initial: {},
				type: 'object',
			},
			'text-heading-6': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-6',
				initial: {},
				type: 'object',
			},
			'text-body': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-body',
				initial: {},
				type: 'object',
			},
		},
	};

	var attributes = {
		[selectedComponent]:
			styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]?.presets?.[
				currentPreset
			]?.attributes,
	};

	const cssOutput = useMemo(() => {
		const selector = '.kbs-style-book-component-preview';
		const css = new cssGenerator(selector);

		if (selectedTab == 'presets') {
			css.addComponent(
				selectedComponent,
				fakeMetaData.attributes[selectedComponent],
				{ attributes, previewDevice },
				fakeMetaData
			);
		} else {
			const componentsToRender = [
				'typography',
				'typography',
				'typography',
				'typography',
				'typography',
				'typography',
				'typography',
				'typography',
			];
			const presetsToRender = [
				'text-heading',
				'text-heading-1',
				'text-heading-2',
				'text-heading-3',
				'text-heading-4',
				'text-heading-5',
				'text-heading-6',
				'text-body',
			];
			var i = 0;
			componentsToRender.forEach((componentToRender) => {
				attributes = {
					[componentToRender]:
						styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[componentToRender]?.presets?.[
							presetsToRender[i]
						]?.attributes,
				};

				css.addComponent(
					componentToRender,
					fakeMetaData.attributes[presetsToRender[i]],
					{ attributes, previewDevice },
					fakeMetaData
				);
				i++;
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
