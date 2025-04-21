import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

import './editor.scss';

/**
 * Build the component preset
 */
export default function BlockDefaultControl(props) {
	const { globalStyleId, selectedBlockDefault } = props;

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);
	const { styleBookBlockDefault, mergedGlobalStyle } = useSelect(
		(select) => {
			return {
				styleBookBlockDefault: select('kadenceblocks/global-styles').getStyleBookBlockDefaultByStyleId(
					globalStyleId,
					selectedBlockDefault
				),
				mergedGlobalStyle: select('kadenceblocks/global-styles').getMergedGlobalStyle([globalStyleId], true),
			};
		},
		[globalStyleId, selectedBlockDefault]
	);

	const { setStyleBookBlockDefaultByStyleId } = useDispatch('kadenceblocks/global-styles');

	const styleBookBlockDefaultAttributes = styleBookBlockDefault?.attributes ? styleBookBlockDefault.attributes : {};

	const setStyleBookLocalPreset = (presetAttrs) => {
		setStyleBookBlockDefaultByStyleId(globalStyleId, selectedBlockDefault, presetAttrs);
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

	return (
		<>
			<div class="kbs-component-preset-control">A Block Default control</div>
			<BlockComponentControls
				// customOnChange={onPresetChange}
				attributes={styleBookBlockDefaultAttributes}
				setAttributes={setStyleBookLocalPreset}
				meta={fakeMeta}
				previewDevice={previewDevice}
				mergedGlobalStyle={mergedGlobalStyle}
				forStyleBook={true}
				forPresetControl={true}
			/>
			{/* <Component
				label={label}
				// customOnChange={onPresetChange}
				attributes={styleBookBlockDefaultAttributes}
				setAttributes={setStyleBookLocalPreset}
				meta={fakeMeta}
				previewDevice={previewDevice}
				attributeName={property}
				mergedGlobalStyle={mergedGlobalStyle}
				forStyleBook={true}
				forPresetControl={true}
			/> */}
		</>
	);
}
