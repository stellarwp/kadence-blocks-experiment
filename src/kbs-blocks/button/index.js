import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
import { getResolvedValue } from '@kadence/kbsHelpers';
import { buttonsIcon } from '@kadence/kbsIcons';

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

registerBlockType('kbs/button', {
	...metadata,
	title: _x('Button (Adv)', 'block title', 'kadence-blocks'),
	description: __('A button block.', 'kadence-blocks'),
	keywords: [__('button', 'kadence-blocks'), 'KB'],
	icon: {
		src: buttonsIcon,
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
			className: 'kbs-button-content',
			dangerouslySetInnerHTML: { __html: content },
		});
	},
	example: {
		attributes: {
			content: __('Sample button content...', 'kadence-blocks'),
		},
	},
});
