import { __ } from '@wordpress/i18n';
/**
 * Pattern category groups
 *
 * @type {Object}
 */
export const PATTERN_CATEGORY_GROUPS = {
	CONTENT: ['accordion', 'cards', 'counter-stats', 'hero', 'page-title', 'table', 'testimonials'],
	MEDIA: ['gallery', 'image-text', 'logo-farm', 'video-text'],
	OTHER: ['header', 'footer', 'navigation'],
};
export const PATTERN_STYLES = [
	{ label: __('Base', 'kadence-blocks'), value: 'base' },
	{ label: __('Contrast', 'kadence-blocks'), value: 'contrast' },
	{ label: __('Accent', 'kadence-blocks'), value: 'accent' },
];
