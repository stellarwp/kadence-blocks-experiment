import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal dependencies
 */
import { SECTION_ICON } from './constants';
import edit from './edit';
import metadata from './block.json';

registerBlockType('kbs/container', {
	...metadata,
	title: _x('Container', 'block title', 'kadence-blocks'),
	description: __('A container to style a section of content.', 'kadence-blocks'),
	keywords: [__('column', 'kadence-blocks'), __('section', 'kadence-blocks'), 'KB'],
	icon: {
		src: SECTION_ICON,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
	example: {
		attributes: {
			background: '#DADADA',
			padding: [30, 20, 30, 20],
		},
		innerBlocks: [
			{
				name: 'core/paragraph',
				attributes: {
					content: __('Section content', 'kadence-blocks'),
				},
			},
		],
	},
});
