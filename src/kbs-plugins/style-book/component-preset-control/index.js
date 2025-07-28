import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { Typography } from '@kadence/kbsComponents';
import { getGlobalStylesCSSOutput, getPresetOptions } from '@kadence/kbsHelpers';

import './editor.scss';

import { BLOCK_COMPONENTS, ToolsPanelBody } from '@kadence/kbsComponents';

/**
 * Build the component preset
 */
export default function ComponentPresetControl(props) {
	const { globalStyleId, preset, property } = props;

	const componentId = property;
	const presetId = preset;

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);
	const { styleBookComponent } = useSelect(
		(select) => {
			return {
				styleBookComponent: select('kadenceblocks/global-styles').getStyleBookComponentPresetByStyleId(
					globalStyleId,
					componentId,
					presetId
				),
			};
		},
		[globalStyleId, componentId, presetId]
	);

	const { setStyleBookComponentPresetAttributesByStyleId } = useDispatch('kadenceblocks/global-styles');

	const styleBookLocalPreset = styleBookComponent?.attributes ? styleBookComponent.attributes : {};

	const setStyleBookLocalPreset = (presetAttrs) => {
		setStyleBookComponentPresetAttributesByStyleId(globalStyleId, componentId, presetId, presetAttrs);
	};

	const fakeMeta = {
		attributes: {
			[property]: {
				component: property,
				renderCSS: true,
				selector: '--kbs-cont',
				initial: {},
				type: 'object',
			},
		},
	};

	const Component = BLOCK_COMPONENTS?.[property].component;
	const globalStylesCss = getGlobalStylesCSSOutput([globalStyleId]);
	const presets = getPresetOptions(property);
	const presetLabel = useMemo(() => {
		const presetData = presets.find((p) => p.value === preset);
		return presetData?.label;
	}, [presets, preset]);
	return (
		<Component
			title={presetLabel}
			// customOnChange={onPresetChange}
			attributes={{ [property]: styleBookLocalPreset }}
			setAttributes={setStyleBookLocalPreset}
			meta={fakeMeta}
			previewDevice={previewDevice}
			attributeName={property}
			globalStylesCss={globalStylesCss}
			globalStylesIds={[globalStyleId]}
			forStyleBook={true}
			forPresetControl={true}
		/>
	);
}
