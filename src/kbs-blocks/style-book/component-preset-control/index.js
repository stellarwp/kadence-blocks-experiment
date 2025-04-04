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
	const { styleBookComponent, mergedGlobalStyle } = useSelect(
		(select) => {
			return {
				styleBookComponent: select('kadenceblocks/global-styles').getStyleBookComponentPresetByStyleId(
					styleId,
					componentId,
					presetId
				),
				mergedGlobalStyle: select('kadenceblocks/global-styles').getMergedGlobalStyle([styleId], true),
			};
		},
		[styleId, componentId, presetId]
	);

	const { setStyleBookComponentPresetAttributesByStyleId } = useDispatch('kadenceblocks/global-styles');

	const styleBookLocalPreset = styleBookComponent?.attributes ? styleBookComponent.attributes : {};

	const setStyleBookLocalPreset = (presetAttrs) => {
		setStyleBookComponentPresetAttributesByStyleId(styleId, componentId, presetId, presetAttrs);
	};

	const fakeMeta = {
		attributes: {
			[property]: { 
				component: property,
				renderCSS: true,
				selector: "--kbs-cont",
				initial: {},
				type: "object" 
			},
		},
	};

	const Component = COMPONENTS?.[property].component;
	const label = COMPONENTS?.label;

	return (
		<>
			<div class="kbs-component-preset-control">A component Preset control</div>
			<Component
				label={label}
				// customOnChange={onPresetChange}
				attributes={styleBookLocalPreset}
				setAttributes={setStyleBookLocalPreset}
				meta={fakeMeta}
				previewDevice={previewDevice}
				attributeName={property}
				mergedGlobalStyle={mergedGlobalStyle}
				forStyleBook={true}
			/>
		</>
	);
}
