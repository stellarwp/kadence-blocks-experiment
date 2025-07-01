/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { getColorOutput } from '@kadence/kbsHelpers';

import './editor.scss';

/**
 * ShadowPreview component
 * Displays a preview box with the shadow effect based on the passed parameters
 */
function ShadowPreview({ color, x, y, blur, spread, inset, type = 'boxShadow' }) {
	// Generate the shadow CSS value
	const shadowValue = useMemo(() => {
		const insetValue = inset && type === 'boxShadow' ? 'inset ' : '';
		const xValue = x || '0px';
		const yValue = y || '0px';
		const blurValue = blur || '0px';
		const spreadValue = spread || '0px';
		const colorValue = getColorOutput(color) || 'rgba(0, 0, 0, 0.2)';

		return `${insetValue}${xValue} ${yValue} ${blurValue} ${spreadValue} ${colorValue}`;
	}, [color, x, y, blur, spread, inset]);

	// Generate the preview box styles
	const previewStyles = useMemo(() => {
		const styles = {};

		// Apply shadow based on type
		if (type === 'boxShadow') {
			styles.boxShadow = shadowValue;
		} else if (type === 'textShadow') {
			styles.textShadow = shadowValue;
		}

		return styles;
	}, [shadowValue, type, color]);

	return (
		<div className={`kbs-shadow-preview-container kbs-shadow-preview-${type}`}>
			<div className="kbs-shadow-preview" style={previewStyles}>
				{type === 'textShadow' && <span>Text</span>}
			</div>
		</div>
	);
}

export default ShadowPreview;
