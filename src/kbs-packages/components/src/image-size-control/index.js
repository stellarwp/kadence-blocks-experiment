/**
 * Image Size Control.
 *
 */

/**
 * Import External Libraries
 */
import { isEmpty, compact, get, map } from 'lodash';
/**
 * WordPress libraries
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal libraries
 */
import SelectStyled from '../select-styled';
import TitleBar from '../title-bar';
import './editor.scss';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
const ImageSizeControl = (props) => {
	const { label, id, url, onChange, fullSelection = true, buttonMode = false } = props;
	const [imageSizeOptions, setImageSizeOptions] = useState({});
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const { image } = useSelect(
		(select) => {
			const { getMedia } = select('core');
			return {
				image: id ? getMedia(id, { context: 'view' }) : null,
			};
		},
		[id]
	);
	// @todo: Replace with icon from @kadence/icons once created
	const icons = {
		size: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M13,11H2a1,1,0,0,0-1,1v9a1,1,0,0,0,1,1H12.86c.05,0,.09,0,.14,0a1,1,0,0,0,1-1V12A1,1,0,0,0,13,11ZM7.44,20l1.93-1.93a.3.3,0,0,1,.5,0L11.79,20ZM12,17.38l-.72-.71a2.41,2.41,0,0,0-3.33,0L4.61,20H3V13h9ZM2,4.11a1,1,0,0,0,.86-.49A1.05,1.05,0,0,0,3.05,3,1,1,0,0,0,2,2,1,1,0,0,0,1,3v.1A1,1,0,0,0,2,4.11ZM9.91,4h.19a1,1,0,0,0,0-2H9.91a1,1,0,0,0,0,2ZM2,8.78a1,1,0,0,0,1-1V7.56a1,1,0,1,0-2,0v.22A1,1,0,0,0,2,8.78ZM14.09,2H13.9a1,1,0,0,0,0,2h.19a1,1,0,0,0,0-2ZM5.91,4H6.1a1,1,0,0,0,0-2H5.91a1,1,0,0,0,0,2ZM22,6.4a1,1,0,0,0-1,1v.21a1,1,0,0,0,2,0V7.4A1,1,0,0,0,22,6.4ZM17.12,20h-.24a1,1,0,1,0,0,2h.24a1,1,0,0,0,0-2ZM21.9,2A1,1,0,0,0,21,3a1,1,0,0,0,.1.42A1,1,0,0,0,23,3.11V3A1.09,1.09,0,0,0,21.9,2ZM22,10.9a1,1,0,0,0-1,1v.22a1,1,0,0,0,2,0V11.9A1,1,0,0,0,22,10.9ZM18.09,2H17.9a1,1,0,0,0,0,2h.19a1,1,0,0,0,0-2ZM22,20a.93.93,0,0,0-.44.11A1,1,0,0,0,21,21,1,1,0,0,0,22,22a1.09,1.09,0,0,0,1-1.1A1,1,0,0,0,22,20Zm0-4.56a1,1,0,0,0-1,1v.22a1,1,0,1,0,2,0V16.4A1,1,0,0,0,22,15.4Z"></path>
			</svg>
		),
	};
	const getImageSizeOptions = () => {
		if (image) {
			const sizes = undefined !== image.media_details.sizes ? image.media_details.sizes : [];
			const imgSizes = Object.keys(sizes).map((item) => {
				return { slug: item, name: item };
			});
			return compact(
				map(imgSizes, ({ name, slug }) => {
					const type = get(image, ['mime_type']);
					if ('image/svg+xml' === type) {
						return null;
					}
					const sizeUrl = get(image, ['media_details', 'sizes', slug, 'source_url']);
					if (!sizeUrl) {
						return null;
					}
					const sizeWidth = get(image, ['media_details', 'sizes', slug, 'width']);
					if (!sizeWidth) {
						return null;
					}
					const sizeHeight = get(image, ['media_details', 'sizes', slug, 'height']);
					if (!sizeHeight) {
						return null;
					}
					return {
						value: sizeUrl,
						label: name + ' (' + sizeWidth + 'x' + sizeHeight + ')',
						slug: slug,
						width: sizeWidth,
						height: sizeHeight,
					};
				})
			);
		}
		return null;
	};
	const getSmallImageSizeOptions = () => {
		if (image) {
			const sizes = undefined !== image.media_details.sizes ? image.media_details.sizes : [];
			const standardSizes = [];
			for (let i = 0; i < Object.keys(sizes).length; i++) {
				const item = Object.keys(sizes)[i];
				if (
					'thumbnail' === item ||
					'medium' === item ||
					'medium_large' === item ||
					'large' === item ||
					'full' === item
				) {
					standardSizes.push({ slug: item, name: item });
				}
			}
			return compact(
				map(standardSizes, ({ name, slug }) => {
					const type = get(image, ['mime_type']);
					if ('image/svg+xml' === type) {
						return null;
					}
					const sizeUrl = get(image, ['media_details', 'sizes', slug, 'source_url']);
					if (!sizeUrl) {
						return null;
					}
					const sizeWidth = get(image, ['media_details', 'sizes', slug, 'width']);
					if (!sizeWidth) {
						return null;
					}
					const sizeHeight = get(image, ['media_details', 'sizes', slug, 'height']);
					if (!sizeHeight) {
						return null;
					}
					return {
						value: sizeUrl,
						label: name + ('full' === slug ? '' : ' (' + sizeWidth + 'x' + sizeHeight + ')'),
						slug: slug,
						width: sizeWidth,
						height: sizeHeight,
					};
				})
			);
		}
		return null;
	};

	useEffect(() => {
		if (undefined === fullSelection || true === fullSelection) {
			setImageSizeOptions(getImageSizeOptions());
		} else {
			setImageSizeOptions(getSmallImageSizeOptions());
		}
	}, [image]);
	if (buttonMode) {
		return (
			<>
				{!isEmpty(imageSizeOptions) && (
					<DropdownMenu
						className="kbs-image-size-control__dropdown"
						contentClassName={'kbs-image-size-control__dropdown_content'}
						icon={icons.size}
						label={__('Image Size', 'kadence-blocks')}
						popoverProps={popoverProps}
					>
						{({ onClose }) => (
							<MenuGroup>
								{imageSizeOptions.map((option) => (
									<MenuItem
										key={option.value}
										isPressed={option.value === url}
										className="kbs-image-size-control__button"
										onClick={() => {
											onChange(option);
											onClose();
										}}
									>
										{option.label}
									</MenuItem>
								))}
							</MenuGroup>
						)}
					</DropdownMenu>
				)}
			</>
		);
	}
	return (
		<>
			{!isEmpty(imageSizeOptions) && (
				<div className="components-base-control kbs-control kbs-image-size-control">
					{label && (
						<TitleBar
							label={label}
							reset={false}
							hasDeviceControls={false}
							hasAdvancedControls={false}
							isCustom={false}
							hasCustomControls={false}
						/>
					)}
					<div className="kbs-control-inner">
						<SelectStyled
							options={imageSizeOptions}
							value={imageSizeOptions.filter(({ value }) => value === url)}
							isMulti={false}
							maxMenuHeight={250}
							isClearable={false}
							placeholder={''}
							onChange={onChange}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default ImageSizeControl;
