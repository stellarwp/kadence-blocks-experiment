import { useMemo } from '@wordpress/element';
import { cssGenerator, getGoogleFontUrl } from '@kadence/kbsHelpers';
import metadata from '../block.json';

export default function Styles(props) {
	const { attributes, previewDevice } = props;
	const cssOutput = useMemo(() => {
		const selector = `.kbs-container-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector);
		
		if (metadata.attributes) {
			Object.entries(metadata.attributes).forEach(([attributeName, value]) => {			
				if (value.renderCSS) {
					if( value?.component === 'typography' ) {
						css.addComponent(attributeName, value, props, metadata);
					} else {
						css.addAttribute(attributeName, value, props);
					}
				}
			});
		}

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice, JSON.stringify(attributes)]);

	const googleFontUrl = useMemo(() => {
		if (!metadata.attributes) {
			return '';
		}
		return getGoogleFontUrl(attributes, metadata.attributes);
	}, [attributes]);

	return (
		<>
			{googleFontUrl && <link href={googleFontUrl} rel="stylesheet" />}
			<style>{cssOutput}</style>
		</>
	);
}