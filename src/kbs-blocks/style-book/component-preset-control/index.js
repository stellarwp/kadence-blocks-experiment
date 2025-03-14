import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import { Typography } from '@kadence/kbsComponents';

import './editor.scss';

import { COMPONENTS } from '../constants';

/**
 * Build the component preset
 */
export default function ComponentPresetControl(props) {
	const { property } = props;

	const [tempAttributes, setTempAttributes] = useState({});

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);

	const fakeMeta = {
		attributes: {
			typography: { property: 'typography' },
		},
	};

	const Component = COMPONENTS?.[property].component;
	const label = COMPONENTS?.label;

	console.log('in component preset control', property, tempAttributes);

	return (
		<>
			<div class="kbs-component-preset-control">A component Preset control</div>
			<Component
				label={label}
				// customOnChange={onPresetChange}
				forStyleBook={true}
				attributes={tempAttributes}
				setAttributes={setTempAttributes}
				attributeName={property}
				previewDevice={previewDevice}
				meta={fakeMeta?.attributes?.typography}
			/>
		</>
	);
}
