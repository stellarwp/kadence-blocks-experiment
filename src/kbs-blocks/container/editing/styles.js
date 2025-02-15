import { getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';
import { useRef, useMemo } from '@wordpress/element';
import { cssGenerator } from '@kadence/kbsHelpers';
import metadata from '../block.json';

export default function Styles(props) {
	const { attributes, previewDevice } = props;
	const cssOutput = useMemo(() => {
		const selector = `.kbs-container-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector);
		
		if (metadata.attributes) {
			Object.entries(metadata.attributes).forEach(([key, value]) => {
				if (value.renderCSS) {
					css.addAttribute(key, value, props);
				}
			});
		}

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice]);

	return <style>{cssOutput}</style>;
}
