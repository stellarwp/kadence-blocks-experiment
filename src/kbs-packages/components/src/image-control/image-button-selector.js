/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';
import { Button, Icon, Dropdown } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { image, close as closeIcon } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import ImageSelector from './image-selector';
import TitleBar from '../title-bar';

function renderImageButtonDropdown(props) {
	return ({ onToggle, isOpen }) => {
		const { imageURL = '', label = '' } = props;
		const onReset = () => {
			props.onChange([undefined, undefined], props.previewDevice, [props.type, props.type + 'Id']);
		};
		return (
			<div className="kbs-image-button-selector-inner kbs-image-control">
				<TitleBar
					label={label ? label : __('Image Control', 'kadence-blocks')}
					reset={true}
					onReset={onReset}
					hasDeviceControls={false}
					hasAdvancedControls={false}
					hasCustomControls={false}
				/>
				{imageURL && (
					<div className="kbs-image-button-selector-control__preview">
						<img src={imageURL} />
					</div>
				)}
				<ImageSelector {...props} />
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
			icon: image,
			label: label ? label : __('Select Image', 'kadence-blocks'),
		};
		return (
			<>
				<Button {...toggleProps}></Button>
			</>
		);
	};
}
export default function ImageButtonSelector(props) {
	const { imageURL = '', label = '' } = props;
	const hasImage = imageURL;
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
