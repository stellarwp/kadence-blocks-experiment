import { useRef, useMemo } from '@wordpress/element';
import { cssGenerator, getGoogleFontUrl } from '@kadence/kbsHelpers';

export default function Styles(props) {
	const { attributes, previewDevice, styleBookAttributes, styleBookLocalGlobalStyles, selectedComponent } = props;

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

	const cssOutput = useMemo(() => {
		const selector = '.kbs-style-book-preview-typography';
		const css = new cssGenerator(selector);

		css.addComponent(selectedComponent, fakeMetaData.attributes[selectedComponent], props);

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice]);

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
