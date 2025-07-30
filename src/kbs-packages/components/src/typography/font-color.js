import { __ } from '@wordpress/i18n';
import {
	getResolvedValue,
	getInheritedDeviceValue,
	handleMultipleAttributeChange,
	getColorOutput,
} from '@kadence/kbsHelpers';
import ColorControl from '../color-control';
import Notice from '../notice';
export default function FontColor({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
	hasColor = false,
	hasBackgroundColor = false,
	supportsGradient = false,
}) {
	const colorValue = getResolvedValue(attributeName, attributes, 'any', meta, 'color', globalStylesIds);
	const previewColorValue = getColorOutput(colorValue?.appliedValue);
	const hasGradient = hasColor && previewColorValue && previewColorValue?.includes('gradient');
	return (
		<div className="components-base-control kbs-typography-color-group">
			{hasColor && (
				<ColorControl
					label={__('Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={meta}
					previewDevice={previewDevice}
					attributeName={attributeName}
					type={'color'}
					globalStylesIds={globalStylesIds}
					hasGradient={supportsGradient}
					hasMix={true}
				/>
			)}
			{hasBackgroundColor && !hasGradient && (
				<ColorControl
					label={__('Background Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={meta}
					previewDevice={previewDevice}
					attributeName={attributeName}
					type={'backgroundColor'}
					globalStylesIds={globalStylesIds}
					hasGradient={true}
					hasMix={true}
				/>
			)}
			{supportsGradient && hasGradient && (
				<Notice>
					{__('Background color will be ignored while a gradient color is applied.', 'kadence-blocks')}
				</Notice>
			)}
		</div>
	);
}
