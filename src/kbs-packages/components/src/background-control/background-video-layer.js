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
import VideoSelector from '../video-control/video-selector';

export default function BackgroundVideoLayer({ previewDevice = 'desktop', layer, onChange, globalClasses }) {
	const hasVideo = layer?.video;
	console.log(layer);
	const onReset = () => {
		onChange(
			[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			'Desktop' === previewDevice ? 'all' : previewDevice,
			[
				'video',
				'videoId',
				'position',
				'size',
				'image',
				'imageId',
				'showMuteButton',
				'showPlayButton',
				'loopVideo',
				'muteVideo',
			]
		);
	};
	let focalPointSize = layer?.objectFit || 'cover';
	return (
		<div className={`kbs-background-layer-video-control`}>
			<TitleBar
				label={__('Background Video', 'kadence-blocks')}
				reset={true}
				onReset={onReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className={`kbs-background-layer-image-control-inner`}>
				<VideoSelector
					type={'video'}
					onChange={onChange}
					previewDevice={previewDevice}
					dynamicAttribute={'dynamic'}
					hasClearControls={false}
					videoURL={layer?.video}
					videoID={layer?.videoId}
					posterURL={layer?.image}
					posterID={layer?.imageId}
					posterAttribute={'image'}
					hasPosterControls={true}
					hasVideoSettingsControls={true}
					showMuteButtonAttribute={'showMuteButton'}
					showPlayButtonAttribute={'showPlayButton'}
					showMuteButton={layer?.showMuteButton}
					showPlayButton={layer?.showPlayButton}
					loopVideo={layer?.loopVideo}
					muteVideo={layer?.muteVideo}
					loopAttribute={'loopVideo'}
					muteAttribute={'muteVideo'}
				/>
				{hasVideo && (
					<>
						<FocalPointPicker
							className="kbs-focal-point-picker kbs-image-control__focal-point-picker"
							url={layer?.video}
							value={layer?.objectPosition}
							onChange={(position) => onChange(position, previewDevice, 'objectPosition')}
							backgroundSize={focalPointSize}
						/>
						<RadioButtonSelect
							label={__('Video Size', 'kadence-blocks')}
							value={layer?.objectFit}
							type={'objectFit'}
							inherited={{ inheritedValue: 'cover' }}
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
