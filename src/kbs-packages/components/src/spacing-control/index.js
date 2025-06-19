import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import SpaceControl from '../space-control';
import PresetControl from '../preset-control';

export default function SpacingControl({
	attributes,
	setAttributes,
	previewDevice,
	title = __('Spacing Settings', 'kadence-blocks'),
	types = ['padding', 'margin'],
	metadata,
	hasPresetControl = true,
	globalStylesIds,
}) {
	const onAllReset = () => {
		const resetObject = {};
		types.forEach((type) => {
			resetObject[type] = undefined;
		});
		setAttributes(resetObject);
	};
	const getLabel = (type) => {
		switch (type) {
			case 'padding':
				return __('Padding', 'kadence-blocks');
			case 'margin':
				return __('Margin', 'kadence-blocks');
		}
	};
	return (
		<ToolsPanelBody title={title} panelName={'container-spacing'} componentName={'spacing-control'}>
			{hasPresetControl && (
				<PresetControl
					label={__('Padding Presets', 'kadence-blocks')}
					type={'spacing'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'padding'}
					meta={metadata?.attributes?.padding}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
				/>
			)}
			{types.map((type) => (
				<SpaceControl
					key={type}
					label={getLabel(type)}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={type}
					type={type}
					meta={metadata?.attributes?.[type]}
					previewDevice={previewDevice}
				/>
			))}
		</ToolsPanelBody>
	);
}
