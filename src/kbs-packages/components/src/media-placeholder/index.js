import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { every, startsWith, get, isArray, noop } from 'lodash';
import classnames from 'classnames';
import { keyboardReturn } from '@wordpress/icons';
import {
	Placeholder,
	Button,
	FormFileUpload,
	DropZone,
	__experimentalInputControl as InputControl,
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { MediaUpload, URLPopover, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
const InsertFromURLPopover = ({ src, onChange, onSubmit, onClose, popoverAnchor }) => (
	<URLPopover anchor={popoverAnchor} onClose={onClose}>
		<form className="block-editor-media-placeholder__url-input-form" onSubmit={onSubmit}>
			<InputControl
				__next40pxDefaultSize
				label={__('URL')}
				type="text" // Use text instead of URL to allow relative paths (e.g., /image/image.jpg)
				hideLabelFromVision
				placeholder={__('Paste or type URL')}
				onChange={onChange}
				value={src}
				suffix={
					<InputControlSuffixWrapper variant="control">
						<Button size="small" icon={keyboardReturn} label={__('Apply')} type="submit" />
					</InputControlSuffixWrapper>
				}
			/>
		</form>
	</URLPopover>
);

const MediaPlaceholder = (props) => {
	const {
		allowedTypes = [],
		className,
		icon,
		isAppender,
		labels = {},
		onDoubleClick,
		mediaPreview,
		notices,
		onSelectURL,
		mediaUpload,
		children,
		value = {},
		selectLabel = __('Select Image', 'kadence-blocks'),
		selectIcon,
		accept,
		addToGallery,
		multiple = false,
		onSelect,
		disableDropZone,
		onHTMLDrop = noop,
		onCancel,
		dynamicControl,
		disableMediaButtons,
		dropZoneUIOnly,
		onFilesPreUpload = noop,
		onError,
	} = props;

	const [src, setSrc] = useState('');
	const [isURLInputVisible, setIsURLInputVisible] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	useEffect(() => {
		setSrc(get(value, ['src'], ''));
	}, [value]);

	const onlyAllowsImages = useCallback(() => {
		if (!allowedTypes) {
			return false;
		}
		return every(allowedTypes, (allowedType) => {
			return allowedType === 'image' || startsWith(allowedType, 'image/');
		});
	}, [allowedTypes]);

	const onChangeSrc = useCallback((event) => {
		setSrc(event.target.value);
	}, []);

	const onSubmitSrc = useCallback(
		(event) => {
			event.preventDefault();
			if (src && onSelectURL) {
				onSelectURL(src);
				setIsURLInputVisible(false);
			}
		},
		[src, onSelectURL]
	);

	const onFilesUpload = useCallback(
		(files) => {
			onFilesPreUpload(files);
			let setMedia;
			if (multiple) {
				if (addToGallery) {
					let lastMediaPassed = [];
					setMedia = (newMedia) => {
						const filteredMedia = (value || []).filter((item) => {
							if (item.id) {
								return !lastMediaPassed.some(({ id }) => Number(id) === Number(item.id));
							}
							return !lastMediaPassed.some(({ urlSlug }) => item.url.includes(urlSlug));
						});
						onSelect(filteredMedia.concat(newMedia));
						lastMediaPassed = newMedia.map((media) => {
							const cutOffIndex = media.url.lastIndexOf('.');
							const urlSlug = media.url.slice(0, cutOffIndex);
							return { id: media.id, urlSlug };
						});
					};
				} else {
					setMedia = onSelect;
				}
			} else {
				setMedia = ([media]) => onSelect(media);
			}
			mediaUpload({
				allowedTypes,
				filesList: files,
				onFileChange: setMedia,
				onError,
			});
		},
		[multiple, addToGallery, value, onSelect, mediaUpload, allowedTypes, onError, onFilesPreUpload]
	);

	const onUpload = useCallback(
		(event) => {
			onFilesUpload(event.target.files);
		},
		[onFilesUpload]
	);

	const openURLInput = useCallback(() => {
		setIsURLInputVisible(true);
	}, []);

	const closeURLInput = useCallback(() => {
		setIsURLInputVisible(false);
	}, []);

	const renderPlaceholder = useCallback(
		(content, onClick) => {
			let instructions = labels.instructions;
			const title = labels.title;

			if (!mediaUpload && !onSelectURL) {
				instructions = __('To edit this block, you need permission to upload media.', 'kadence-blocks');
			}

			if (instructions === undefined || title === undefined) {
				const isOneType = 1 === allowedTypes.length;
				const isAudio = isOneType && 'audio' === allowedTypes[0];
				const isImage = isOneType && 'image' === allowedTypes[0];
				const isVideo = isOneType && 'video' === allowedTypes[0];

				if (instructions === undefined && mediaUpload) {
					instructions = __('Upload a media file or pick one from your media library.', 'kadence-blocks');

					if (isAudio) {
						instructions = __(
							'Upload an audio file, pick one from your media library, or add one with a URL.',
							'kadence-blocks'
						);
					} else if (isImage) {
						instructions = __(
							'Upload an image file, pick one from your media library, or add one with a URL.',
							'kadence-blocks'
						);
					} else if (isVideo) {
						instructions = __(
							'Upload a video file, pick one from your media library, or add one with a URL.',
							'kadence-blocks'
						);
					}
				}
			}

			const placeholderClassName = classnames('block-editor-media-placeholder', className, {
				'is-appender': isAppender,
			});

			return (
				<Placeholder
					icon={icon}
					label={title ? title : undefined}
					instructions={instructions}
					className={placeholderClassName}
					notices={notices}
					onClick={onClick}
					onDoubleClick={onDoubleClick}
					preview={mediaPreview}
				>
					{content}
					{children}
				</Placeholder>
			);
		},
		[
			labels,
			mediaUpload,
			onSelectURL,
			allowedTypes,
			className,
			isAppender,
			icon,
			notices,
			onDoubleClick,
			mediaPreview,
			children,
		]
	);

	const renderDropZone = useCallback(() => {
		if (disableDropZone) {
			return null;
		}
		return <DropZone onFilesDrop={onFilesUpload} onHTMLDrop={onHTMLDrop} />;
	}, [disableDropZone, onFilesUpload, onHTMLDrop]);

	const renderCancelLink = useCallback(() => {
		return (
			onCancel && (
				<Button
					className="block-editor-media-placeholder__cancel-button"
					title={__('Cancel', 'kadence-blocks')}
					variant="link"
					onClick={onCancel}
				>
					{__('Cancel', 'kadence-blocks')}
				</Button>
			)
		);
	}, [onCancel]);

	const renderUrlSelectionUI = useCallback(() => {
		if (!onSelectURL) {
			return null;
		}
		return (
			<div className="block-editor-media-placeholder__url-input-container">
				<Button
					__next40pxDefaultSize
					className="block-editor-media-placeholder__button"
					onClick={openURLInput}
					isPressed={isURLInputVisible}
					variant="secondary"
					aria-haspopup="dialog"
					ref={setPopoverAnchor}
				>
					{__('Insert from URL', 'kadence-blocks')}
				</Button>
				{isURLInputVisible && (
					<InsertFromURLPopover
						src={src}
						onChange={onChangeSrc}
						onSubmit={onSubmitSrc}
						onClose={closeURLInput}
						popoverAnchor={popoverAnchor}
					/>
				)}
			</div>
		);
	}, [onSelectURL, isURLInputVisible, src, onChangeSrc, onSubmitSrc, openURLInput, closeURLInput]);

	const renderDynamicSelectionUI = useCallback(() => {
		if (!dynamicControl) {
			return null;
		}
		return <div className="block-editor-media-placeholder__dynamic-input-container">{dynamicControl}</div>;
	}, [dynamicControl]);

	const renderMediaUploadChecked = useCallback(() => {
		const mediaLibraryButton = (
			<MediaUpload
				addToGallery={addToGallery}
				gallery={multiple && onlyAllowsImages()}
				multiple={multiple}
				onSelect={onSelect}
				allowedTypes={allowedTypes}
				value={isArray(value) ? value.map(({ id }) => id) : value.id}
				render={({ open }) => {
					return (
						<Button
							__next40pxDefaultSize
							variant="primary"
							icon={selectIcon ? selectIcon : undefined}
							onClick={(event) => {
								event.stopPropagation();
								open();
							}}
						>
							{selectLabel}
						</Button>
					);
				}}
			/>
		);

		if (mediaUpload && isAppender) {
			return (
				<>
					{renderDropZone()}
					<FormFileUpload
						onChange={onUpload}
						accept={accept}
						multiple={multiple}
						render={({ openFileDialog }) => {
							const content = (
								<>
									{mediaLibraryButton}
									{renderUrlSelectionUI()}
									{renderCancelLink()}
									{renderDynamicSelectionUI()}
								</>
							);
							return renderPlaceholder(content, openFileDialog);
						}}
					/>
				</>
			);
		}

		if (mediaUpload) {
			const content = (
				<>
					{renderDropZone()}
					{mediaLibraryButton}
					{renderUrlSelectionUI()}
					{renderCancelLink()}
					{renderDynamicSelectionUI()}
				</>
			);
			return renderPlaceholder(content);
		}

		return renderPlaceholder(mediaLibraryButton);
	}, [
		addToGallery,
		multiple,
		onlyAllowsImages,
		onSelect,
		allowedTypes,
		value,
		selectIcon,
		selectLabel,
		mediaUpload,
		isAppender,
		renderDropZone,
		onUpload,
		accept,
		renderUrlSelectionUI,
		renderCancelLink,
		renderDynamicSelectionUI,
		renderPlaceholder,
	]);

	if (dropZoneUIOnly || disableMediaButtons) {
		return <MediaUploadCheck>{renderDropZone()}</MediaUploadCheck>;
	}

	return (
		<MediaUploadCheck fallback={renderPlaceholder(renderUrlSelectionUI())}>
			{renderMediaUploadChecked()}
		</MediaUploadCheck>
	);
};

export default withSelect((select) => {
	const { getSettings } = select('core/block-editor');
	return {
		mediaUpload: getSettings().mediaUpload,
	};
})(MediaPlaceholder);
