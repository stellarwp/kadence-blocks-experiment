import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';

export default function SizingControl({
	attributes,
	setAttributes,
	previewDevice,
	title = __('Sizing Settings', 'kadence-blocks'),
	label = __('Sizing', 'kadence-blocks'),
	types = ['maxWidth', 'minHeight'],
	metadata,
	initialOpen = false,
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
			case 'maxWidth':
				return __('Max Width', 'kadence-blocks');
			case 'minWidth':
				return __('Min Width', 'kadence-blocks');
			case 'maxHeight':
				return __('Max Height', 'kadence-blocks');
			case 'minHeight':
				return __('Min Height', 'kadence-blocks');
		}
	};
	return (
		<ToolsPanelBody
			title={title}
			panelName={'container-sizing'}
			componentName={'sizing-control'}
			initialOpen={initialOpen}
		>
			{types.map((type) => (
				<RadioButtonControl
					key={type}
					label={getLabel(type)}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={type}
					radioType={type}
					type={type}
					meta={metadata?.attributes?.[type]}
					previewDevice={previewDevice}
					hasCustomControls={type === 'maxWidth' ? true : false}
				/>
			))}
		</ToolsPanelBody>
	);
}
