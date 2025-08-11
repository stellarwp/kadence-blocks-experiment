import KadenceIconPicker from './icon-select';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import TextControl from '../text-control';
import RadioButtonControl from '../radio-button-control';
import ColorControl from '../color-control';
import TabsControl from '../tabs-control';
import SpaceControl from '../space-control';
import SelectBasicControl from '../select-basic-control';
import ToggleControl from '../toggle-control';
import AnglePickerControl from '../angle-picker-control';

export default function IconControl(props) {
	const {
		attributes,
		attributeName,
		setAttributes,
		meta,
		previewDevice,
		previewDirection,
		globalStylesIds,
		hasTooltip = false,
		hasPlacement = false,
		hasAlignment = false,
		hasSpacing = false,
		hasRotation = false,
	} = props;
	const [activeTab, setActiveTab] = useState('default');

	const iconName = attributes[attributeName]?.desktop?.icon;

	const isLineIcon = iconName?.includes('fe_');

	return (
		<>
			<KadenceIconPicker
				allowClear={true}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
			/>
			{hasPlacement && (
				<SelectBasicControl
					attributeName={attributeName}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={meta}
					type={'placement'}
					options={[
						{ label: __('Left', 'kadence-blocks'), value: '' },
						{ label: __('Right', 'kadence-blocks'), value: 'right' },
					]}
				/>
			)}

			{hasAlignment && (
				<RadioButtonControl
					label={__('Vertical Alignment', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'alignItems'}
					meta={meta}
					previewDevice={previewDevice}
					previewDirection={'row'}
				/>
			)}

			<TabsControl
				tabs={[
					{ name: 'default', title: __('Normal', 'kadence-blocks') },
					{ name: 'hover', title: __('Hover', 'kadence-blocks') },
				]}
				selected={activeTab}
				onSelect={(name) => setActiveTab(name)}
			>
				{activeTab === 'default' && (
					<>
						<ColorControl
							label={__('Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'color'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						<RadioButtonControl
							label={__('Icon Size', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'iconSize'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						{isLineIcon && (
							<RadioButtonControl
								label={__('Line width', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'iconLineWidth'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
								min={0}
								max={10}
								step={0.1}
							/>
						)}

						{hasSpacing && (
							<SpaceControl
								label={__('Padding', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'padding'}
								previewDevice={previewDevice}
								hasPresetControl={false}
								metaData={meta}
								globalStylesIds={globalStylesIds}
							/>
						)}
						{hasRotation && (
							<AnglePickerControl
								label={__('Rotation', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'rotation'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
							/>
						)}
					</>
				)}
				{activeTab === 'hover' && (
					<>
						<ColorControl
							label={__('Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'colorHover'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						<RadioButtonControl
							label={__('Icon Size', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'iconSizeHover'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						{isLineIcon && (
							<RadioButtonControl
								label={__('Line width', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'iconLineWidthHover'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
								min={0}
								max={10}
								step={0.1}
							/>
						)}
						{hasSpacing && (
							<SpaceControl
								label={__('Padding', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'paddingHover'}
								previewDevice={previewDevice}
								hasPresetControl={false}
								metaData={meta}
								globalStylesIds={globalStylesIds}
							/>
						)}
						{hasRotation && (
							<AnglePickerControl
								label={__('Rotation', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'rotationHover'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
							/>
						)}
					</>
				)}
			</TabsControl>

			{hasTooltip && (
				<>
					<TextControl
						label={__('Icon Tooltip Content', 'kadence-blocks')}
						attributeName={attributeName}
						attributes={attributes}
						setAttributes={setAttributes}
						meta={meta}
						type={'tooltipContent'}
						textArea={true}
					/>
					<SelectBasicControl
						label={__('Icon Tooltip Placement', 'kadence-blocks')}
						attributeName={attributeName}
						attributes={attributes}
						setAttributes={setAttributes}
						meta={meta}
						type={'tooltipPlacement'}
						options={[
							{ label: __('Top', 'kadence-blocks'), value: '' },
							{ label: __('Top Start', 'kadence-blocks'), value: 'top-start' },
							{ label: __('Top End', 'kadence-blocks'), value: 'top-end' },
							{ label: __('Bottom', 'kadence-blocks'), value: 'bottom' },
							{ label: __('Bottom Start', 'kadence-blocks'), value: 'bottom-start' },
							{ label: __('Bottom End', 'kadence-blocks'), value: 'bottom-end' },
							{ label: __('Left', 'kadence-blocks'), value: 'left' },
							{ label: __('Left Start', 'kadence-blocks'), value: 'left-start' },
							{ label: __('Left End', 'kadence-blocks'), value: 'left-end' },
							{ label: __('Right', 'kadence-blocks'), value: 'right' },
							{ label: __('Right Start', 'kadence-blocks'), value: 'right-start' },
							{ label: __('Right End', 'kadence-blocks'), value: 'right-end' },
							{ label: __('Auto', 'kadence-blocks'), value: 'auto' },
							{ label: __('Auto Start', 'kadence-blocks'), value: 'auto-start' },
							{ label: __('Auto End', 'kadence-blocks'), value: 'auto-end' },
						]}
					/>

					<ToggleControl
						label={__('Show indicator underline', 'kadence-blocks')}
						titleBar={false}
						attributeName={attributeName}
						attributes={attributes}
						setAttributes={setAttributes}
						meta={meta}
						type={'tooltipDash'}
					/>
				</>
			)}

			<TextControl
				label={__('Title for screen readers', 'kadence-blocks')}
				attributeName={attributeName}
				attributes={attributes}
				setAttributes={setAttributes}
				meta={meta}
				type={'title'}
			/>
		</>
	);
}
