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
import PopoverSelect from './popover-select';
import { patterns } from '../constants/patterns';

export default function BackgroundPatternLayer({
	previewDevice = 'desktop',
	layer,
	onChange,
	globalClasses,
	isHover = false,
}) {
	const hasPattern = layer?.pattern;
	const onReset = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['pattern', 'position', 'size', 'repeat', 'attachment', 'color', 'opacity']
		);
	};

	return (
		<div className={`kbs-background-layer-pattern-control`}>
			<TitleBar
				label={__('Background Pattern', 'kadence-blocks')}
				reset={true}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-pattern-control-inner`}>
				<PopoverSelect
					label={''}
					value={layer?.pattern}
					type={'pattern'}
					onChange={onChange}
					patterns={patterns}
				/>
				{hasPattern && (
					<>
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
						<ColorSelect
							label={__('Pattern Color', 'kadence-blocks')}
							value={isHover ? layer?.hoverPatternColor : layer?.patternColor}
							onChange={onChange}
							type={isHover ? 'hoverPatternColor' : 'patternColor'}
							previewDevice={previewDevice}
							globalClasses={globalClasses}
							hasMix={true}
							isHover={isHover}
						/>
						<RadioButtonSelect
							label={__('Pattern Size', 'kadence-blocks')}
							value={layer?.patternSize}
							type={'patternSize'}
							inherited={{ inheritedValue: 'base' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={true}
							onChange={onChange}
						/>
					</>
				)}
			</div>
		</div>
	);
}
