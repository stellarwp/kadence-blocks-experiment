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

export default function BackgroundBackdropLayer({
	previewDevice = 'desktop',
	layer,
	onChange,
	globalClasses,
	isHover = false,
	onToggleHover,
}) {
	const onReset = () => {
		onChange([undefined, undefined], 'Desktop' === previewDevice ? 'all' : previewDevice, [
			'backdropFilter',
			'backdropSize',
		]);
	};
	return (
		<div className={`kbs-background-layer-backdrop-control`}>
			<TitleBar
				label={__('Backdrop Filter', 'kadence-blocks')}
				reset={true}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
				hasHoverControls={true}
				onToggleHover={onToggleHover}
				isHover={isHover}
			/>
			<div className={`kbs-background-layer-backdrop-control-inner`}>
				<SelectBasicControlSelect
					value={isHover ? layer?.hoverBackdropFilter : layer?.backdropFilter}
					onChange={(value) =>
						onChange(value, previewDevice, isHover ? 'hoverBackdropFilter' : 'backdropFilter')
					}
					onReset={onReset}
					isHover={isHover}
					type={isHover ? 'hoverBackdropFilter' : 'backdropFilter'}
					previewDevice={previewDevice}
					inherited={isHover ? { inheritedValue: layer?.backdropFilter } : { inheritedValue: '' }}
					options={[
						{ label: 'None', value: 'none' },
						{ label: 'Blur', value: 'blur' },
						{ label: 'Brightness', value: 'brightness' },
						{ label: 'Contrast', value: 'contrast' },
						{ label: 'Grayscale', value: 'grayscale' },
						{ label: 'Hue Rotate', value: 'hue-rotate' },
						{ label: 'Invert', value: 'invert' },
						{ label: 'Saturate', value: 'saturate' },
						{ label: 'Sepia', value: 'sepia' },
					]}
				/>
				<RadioButtonSelect
					label={__('Backdrop Amount', 'kadence-blocks')}
					value={isHover ? layer?.hoverBackdropSize : layer?.backdropSize}
					type={'backdropSize'}
					inherited={
						isHover
							? { inheritedValue: layer?.backdropSize ? layer?.backdropSize : '1' }
							: { inheritedValue: '1' }
					}
					previewDevice={previewDevice}
					view={'normal'}
					hasCustomControls={false}
					onChange={(value) => {
						if (isHover) {
							onChange(value, previewDevice, 'hoverBackdropSize');
						} else {
							onChange(value, previewDevice, 'backdropSize');
						}
					}}
					min={0}
					max={100}
					step={1}
					isHover={isHover}
				/>
			</div>
		</div>
	);
}
