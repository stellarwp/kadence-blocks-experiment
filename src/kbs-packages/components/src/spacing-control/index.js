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
	attributeNames = ['padding', 'margin'],
	metaData,
	hasPresetControl = true,
	globalStylesIds,
	customOnChange,
	showVisualizer = false,
	clientId,
	blockElementRef = null,
	initialOpen = true,
	hasMarginTop = true,
	hasMarginRight = true,
	hasMarginBottom = true,
	hasMarginLeft = true,
	hasPaddingTop = true,
	hasPaddingRight = true,
	hasPaddingBottom = true,
	hasPaddingLeft = true,
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

	const getHasSide = (type, side) => {
		if (type === 'margin') {
			return side === 'top'
				? hasMarginTop
				: side === 'right'
					? hasMarginRight
					: side === 'bottom'
						? hasMarginBottom
						: hasMarginLeft;
		} else if (type === 'padding') {
			return side === 'top'
				? hasPaddingTop
				: side === 'right'
					? hasPaddingRight
					: side === 'bottom'
						? hasPaddingBottom
						: hasPaddingLeft;
		}
	};

	return (
		<ToolsPanelBody
			title={title}
			resetAll={onAllReset}
			panelName={'container-spacing'}
			componentName={'spacing-control'}
			initialOpen={initialOpen}
		>
			{types.map((type, i) => (
				<SpaceControl
					key={type}
					label={getLabel(type)}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeNames[i]}
					type={type}
					previewDevice={previewDevice}
					customOnChange={customOnChange}
					clientId={clientId}
					showVisualizer={showVisualizer}
					blockElementRef={blockElementRef}
					hasPresetControl={hasPresetControl}
					metaData={metaData}
					globalStylesIds={globalStylesIds}
					hasTop={getHasSide(type, 'top')}
					hasRight={getHasSide(type, 'right')}
					hasBottom={getHasSide(type, 'bottom')}
					hasLeft={getHasSide(type, 'left')}
				/>
			))}
		</ToolsPanelBody>
	);
}
