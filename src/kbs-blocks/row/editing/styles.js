import { useMemo } from '@wordpress/element';
import { select } from '@wordpress/data';
import { cssGenerator } from '@kadence/kbsHelpers';
import metadata from '../block.json';

export default function Styles(props) {
	const { attributes, previewDevice, globalStylesCss, globalStylesIds } = props;

	// Get all merged global styles for the block
	const mergedGlobalStyles = select('kadenceblocks/global-styles').getMergedStylesByIds(globalStylesIds);

	const cssOutput = useMemo(() => {
		const selector = `.kbs-container-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector);

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, previewDevice, mergedGlobalStyles]);

	const globalStylesCssOutput = useMemo(() => {
		if (!globalStylesCss) {
			return '';
		}
		return `.kbs-container-${attributes?.uniqueID || 'unknown'}` + '{ ' + globalStylesCss + ' }';
	}, [globalStylesCss, attributes?.uniqueID]);

	return (
		<>
			{globalStylesCssOutput && <style>{globalStylesCssOutput}</style>}
			<style>{cssOutput}</style>
		</>
	);
}
