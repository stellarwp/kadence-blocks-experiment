import { useMemo } from '@wordpress/element';
import { select } from '@wordpress/data';
import { cssGenerator, getGoogleFontUrl } from '@kadence/kbsHelpers';
import metadata from '../block.json';

export default function Styles(props) {
	const { attributes, previewDevice, globalStylesCss, globalStylesIds } = props;

	// Get all merged global styles for the block
	const mergedGlobalStyles = select('kadenceblocks/global-styles').getMergedStylesByIds(globalStylesIds);

	const cssOutput = useMemo(() => {
		const selector = `.kbs-container-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector, props, metadata);

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, attributes?.uniqueID, previewDevice, mergedGlobalStyles]);

	const googleFontUrl = useMemo(() => {
		if (!metadata.attributes) {
			return '';
		}
		return getGoogleFontUrl(attributes, metadata.attributes);
	}, [attributes]);

	const globalStylesCssOutput = useMemo(() => {
		if (!globalStylesCss) {
			return '';
		}
		return `.kbs-container-${attributes?.uniqueID || 'unknown'}` + '{ ' + globalStylesCss + ' }';
	}, [globalStylesCss, attributes?.uniqueID]);

	return (
		<>
			{googleFontUrl && <link href={googleFontUrl} rel="stylesheet" />}
			{globalStylesCssOutput && <style>{globalStylesCssOutput}</style>}
			<style>{cssOutput}</style>
		</>
	);
}
