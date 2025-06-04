/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	Icon,
	Dropdown,
	ColorIndicator as CoreColorIndicator,
	Button,
	HStack,
	FlexItem,
	TabPanel,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import {
	color as colorIcon,
	check as checkIcon,
	close as closeIcon,
	image as imageIcon,
	video as videoIcon,
	background as gradientIcon,
	grid as patternIcon,
} from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	getDeviceValue,
	getInheritedValue,
	handleLayerAttributeChange,
	getLayerDeviceValue,
} from '@kadence/kbsHelpers';
import ImageSelector from '../image-control/image-selector';
import FocalPointPicker from '../focal-point-picker';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import ColorSelect from '../color-control/color-select';
import UnitControl from '../unit-control/unit-control';
import TitleBar from '../title-bar';
import ToolsPanelBody from '../tools-panel-body';
import SelectBasicControlSelect from '../select-basic-control/select';

export default function LayerEffects({
	previewDevice = 'desktop',
	layer,
	onChange,
	globalClasses,
	isHover = false,
	onToggleHover,
	layerKey,
}) {
	const onReset = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['image', 'imageId', 'position', 'size', 'repeat', 'attachment']
		);
	};
	return (
		<div className={`kbs-background-layer-effects-control`}>
			{/* <TitleBar
				label={__('Background Effects', 'kadence-blocks')}
				reset={true}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
				hasHoverControls={true}
				onToggleHover={onToggleHover}
				isHover={isHover}
			/> */}
			<ToolsPanelBody
				title={__('Background Effects', 'kadence-blocks')}
				panelName={layerKey + 'background-layer-effects'}
				componentName={'background-layer-effects-control'}
				hasHoverControls={true}
				hasDeviceControls={false}
				onToggleHover={onToggleHover}
				isHover={isHover}
				initialOpen={false}
				hasMoreControls={false}
			>
				<div className={`kbs-background-layer-effects-control-inner`}>
					{layer?.type && layer?.type !== 'color' ? (
						<div className="kbs-background-image-layer-control-color-opacity">
							<ColorSelect
								label={__('Background Color', 'kadence-blocks')}
								value={isHover ? layer?.hoverColor : layer?.color}
								onChange={onChange}
								type={isHover ? 'hoverColor' : 'color'}
								previewDevice={previewDevice}
								globalClasses={globalClasses}
								hasMix={true}
								isHover={isHover}
							/>
							<UnitControl
								label={__('Opacity', 'kadence-blocks')}
								className="kbs-background-image-layer-control-opacity"
								max={100}
								min={0}
								units={[{ value: '%', label: '%' }]}
								value={isHover ? layer?.hoverOpacity : layer?.opacity}
								previewDevice={previewDevice}
								inherited={isHover ? { inheritedValue: layer?.opacity } : { inheritedValue: '' }}
								placeholder={100}
								step={1}
								isHover={isHover}
								onChange={(value) =>
									onChange(value, previewDevice, isHover ? 'hoverOpacity' : 'opacity')
								}
							/>
						</div>
					) : (
						<RadioButtonSelect
							label={__('Opacity', 'kadence-blocks')}
							type={isHover ? 'hoverOpacity' : 'opacity'}
							value={isHover ? layer?.hoverOpacity : layer?.opacity}
							onChange={(value) => onChange(value, previewDevice, isHover ? 'hoverOpacity' : 'opacity')}
							units={[{ value: '%', label: '%' }]}
							isHover={isHover}
							inherited={isHover ? { inheritedValue: layer?.opacity } : { inheritedValue: '' }}
							previewDevice={previewDevice}
							placeholder={100}
							min={0}
							max={100}
							step={1}
						/>
					)}
					<SelectBasicControlSelect
						label={__('Blend Mode', 'kadence-blocks')}
						value={isHover ? layer?.hoverBlendMode : layer?.blendMode}
						onChange={(value) => onChange(value, previewDevice, isHover ? 'hoverBlendMode' : 'blendMode')}
						isHover={isHover}
						type={isHover ? 'hoverBlendMode' : 'blendMode'}
						previewDevice={previewDevice}
						inherited={isHover ? { inheritedValue: layer?.blendMode } : { inheritedValue: '' }}
						options={[
							{ value: 'normal', label: __('Normal', 'kadence-blocks') },
							{ value: 'multiply', label: __('Multiply', 'kadence-blocks') },
							{ value: 'screen', label: __('Screen', 'kadence-blocks') },
							{ value: 'overlay', label: __('Overlay', 'kadence-blocks') },
							{ value: 'darken', label: __('Darken', 'kadence-blocks') },
							{ value: 'lighten', label: __('Lighten', 'kadence-blocks') },
							{ value: 'color-dodge', label: __('Color Dodge', 'kadence-blocks') },
							{ value: 'color-burn', label: __('Color Burn', 'kadence-blocks') },
							{ value: 'hard-light', label: __('Hard Light', 'kadence-blocks') },
							{ value: 'soft-light', label: __('Soft Light', 'kadence-blocks') },
							{ value: 'difference', label: __('Difference', 'kadence-blocks') },
							{ value: 'exclusion', label: __('Exclusion', 'kadence-blocks') },
							{ value: 'hue', label: __('Hue', 'kadence-blocks') },
							{ value: 'saturation', label: __('Saturation', 'kadence-blocks') },
							{ value: 'color', label: __('Color', 'kadence-blocks') },
							{ value: 'luminosity', label: __('Luminosity', 'kadence-blocks') },
						]}
					/>
				</div>
			</ToolsPanelBody>
		</div>
	);
}
