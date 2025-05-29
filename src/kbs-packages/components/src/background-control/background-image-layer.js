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
import ColorSelector from '../color-control/color-selector';
import BackgroundImageControl from '../background-image-control';
import { getColorLabel } from '../color-control/utils';
import ImageSelector from '../image-control/image-selector';
import FocalPointPicker from '../focal-point-picker';
import { getImageFileName } from '../image-control/utils';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import ColorSelect from '../color-control/color-select';
import UnitControl from '../unit-control/unit-control';
import TitleBar from '../title-bar';

export default function BackgroundImageLayer({ previewDevice = 'desktop', layer, onChange, globalClasses }) {
	const hasImage = layer?.backgroundImage;
	const onReset = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			[
				'backgroundImage',
				'backgroundImageId',
				'backgroundPosition',
				'backgroundSize',
				'backgroundRepeat',
				'backgroundAttachment',
				'backgroundOpacity',
			]
		);
	};
	let focalPointSize = layer?.backgroundSize || 'cover';
	if ('contain' !== focalPointSize && 'cover' !== focalPointSize) {
		focalPointSize = 'initial';
	}
	return (
		<div className={`kbs-background-layer-image-control`}>
			<TitleBar
				label={__('Background Image', 'kadence-blocks')}
				reset={true}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-image-control-inner`}>
				<ImageSelector
					type={'backgroundImage'}
					onChange={onChange}
					previewDevice={previewDevice}
					dynamicAttribute={'dynamic'}
					hasSizeControls={true}
					hasClearControls={false}
					imageURL={layer?.backgroundImage}
					imageID={layer?.backgroundImageId}
				/>
				{hasImage && (
					<>
						<FocalPointPicker
							__nextHasNoMarginBottom
							className="kbs-image-control__focal-point-picker"
							url={layer?.backgroundImage}
							value={layer?.backgroundPosition}
							onChange={(position) => onChange(position, previewDevice, 'backgroundPosition')}
							backgroundSize={focalPointSize}
						/>
						<RadioButtonSelect
							label={__('Background Size', 'kadence-blocks')}
							value={layer?.backgroundSize}
							type={'backgroundSize'}
							inherited={{ inheritedValue: 'cover' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={true}
							onChange={onChange}
						/>
						{layer?.backgroundSize && layer?.backgroundSize !== 'cover' && (
							<RadioButtonSelect
								label={__('Background Repeat', 'kadence-blocks')}
								value={layer?.backgroundRepeat}
								type={'backgroundRepeat'}
								inherited={{ inheritedValue: 'no-repeat' }}
								previewDevice={previewDevice}
								view={'normal'}
								hasCustomControls={false}
								onChange={onChange}
							/>
						)}
						<RadioButtonSelect
							label={__('Background Attachment', 'kadence-blocks')}
							value={layer?.backgroundAttachment}
							type={'backgroundAttachment'}
							inherited={{ inheritedValue: 'scroll' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={false}
							onChange={onChange}
						/>
						<div className="kbs-background-image-layer-control-color-opacity">
							<ColorSelect
								label={__('Background Color', 'kadence-blocks')}
								value={layer?.backgroundColor}
								onChange={onChange}
								type={'backgroundColor'}
								previewDevice={previewDevice}
								globalClasses={globalClasses}
							/>
							<UnitControl
								label={__('Opacity', 'kadence-blocks')}
								className="kbs-background-image-layer-control-opacity"
								max={100}
								min={0}
								units={[{ value: '%', label: '%' }]}
								value={layer?.backgroundOpacity}
								previewDevice={previewDevice}
								placeholder={100}
								step={1}
								onChange={(value) => onChange(value, previewDevice, 'backgroundOpacity')}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
