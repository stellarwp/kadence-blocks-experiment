/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plusCircleFilled, closeSmall, image } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import MediaPlaceholder from '../media-placeholder';
import DynamicImageControl from '../dynamic-image';
import ImageSizeControl from '../image-size-control';
import './editor.scss';

export default function ImageSelector(props) {
	const {
		type,
		previewDevice = 'desktop',
		onChange,
		hasSizeControls = false,
		hasClearControls = true,
		dynamicAttribute = '',
		imageURL = '',
		imageID = '',
		dynamicImage = {},
	} = props;
	const idAttribute = type + 'Id';
	const onRemoveImage = (device) => {
		onChange([undefined, undefined], device, [type, idAttribute]);
	};
	const onImageSelect = (value, device) => {
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
	const hasImage = imageURL;
	return (
		<div className="kbs-image-selector-inner kbs-image-control">
			{!hasImage && (
				<MediaPlaceholder
					labels={''}
					selectIcon={plusCircleFilled}
					selectLabel={__('Select Image', 'kadence-blocks')}
					onSelect={(img) => {
						onImageSelect(img, previewDevice);
					}}
					onSelectURL={(newURL) => onImageSelect({ url: newURL }, previewDevice)}
					accept="image/*"
					className={'kbs-image-upload-placeholder'}
					allowedTypes={'image'}
					disableMediaButtons={false}
					dynamicControl={
						dynamicAttribute && kbs_params.dynamic_enabled ? (
							<DynamicImageControl customOnChange={onChange} dynamicAttributes={dynamicImage} {...props} />
						) : undefined
					}
				/>
			)}
			{hasImage && (
				<>
					{dynamicAttribute &&
					kbs_params.dynamic_enabled &&
					dynamicImage?.enable ? (
						<div className="kb-dynamic-image-sidebar-top">
							<DynamicImageControl
								startOpen={dynamicImage?.field ? false : true}
								customOnChange={onChange}
								dynamicAttributes={dynamicImage}
								{...props}
							/>
						</div>
					) : (
						<div className="kbs-image-edit-wrap">
							<MediaUpload
								onSelect={(img) => onImageSelect(img, previewDevice)}
								type="image"
								value={imageID ? imageID : ''}
								render={({ open }) => (
									<Button
										className={'kbs-upload-edit-btn'}
										variant="secondary"
										onClick={open}
										icon={image}
									>
										{__('Edit Image', 'kadence-blocks')}
									</Button>
								)}
							/>
							{hasClearControls && (
								<Button
									icon={closeSmall}
									label={__('Remove Image', 'kadence-blocks')}
									className={'kbs-upload-remove-btn'}
									variant="secondary"
									onClick={() => onRemoveImage(previewDevice)}
								/>
							)}
							{hasSizeControls && imageID && (
								<ImageSizeControl
									buttonMode={true}
									id={imageID}
									url={imageURL}
									onChange={(newImage) => {
										onImageSelect({ url: newImage.value, id: imageID }, previewDevice);
									}}
								/>
							)}
							{dynamicAttribute && kbs_params.dynamic_enabled && (
								<DynamicImageControl
									customOnChange={onChange}
									dynamicAttributes={dynamicImage}
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
