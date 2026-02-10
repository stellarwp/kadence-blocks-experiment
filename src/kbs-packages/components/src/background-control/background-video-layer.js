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
	__experimentalInputControl as InputControl,
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
import VideoSettingsSelector from '../video-control/video-settings-selector';

export default function BackgroundVideoLayer({
	previewDevice = 'desktop',
	layer,
	onChange,
	hasYouTube = false,
	hasVimeo = false,
}) {
	const hasVideo = layer?.video;
	const onReset = () => {
		onChange(
			[
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
			],
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
				'videoType',
				'youtube',
				'vimeo',
			]
		);
	};
	const onYoutubeReset = () => {
		onChange([undefined], previewDevice, ['youtube']);
	};
	const focalPointSize = layer?.objectFit || 'cover';
	const localVideo = (
		<>
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
					hasYouTube={true}
					hasVimeo={true}
					videoType={layer?.videoType}
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
		</>
	);
	const youtubeVideo = (
		<>
			<div className="kbs-block-notice">
				{__(
					'Warning: Embedded videos are not ideal for background content. Consider self hosting instead.',
					'kadence-blocks'
				)}
			</div>
			<TitleBar
				label={__('YouTube Video ID', 'kadence-blocks')}
				reset={true}
				onReset={onYoutubeReset}
				hasDeviceControls={false}
				hasAdvancedControls={false}
				hasCustomControls={false}
			/>
			<div className="kbs-background-layer-image-control-inner">
				<div className="kbs-external-video-controls">
					<InputControl
						__next40pxDefaultSize
						className="kbs-input-unit-control__input"
						label={''}
						value={layer?.youtube}
						onChange={(value) => onChange(value, previewDevice, 'youtube')}
						help={__(
							'Enter the YouTube video ID. For example, if the URL is https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.',
							'kadence-blocks'
						)}
						suffix={
							<VideoSettingsSelector
								label={__('Video Settings', 'kadence-blocks')}
								previewDevice={previewDevice}
								onChange={onChange}
								showPoster={false}
								muteVideo={layer?.muteVideo}
								loopVideo={layer?.loopVideo}
								muteAttribute={'muteVideo'}
								loopAttribute={'loopVideo'}
							/>
						}
					/>
				</div>
				{layer?.youtube && (
					<>
						<FocalPointPicker
							className="kbs-focal-point-picker kbs-image-control__focal-point-picker"
							url={layer?.youtube ? `https://img.youtube.com/vi/${layer?.youtube}/maxresdefault.jpg` : ''}
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
		</>
	);
	const defaultTabs = [
		{
			name: 'local',
			title: __('Local File', 'kadence-blocks'),
		},
	];
	if (hasYouTube) {
		defaultTabs.push({
			name: 'youtube',
			title: __('YouTube', 'kadence-blocks'),
		});
	}
	if (hasVimeo) {
		defaultTabs.push({
			name: 'vimeo',
			title: __('Vimeo', 'kadence-blocks'),
		});
	}
	return (
		<div className={`kbs-background-layer-video-control`}>
			{hasYouTube || hasVimeo ? (
				<TabPanel
					initialTabName={layer?.videoType}
					className="kbs-video-select-tabs kbs-color-select-tabs kbs-responsive-locked"
					activeClass="is-active"
					tabs={defaultTabs}
					onSelect={(tabName) => {
						if (tabName !== layer?.videoType) {
							onChange(tabName, 'Desktop', 'videoType');
						}
					}}
				>
					{(tab) => {
						if (tab.name) {
							if ('local' === tab.name) {
								return localVideo;
							} else if ('youtube' === tab.name) {
								return youtubeVideo;
							} else if ('vimeo' === tab.name) {
								return <div>Vimeo</div>;
							}
						}
					}}
				</TabPanel>
			) : (
				localVideo
			)}
		</div>
	);
}
