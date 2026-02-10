/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { getColorOutput } from '@kadence/kbsHelpers';
import { __ } from '@wordpress/i18n';

import './editor.scss';

/**
 * ShadowPreview component
 * Displays a preview box with the shadow effect based on the passed parameters
 */
function ShadowPreview({ color, x, y, blur, spread, inset, type = 'boxShadow', shadowString, isSingular = false }) {
	// Generate the shadow CSS value
	const shadowValue = useMemo(() => {
		// If isSingular is true and we have a shadowString, use it directly
		if (isSingular && shadowString) {
			return shadowString;
		}

		// Otherwise, build the shadow value from individual parameters
		const insetValue = inset && type === 'boxShadow' ? 'inset ' : '';
		const xValue = x || '0px';
		const yValue = y || '0px';
		const blurValue = blur || '0px';
		const spreadValue = type == 'boxShadow' ? spread || '0px' : '';
		const colorValue = getColorOutput(color) || 'rgba(0, 0, 0, 0.2)';

		return `${insetValue}${xValue} ${yValue} ${blurValue} ${spreadValue} ${colorValue}`;
	}, [color, x, y, blur, spread, inset, shadowString, isSingular]);

	// Generate the preview box styles
	const previewStyles = useMemo(() => {
		const styles = {};

		// Apply shadow based on type
		if (type === 'boxShadow') {
			styles.boxShadow = shadowValue;
		} else if (type === 'textShadow') {
			styles.textShadow = shadowValue;
		} else if (type === 'dropShadow') {
			styles.filter = shadowValue;
		}

		return styles;
	}, [shadowValue, type, color]);

	const typeClassString = type === 'textShadow' ? 'kbs-shadow-preview-text' : 'kbs-shadow-preview-box';

	return (
		<div className={`kbs-shadow-preview-container ${typeClassString}`}>
			<div className="kbs-shadow-preview" style={previewStyles}>
				{type === 'textShadow' && <span>{__('Text Sample', 'kadence-blocks')}</span>}
			</div>
		</div>
	);
}

export default ShadowPreview;
