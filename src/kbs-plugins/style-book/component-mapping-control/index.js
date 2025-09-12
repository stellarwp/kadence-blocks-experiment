import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl, Button } from '@wordpress/components';

import { RadioButtonSelect } from '@kadence/kbsComponents';

import './editor.scss';

import { MAPPING_COMPONENT_OPTIONS } from './constants';

function MappingControl(props) {
	const { controlType, label, placeholder, value, onChange } = props;
	switch (controlType) {
		case 'fontSize':
			return (
				<RadioButtonSelect
					labelPosition="fontMapping"
					label={label}
					type="fontSizeMapping"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			);
		case 'spacing':
		case 'gap':
		case 'iconSize':
		case 'borderRadius':
			return (
				<RadioButtonSelect
					labelPosition="clampMapping"
					label={label}
					type="clampMapping"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			);
		default:
			return <TextControl label={label} placeholder={placeholder} value={value} onChange={onChange} />;
	}
}

/**
 * Build the component preset
 */
export default function ComponentMappingControl(props) {
	const { globalStyleId, selectedMappingComponent, setSelectedMappingComponent, setNeedsSave } = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const { setStyleBookComponentMappingByStyleId } = useDispatch('kadenceblocks/global-styles');

	const setStyleBookLocalMapping = (mappingComponentKey, mappingKey, mapping) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, mappingComponentKey, mappingKey, mapping);
		setNeedsSave(true);
	};
	const singleMappingControl = (key) => {
		const label = MAPPING_COMPONENT_OPTIONS[key].label;
		const options = styleBookLocalGlobalStyles['kbs-base']?.mappings?.[key] || {};
		const mappingComponentKey = key;

		const optionsOutput = Object.keys(options).map(function (item) {
			const mappingKey = item;
			return (
				<MappingControl
					controlType={key}
					key={mappingComponentKey + '-' + mappingKey}
					label={options[mappingKey].label}
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
				{optionsOutput}
			</div>
		);
	};

	const mappingControlsOutput = Object.keys(MAPPING_COMPONENT_OPTIONS).map(function (key) {
		const label = MAPPING_COMPONENT_OPTIONS[key].label;
		const options = styleBookLocalGlobalStyles['kbs-base']?.mappings?.[key] || {};
		const mappingComponentKey = key;

		const optionsOutput = Object.keys(options).map(function (item) {
			const mappingKey = item;
			return (
				<MappingControl
					controlType={key}
					key={mappingComponentKey + '-' + mappingKey}
					label={options[mappingKey].label}
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
				{/* <h2 className={'kbs-style-book-preview-heading'}>{label}</h2> */}
				{optionsOutput}
			</div>
		);
	});
	const mappingControlsTabs = Object.keys(MAPPING_COMPONENT_OPTIONS).map(function (key) {
		return (
			<Button
				key={key}
				isPressed={selectedMappingComponent === key}
				onClick={() => setSelectedMappingComponent(key)}
				className={'kbs-style-book-mapping-heading'}
			>
				{MAPPING_COMPONENT_OPTIONS[key].label}
			</Button>
		);
	});

	return (
		<div className={'kbs-component-mapping-control'}>
			<div className={'kbs-component-mapping-control-tabs'}>{mappingControlsTabs}</div>
			{singleMappingControl(selectedMappingComponent)}
		</div>
	);
}
