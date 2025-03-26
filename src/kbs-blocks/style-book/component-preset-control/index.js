import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

import { Typography } from '@kadence/kbsComponents';

import './editor.scss';

import { COMPONENTS } from '../constants';

/**
 * Build the component preset
 */
export default function ComponentPresetControl(props) {
	const { globalStyleId, preset, property } = props;

	const styleId = globalStyleId;
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
					styleId,
					componentId,
					presetId
				),
			};
		},
		[styleId, componentId, presetId]
	);
	const { setStyleBookComponentPresetByStyleId } = useDispatch('kadenceblocks/global-styles');

	const styleBookLocalPreset = styleBookComponent?.attributes ? styleBookComponent.attributes : {};

	const setStyleBookLocalPreset = (presetAttrs) => {
		setStyleBookComponentPresetByStyleId(styleId, componentId, presetId, presetAttrs);
	};

	const fakeMeta = {
		attributes: {
			typography: { component: 'typography' },
		},
	};

	const Component = COMPONENTS?.[property].component;
	const label = COMPONENTS?.label;

	// console.log('in component preset control: ', property, styleBookLocalPreset);

	return (
		<>
			<div class="kbs-component-preset-control">A component Preset control</div>
			<Component
				label={label}
				// customOnChange={onPresetChange}
				forStyleBook={true}
				attributes={styleBookLocalPreset}
				setAttributes={setStyleBookLocalPreset}
				attributeName={property}
				previewDevice={previewDevice}
				meta={fakeMeta?.attributes?.typography}
			/>
		</>
	);
}
