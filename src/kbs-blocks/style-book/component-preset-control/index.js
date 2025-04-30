import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

import { Typography } from '@kadence/kbsComponents';

import './editor.scss';

import { BLOCK_COMPONENTS } from '@kadence/kbsComponents';

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
				)
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
	const label = BLOCK_COMPONENTS?.label;

	return (
		<>
			<Component
				label={label}
				// customOnChange={onPresetChange}
				attributes={styleBookLocalPreset}
				setAttributes={setStyleBookLocalPreset}
				meta={fakeMeta}
				previewDevice={previewDevice}
				attributeName={property}
				globalStyleId={globalStyleId}
				forStyleBook={true}
				forPresetControl={true}
			/>
		</>
	);
}
