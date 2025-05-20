import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl } from '@wordpress/components';

import './editor.scss';

import { MAPPING_COMPONENT_OPTIONS } from './constants';

/**
 * Build the component preset
 */
export default function ComponentPresetControl(props) {
	const { globalStyleId } = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const { setStyleBookComponentMappingByStyleId } = useDispatch('kadenceblocks/global-styles');

	const setStyleBookLocalMapping = (mappingComponentKey, mappingKey, mapping) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, mappingComponentKey, mappingKey, mapping);
	};

	const mappingControlsOutput = Object.keys(MAPPING_COMPONENT_OPTIONS).map(function (key) {
		const label = MAPPING_COMPONENT_OPTIONS[key].label;
		const options = MAPPING_COMPONENT_OPTIONS[key].options;
		const mappingComponentKey = key;

		const optionsOutput = options.map(function (key) {
			const mappingKey = key;
			return (
				<TextControl
					key={mappingComponentKey + '-' + mappingKey}
					label={mappingKey}
					placeholder={''}
					value={
						styleBookLocalGlobalStyles?.[globalStyleId]?.mappings?.[mappingComponentKey]?.[mappingKey]
							?.value
					}
					onChange={(value) => {
						setStyleBookLocalMapping(mappingComponentKey, mappingKey, value);
					}}
				/>
			);
		});

		return (
			<div
				key={mappingComponentKey}
				className={'kbs-style-book-settings-group kbs-style-book-settings-group-' + mappingComponentKey}
			>
				<h2 className={'kbs-style-book-preview-heading'}>{label}</h2>
				{optionsOutput}
			</div>
		);
	});

	return <div className={'kbs-component-mapping-control'}>{mappingControlsOutput}</div>;
}
