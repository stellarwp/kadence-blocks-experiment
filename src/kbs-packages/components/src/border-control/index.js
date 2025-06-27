import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import BorderStyleControl from './border-style-control';

export default function BorderControl({
	attributeName,
	attributes,
	setAttributes,
	previewDevice,
	label = __('Border', 'kadence-blocks'),
	labelBorderRadius = __('Border Radius', 'kadence-blocks'),
	metadata,
	hasCustomControls = true,
	hasAdvancedControls = true,
	hasBorderRadius = true,
	hasBorder = true,
	hasHoverControls = false,
	isHover,
	setIsHover,
}) {
	return (
		<>
			{hasBorderRadius && (
				<RadioButtonControl
					label={labelBorderRadius}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					radioType={'borderRadius'}
					meta={metadata?.attributes?.[attributeName]}
					previewDevice={previewDevice}
					hasCustomControls={hasCustomControls}
					hasAdvancedControls={hasAdvancedControls}
					type={'borderRadius'}
				/>
			)}
			{hasBorder && (
				<BorderStyleControl
					label={label}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={metadata?.attributes?.[attributeName]}
					previewDevice={previewDevice}
					hasCustomControls={hasCustomControls}
					hasAdvancedControls={hasAdvancedControls}
					hasHoverControls={hasHoverControls}
					isHover={isHover}
					setIsHover={setIsHover}
				/>
			)}
		</>
	);
}
