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

export default function BackgroundImageLayer({ previewDevice = 'desktop', layer, onChange, globalClasses }) {
	const hasImage = layer?.image;
	const onReset = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			['image', 'imageId', 'position', 'size', 'repeat', 'attachment']
		);
	};
	let focalPointSize = layer?.size || 'cover';
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
					type={'image'}
					onChange={onChange}
					previewDevice={previewDevice}
					dynamicAttribute={'dynamic'}
					hasSizeControls={true}
					hasClearControls={false}
					imageURL={layer?.image}
					imageID={layer?.imageId}
				/>
				{hasImage && (
					<>
						<FocalPointPicker
							className="kbs-focal-point-picker kbs-image-control__focal-point-picker"
							url={layer?.image}
							value={layer?.position}
							onChange={(position) => onChange(position, previewDevice, 'position')}
							backgroundSize={focalPointSize}
						/>
						<RadioButtonSelect
							label={__('Background Size', 'kadence-blocks')}
							value={layer?.size}
							type={'size'}
							inherited={{ inheritedValue: 'cover' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={true}
							onChange={onChange}
						/>
						{layer?.size && layer?.size !== 'cover' && (
							<RadioButtonSelect
								label={__('Background Repeat', 'kadence-blocks')}
								value={layer?.repeat}
								type={'repeat'}
								inherited={{ inheritedValue: 'no-repeat' }}
								previewDevice={previewDevice}
								view={'normal'}
								hasCustomControls={false}
								onChange={onChange}
							/>
						)}
						<RadioButtonSelect
							label={__('Background Attachment', 'kadence-blocks')}
							value={layer?.attachment}
							type={'attachment'}
							inherited={{ inheritedValue: 'scroll' }}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={false}
							onChange={onChange}
						/>
					</>
				)}
			</div>
		</div>
	);
}
