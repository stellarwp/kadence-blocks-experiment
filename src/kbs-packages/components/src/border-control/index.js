import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';

export default function BorderControl({
	attributeName,
	attributes,
	setAttributes,
	previewDevice,
	label = __('Sizing', 'kadence-blocks'),
	metadata,
}) {
	return (
		<RadioButtonControl
			label={label}
			attributes={attributes}
			setAttributes={setAttributes}
			attributeName={attributeName}
			radioType={'borderRadius'}
			meta={metadata?.attributes?.[attributeName]}
			previewDevice={previewDevice}
			hasCustomControls={true}
			type={'borderRadius'}
		/>
	);
}
