/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';
import { Button, Icon, Dropdown, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { settings, close as closeIcon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import ImageSelector from '../image-control/image-selector';
import TitleBar from '../title-bar';

function renderImageButtonDropdown(props) {
	return ({ onToggle, isOpen }) => {
		const {
			posterURL = '',
			posterID = '',
			label = '',
			showPoster = true,
			loopAttribute,
			muteAttribute,
			posterAttribute,
			showMuteButtonAttribute,
			showPlayButtonAttribute,
			showMuteButton,
			showPlayButton,
			loopVideo,
			muteVideo,
		} = props;
		const onReset = () => {
			props.onChange([undefined, undefined], props.previewDevice, [
				props.posterAttribute,
				props.posterAttribute + 'Id',
				props.loopAttribute,
				props.muteAttribute,
			]);
		};
		return (
			<div className="kbs-image-button-selector-inner kbs-image-control">
				<TitleBar
					label={label ? label : __('Video Settings', 'kadence-blocks')}
					reset={true}
					onReset={onReset}
					hasDeviceControls={false}
					hasAdvancedControls={false}
					hasCustomControls={false}
				/>
				{showPoster && (
					<>
						<div className="kbs-image-button-selector-control__content_label">
							{__('Poster Image', 'kadence-blocks')}
						</div>
						{posterURL && (
							<div className="kbs-image-button-selector-control__preview">
								<img src={posterURL} />
							</div>
						)}
						<ImageSelector imageURL={posterURL} imageID={posterID} type={posterAttribute} {...props} />
					</>
				)}
				<ToggleControl
					className="kbs-toggle-control"
					__next40pxDefaultSize
					label={__('Mute Video', 'kadence-blocks')}
					checked={'disabled' === muteVideo ? false : true}
					onChange={(value) =>
						props.onChange([value ? 'enabled' : 'disabled'], props.previewDevice, [props.muteAttribute])
					}
				/>
				<ToggleControl
					className="kbs-toggle-control"
					__next40pxDefaultSize
					label={__('Loop Video', 'kadence-blocks')}
					checked={'disabled' === loopVideo ? false : true}
					onChange={(value) =>
						props.onChange([value ? 'enabled' : 'disabled'], props.previewDevice, [props.loopAttribute])
					}
				/>
				{showMuteButtonAttribute && (
					<ToggleControl
						className="kbs-toggle-control"
						__next40pxDefaultSize
						label={__('Show Mute/Unmute Button', 'kadence-blocks')}
						checked={'enabled' === showMuteButton ? true : false}
						onChange={(value) =>
							props.onChange([value ? 'enabled' : 'disabled'], props.previewDevice, [
								props.showMuteButtonAttribute,
							])
						}
					/>
				)}
				{showPlayButtonAttribute && (
					<ToggleControl
						className="kbs-toggle-control"
						__next40pxDefaultSize
						label={__('Show Play/Pause Button', 'kadence-blocks')}
						checked={'enabled' === showPlayButton ? true : false}
						onChange={(value) =>
							props.onChange([value ? 'enabled' : 'disabled'], props.previewDevice, [
								props.showPlayButtonAttribute,
							])
						}
					/>
				)}
				<div className="kbs-image-button-selector-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}
function renderImageButtonToggle(hasImage, label) {
	return ({ onToggle, isOpen }) => {
		const toggleProps = {
			onClick: onToggle,
			className: clsx('kbs-image-button-selector-button', 'kbs-image-button-selector-control__toggle-button', {
				'is-open': isOpen,
				'is-selected': hasImage,
			}),
			'aria-expanded': isOpen,
			icon: settings,
			label: label ? label : __('Video Settings', 'kadence-blocks'),
		};
		return (
			<>
				<Button {...toggleProps}></Button>
			</>
		);
	};
}
export default function VideoSettingsSelector(props) {
	const { posterURL = '', label = '', showPoster = true } = props;
	const hasImage = showPoster && posterURL;
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
		// style: {
		// 	marginTop: '-72px',
		// },
	};
	return (
		<Dropdown
			popoverProps={popoverProps}
			className="kbs-image-button-selector-control"
			contentClassName="kbs-image-button-selector-control__content"
			renderToggle={renderImageButtonToggle(hasImage, label)}
			renderContent={renderImageButtonDropdown(props)}
		/>
	);
}
