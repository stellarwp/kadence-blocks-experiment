import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import { getPreviewValue } from '@kadence/kbsHelpers';

export default function MaxWidthControl({
	attributes,
	setAttributes,
	previewDevice,
	attributeName = 'maxWidth',
	title = __('Max Width Settings', 'kadence-blocks'),
	label = __('Max Width', 'kadence-blocks'),
    type = 'maxWidth',
	metadata,
}) {
	return (
		<ToolsPanelBody
			title={title}
			panelName={'container-max-width'}
			componentName={'max-width-control'}
		>
			<RadioButtonControl
				label={label}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={type}
				meta={metadata?.attributes?.[attributeName]}
				previewDevice={previewDevice}
				hasCustomControls={true}
			/>
		</ToolsPanelBody>
	);
} 