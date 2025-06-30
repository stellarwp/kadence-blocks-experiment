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
import { ROW_ICON } from './constants';
import edit from './edit';
import metadata from './block.json';

registerBlockType('kbs/row', {
	...metadata,
	title: _x('Row/Grid', 'block title', 'kadence-blocks'),
	description: __('A row to style a section of content.', 'kadence-blocks'),
	keywords: [__('row', 'kadence-blocks'), __('grid', 'kadence-blocks'), 'KB'],
	icon: {
		src: ROW_ICON,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
