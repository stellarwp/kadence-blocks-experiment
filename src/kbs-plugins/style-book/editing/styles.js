import { useRef, useMemo } from '@wordpress/element';
import { cssGenerator } from '@kadence/kbsHelpers';

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
	const selector = '.kbs-style-book-controls-preview';
	const fakeMetaData = {
		attributes: {
			typography: {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-',
				initial: {},
				type: 'object',
				tag: 'h1',
			},
			heading: {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-',
				initial: {},
				type: 'object',
				tag: 'h1',
			},
			'heading-1': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-1-',
				initial: {},
				type: 'object',
				tag: 'h1',
			},
			'heading-2': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-2-',
				initial: {},
				type: 'object',
				tag: 'h2',
			},
			'heading-3': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-3-',
				initial: {},
				type: 'object',
				tag: 'h3',
			},
			'heading-4': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-4-',
				initial: {},
				type: 'object',
				tag: 'h4',
			},
			'heading-5': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-5-',
				initial: {},
				type: 'object',
				tag: 'h5',
			},
			'heading-6': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-heading-6-',
				initial: {},
				type: 'object',
				tag: 'h6',
			},
			'text-body': {
				renderCSS: true,
				component: 'typography',
				selector: '--kbs-preview-body-',
				initial: {},
				type: 'object',
				tag: 'p',
			},
		},
	};

	let attributes = {
		[selectedComponent]:
			styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]?.presets?.[
				currentPreset
			]?.attributes,
	};

	const cssOutput = useMemo(() => {
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
				'heading',
				'heading-1',
				'heading-2',
				'heading-3',
				'heading-4',
				'heading-5',
				'heading-6',
				'text-body',
			];
			let i = 0;
			componentsToRender.forEach((componentToRender) => {
				attributes = {
					[componentToRender]:
						styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[componentToRender]?.presets?.[
							presetsToRender[i]
						]?.attributes,
				};

				// css.addComponent(
				// 	componentToRender,
				// 	fakeMetaData.attributes[presetsToRender[i]],
				// 	{ attributes, previewDevice },
				// 	fakeMetaData
				// );
				i++;
			});
		}

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice, selectedTab]);

	const tempColors = styleBookLocalGlobalStyles[currentGlobalStyleId]?.mappings?.colors || [];
	const tempGradients = styleBookLocalGlobalStyles[currentGlobalStyleId]?.mappings?.gradients || [];
	const baseVariables = useMemo(() => {
		let outputCssString = '';
		if (tempColors) {
			// Loop through global style ids
			Object.entries(tempColors).forEach(([key, value]) => {
				if (value?.value) {
					outputCssString += `--kbs-colors-${key}: ${value.value};\n`;
				}
			});
		}
		if (tempGradients) {
			Object.entries(tempGradients).forEach(([key, value]) => {
				if (value?.value) {
					outputCssString += `--kbs-gradients-${key}: ${value.value};\n`;
				}
			});
		}
		const globalStylesCssOutput = outputCssString ? selector + '{ ' + outputCssString + ' }' : '';
		return globalStylesCssOutput;
	}, [tempColors, tempGradients]);
	// console.log('style', cssOutput, selectedComponent, attributes, styleBookLocalGlobalStyles);

	return (
		<>
			<style>{cssOutput + baseVariables}</style>
		</>
	);
}
