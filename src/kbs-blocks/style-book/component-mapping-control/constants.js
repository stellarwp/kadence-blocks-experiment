import { __ } from '@wordpress/i18n';

export const MAPPING_COMPONENT_OPTIONS = {
	'font-family': {
		label: __('Font Family', 'kadence-blocks'),
		options: ['body', 'heading', 'heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6'],
	},
	'font-size': {
		label: __('Font Size', 'kadence-blocks'),
		options: ['sm', 'md', 'lg', 'xl', 'xxl', '3xl'],
	},
	'border-radius': {
		label: __('Border Radius', 'kadence-blocks'),
		options: ['sm', 'md', 'lg'],
	},
};
