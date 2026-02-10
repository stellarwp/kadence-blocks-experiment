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
import { buttonsIcon } from '@kadence/kbsIcons';
import edit from './edit';
import metadata from './block.json';

registerBlockType('kbs/buttons', {
	...metadata,
	title: _x('Buttons', 'block title', 'kadence-blocks'),
	description: __('A group of buttons.', 'kadence-blocks'),
	keywords: [
		__('button', 'kadence-blocks'),
		__('buttons', 'kadence-blocks'),
		__('call to action', 'kadence-blocks'),
		'KB',
	],
	icon: {
		src: buttonsIcon,
	},
	edit,
	save: () => {
		return <InnerBlocks.Content />;
	},
});
