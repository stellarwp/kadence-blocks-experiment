import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
import { getResolvedValue } from '@kadence/kbsHelpers';
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
	title: _x('Text (Adv)', 'block title', 'kadence-blocks'),
	description: __('A rich text input block for formatted content.', 'kadence-blocks'),
	keywords: [__('text', 'kadence-blocks'), __('paragraph', 'kadence-blocks'), 'KB'],
	icon: {
		src: TEXT_ICON,
	},
	edit,
	save: ({ attributes }) => {
		const { content, globalStyleIds } = attributes;

		const htmlTagDesktopValue = getResolvedValue(
			'headingTag',
			attributes,
			'desktop',
			metadata,
			'headingTag',
			globalStyleIds
		);
		const previewHeadingTag = htmlTagDesktopValue?.appliedValue;
		return React.createElement(previewHeadingTag, {
			className: 'kbs-text-content',
			dangerouslySetInnerHTML: { __html: content },
		});
	},
	example: {
		attributes: {
			content: __('Sample text content...', 'kadence-blocks'),
		},
	},
});
