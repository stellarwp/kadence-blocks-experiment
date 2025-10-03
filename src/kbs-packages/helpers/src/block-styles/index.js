/**
 * Block Styles Component Generator
 *
 * Optimized styles component with proper memoization for performance.
 *
 * @usage
 * import { createBlockStylesComponent } from '@kadence/kbsHelpers';
 * import metadata from '../block.json';
 *
 * export default createBlockStylesComponent(metadata, 'container');
 */

import { useMemo } from '@wordpress/element';
import cssGenerator from '../css-generator';

/**
 * Create an optimized styles component for a block
 *
 * @param {Object} metadata - Block metadata (block.json)
 * @param {string} blockSlug - The block slug (e.g., 'container', 'button')
 * @returns {Function} - React component
 */
export function createBlockStylesComponent(metadata, blockSlug) {
	return function BlockStyles(props) {
		const { attributes, previewDevice, globalStylesCss, globalStylesIds } = props;

		// Create stable hash of attributes for memoization
		const attributesHash = useMemo(() => {
			return JSON.stringify(attributes);
		}, [attributes]);

		// Create stable hash of globalStylesIds for memoization
		const globalStylesHash = useMemo(() => {
			return JSON.stringify(globalStylesIds);
		}, [globalStylesIds]);

		const cssOutput = useMemo(() => {
			const selector = `.kbs-${blockSlug}-${attributes?.uniqueID || 'unknown'}`;
			const css = new cssGenerator(selector, props, metadata);

			let output = css.generate();
			if (attributes?.kbsCSS) {
				output = output + attributes.kbsCSS.replace(/selector/g, selector);
			}
			return output;
		}, [attributesHash, previewDevice, globalStylesHash, attributes?.uniqueID, attributes?.kbsCSS]);

		const globalStylesCssOutput = useMemo(() => {
			if (!globalStylesCss) {
				return '';
			}
			return `.kbs-${blockSlug}-${attributes?.uniqueID || 'unknown'}` + '{ ' + globalStylesCss + ' }';
		}, [globalStylesCss, attributes?.uniqueID]);

		return (
			<>
				{globalStylesCssOutput && <style>{globalStylesCssOutput}</style>}
				<style>{cssOutput}</style>
			</>
		);
	};
}
