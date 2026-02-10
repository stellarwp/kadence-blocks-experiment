/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';
import { Button, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plusCircleFilled, closeSmall, video } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import MediaPlaceholder from '../media-placeholder';
import DynamicVideoControl from '../dynamic-video';
import ImageButtonSelector from '../image-control/image-button-selector';
import VideoSettingsSelector from './video-settings-selector';
import './editor.scss';
import TitleBar from '../title-bar';

export default function VideoSelector(props) {
	const {
		label,
		type,
		previewDevice = 'desktop',
		onChange,
		hasClearControls = true,
		dynamicAttribute = '',
		videoURL = '',
		videoID = '',
		dynamicVideo = {},
		hasPosterControls = false,
		posterAttribute = 'image',
		posterURL = '',
		posterID = '',
		hasVideoSettingsControls = false,
		muteVideo = '',
		loopVideo = '',
		muteAttribute = 'mute',
		loopAttribute = 'loop',
		showMuteButtonAttribute = '',
		showPlayButtonAttribute = '',
		showMuteButton = '',
		showPlayButton = '',
	} = props;
	const idAttribute = type + 'Id';
	const onRemoveVideo = (device) => {
		onChange([undefined, undefined], device, [type, idAttribute]);
	};
	const onVideoSelect = (value, device) => {
		if (value?.url) {
			if (value?.id) {
				onChange([value?.url, value?.id], device, [type, idAttribute]);
			} else {
				onChange([value?.url, undefined], device, [type, idAttribute]);
			}
		} else {
			onChange([undefined, undefined], device, [type, idAttribute]);
		}
	};
	const hasVideo = videoURL;

	return (
		<div className="kbs-video-selector-inner kbs-video-control">
			{!hasVideo && (
				<MediaPlaceholder
					labels={''}
					selectIcon={plusCircleFilled}
					selectLabel={__('Select Video', 'kadence-blocks')}
					onSelect={(video) => {
						onVideoSelect(video, previewDevice);
					}}
					onSelectURL={(newURL) => onVideoSelect({ url: newURL }, previewDevice)}
					accept="video/*"
					className={'kbs-video-upload-placeholder'}
					allowedTypes={'video'}
					disableMediaButtons={false}
					dynamicControl={
						dynamicAttribute && kbs_params.dynamic_enabled ? (
							<DynamicVideoControl
								customOnChange={onChange}
								dynamicAttributes={dynamicVideo}
								{...props}
							/>
						) : undefined
					}
				/>
			)}
			{hasVideo && (
				<>
					{dynamicAttribute && kbs_params.dynamic_enabled && dynamicVideo?.enable ? (
						<div className="kb-dynamic-video-sidebar-top">
							<DynamicVideoControl
								startOpen={dynamicVideo?.field ? false : true}
								customOnChange={onChange}
								dynamicAttributes={dynamicVideo}
								{...props}
							/>
						</div>
					) : (
						<div className="kbs-video-edit-wrap">
							<MediaUpload
								onSelect={(video) => onVideoSelect(video, previewDevice)}
								type="video"
								value={videoID ? videoID : ''}
								render={({ open }) => (
									<Button
										className={'kbs-upload-edit-btn'}
										variant="secondary"
										onClick={open}
										icon={video}
									>
										{__('Edit Video', 'kadence-blocks')}
									</Button>
								)}
							/>
							{hasPosterControls && !hasVideoSettingsControls && (
								<ImageButtonSelector
									label={__('Video Poster', 'kadence-blocks')}
									type={posterAttribute}
									onChange={onChange}
									previewDevice={previewDevice}
									dynamicAttribute={'dynamic' + posterAttribute}
									hasSizeControls={true}
									hasClearControls={false}
									imageURL={posterURL}
									imageID={posterID}
								/>
							)}
							{hasVideoSettingsControls && (
								<VideoSettingsSelector
									label={__('Video Settings', 'kadence-blocks')}
									previewDevice={previewDevice}
									onChange={onChange}
									dynamicAttribute={'dynamic' + posterAttribute}
									hasSizeControls={true}
									hasClearControls={false}
									posterURL={posterURL}
									posterID={posterID}
									muteVideo={muteVideo}
									loopVideo={loopVideo}
									muteAttribute={muteAttribute}
									loopAttribute={loopAttribute}
									posterAttribute={posterAttribute}
									showMuteButtonAttribute={showMuteButtonAttribute}
									showPlayButtonAttribute={showPlayButtonAttribute}
									showMuteButton={showMuteButton}
									showPlayButton={showPlayButton}
								/>
							)}
							{hasClearControls && (
								<Button
									icon={closeSmall}
									label={__('Remove Video', 'kadence-blocks')}
									className={'kbs-upload-remove-btn'}
									variant="secondary"
									onClick={() => onRemoveVideo(previewDevice)}
								/>
							)}
							{dynamicAttribute && kbs_params.dynamic_enabled && (
								<DynamicVideoControl
									customOnChange={onChange}
									dynamicAttributes={dynamicVideo}
									{...props}
								/>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
