import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { getInheritedValue } from '@kadence/kbsHelpers';

import ToolsPanelBody from '../tools-panel-body';
import SpaceControl from '../space-control';

export default function SpacingControl({
	attributes,
	setAttributes,
	previewDevice,
	title = __('Spacing Settings', 'kadence-blocks'),
	types = ['padding', 'margin'],
	metaData,
	hasPresetControl = true,
	globalStylesIds,
	customOnChange,
	showVisualizer = false,
	clientId,
	blockElementRef = null,
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
		<ToolsPanelBody
			title={title}
			reset={onAllReset}
			panelName={'container-spacing'}
			componentName={'spacing-control'}
		>
			{types.map((type) => (
				<SpaceControl
					key={type}
					label={getLabel(type)}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={type}
					type={type}
					previewDevice={previewDevice}
					customOnChange={customOnChange}
					clientId={clientId}
					showVisualizer={showVisualizer}
					blockElementRef={blockElementRef}
					hasPresetControl={hasPresetControl}
					metaData={metaData}
					globalStylesIds={globalStylesIds}
				/>
			))}
		</ToolsPanelBody>
	);
}
