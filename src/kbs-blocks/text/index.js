import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
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
import { TEXT_ICON } from './constants';

registerBlockType('kbs/text', {
	...metadata,
	title: _x('Text', 'block title', 'kadence-blocks'),
	description: __('A rich text input block for formatted content.', 'kadence-blocks'),
	keywords: [__('text', 'kadence-blocks'), __('paragraph', 'kadence-blocks'), 'KB'],
	icon: {
		src: TEXT_ICON,
	},
	edit,
	save: ({ attributes }) => {
		const { content, uniqueID, htmlTag, align } = attributes;
		const TagName = htmlTag || 'div';
		const classes = ['kbs-text', `kbs-text-${uniqueID}`];
		
		if (align) {
			classes.push(`has-text-align-${align}`);
		}
		
		return (
			<TagName className={classes.join(' ')}>
				<div className="kbs-text-content" dangerouslySetInnerHTML={{ __html: content }} />
			</TagName>
		);
	},
	example: {
		attributes: {
			content: __('Sample text content...', 'kadence-blocks'),
		},
	},
}); 