import { __ } from '@wordpress/i18n';
/**
 * Get the options for the font size control.
 */
export default function getFontSizeOptions() {
	return [
		{
			title: __('Small', 'kadence-blocks'),
			name: 'SM',
			key: 'sm',
		},
		{
			title: __('Base', 'kadence-blocks'),
			name: 'Base',
			key: 'base',
		},
		{
			title: __('Medium', 'kadence-blocks'),
			name: 'MD',
			key: 'md',
		},
		{
			title: __('Large', 'kadence-blocks'),
			name: 'LG',
			key: 'lg',
		},
		{
			title: __('X Large', 'kadence-blocks'),
			name: 'XL',
			key: 'xl',
		},
		{
			title: __('2X Large', 'kadence-blocks'),
			name: 'XXL',
			key: 'xxl',
		},
		{
			title: __('3X Large', 'kadence-blocks'),
			name: '3XL',
			key: '3xl',
		},
	];
}
