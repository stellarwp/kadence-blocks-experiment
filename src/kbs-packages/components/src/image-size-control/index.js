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
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
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
	const [imageSizeOptions, setImageSizeOptions] = useState({});
	const { label, id, url, onChange, fullSelection = true } = props;
	const { image } = useSelect(
		(select) => {
			const { getMedia } = select('core');
			return {
				image: id ? getMedia(id, { context: 'view' }) : null,
			};
		},
		[id]
	);
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
