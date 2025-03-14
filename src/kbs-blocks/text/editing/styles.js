/**
 * Kadence Text Block CSS
 */

/**
 * Import External
 */
import { generateRequiredCss, isLocalCSS } from '@kadence/kbsHelpers';

export default function Styles({ attributes, uniqueID, previewDevice = 'Desktop' }) {
	if (!uniqueID) {
		return null;
	}

	const usesCustomCSS = isLocalCSS();
	const output = usesCustomCSS ? <style>{generateCss(attributes, previewDevice)}</style> : null;

	return output;
}

function generateCss(attributes, previewDevice) {
	const { uniqueID } = attributes;
	let css = '';

	/**
	 * Apply the text block styles
	 */
	css = `.kbs-text-${uniqueID} {
		font-family: var(--kbs-text-font-family);
		font-weight: var(--kbs-text-font-weight);
	}`;

	return css;
} 