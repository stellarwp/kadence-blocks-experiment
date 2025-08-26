/**
 * Kadence Text Block CSS
 */

/**
 * Import External
 */
import { useMemo, useEffect } from '@wordpress/element';
import { select } from '@wordpress/data';
import { cssGenerator } from '@kadence/kbsHelpers';
import metadata from '../block.json';

export default function Styles(props) {
	const { attributes, previewDevice, globalStylesCss, globalStylesIds } = props;
	// Get all merged global styles for the block
	const mergedGlobalStyles = select('kadenceblocks/global-styles').getMergedStylesByIds(globalStylesIds);

	const cssOutput = useMemo(() => {
		const selector = `.wp-block-kbs-text.kbs-text-${attributes?.uniqueID || 'unknown'}`;
		const css = new cssGenerator(selector, props, metadata);

		let output = css.generate();
		if (attributes?.kbsCSS) {
			output = output + attributes.kbsCSS.replace(/selector/g, selector);
		}
		return output;
	}, [attributes, attributes?.uniqueID, previewDevice, mergedGlobalStyles]);

	const globalStylesCssOutput = useMemo(() => {
		if (!globalStylesCss) {
			return '';
		}
		return `.wp-block-kbs-text.kbs-text-${attributes?.uniqueID || 'unknown'}` + '{ ' + globalStylesCss + ' }';
	}, [globalStylesCss, attributes?.uniqueID]);

	return (
		<>
			{globalStylesCssOutput && <style>{globalStylesCssOutput}</style>}
			<style>{cssOutput}</style>
		</>
	);
}
