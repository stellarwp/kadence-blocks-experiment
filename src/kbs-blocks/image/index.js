import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

import { imageIcon } from '@kadence/kbsIcons';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType('kbs/image', {
	...metadata,
	title: _x('Image (Adv)', 'block title', 'kadence-blocks'),
	description: __('Image block with greater controls and advanced features', 'kadence-blocks'),
	keywords: [__('image', 'kadence-blocks'), 'KB'],
	icon: {
		src: imageIcon,
	},
	edit,
	save() {
		return null;
	},
	example: {
		attributes: {
			sizeSlug: 'large',
			url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
			// translators: Caption accompanying an image of the Mont Blanc, which serves as an example for the Image block.
			caption: __('Mont Blanc appears—still, snowy, and serene.', 'kadence-blocks'),
		},
	},
});
