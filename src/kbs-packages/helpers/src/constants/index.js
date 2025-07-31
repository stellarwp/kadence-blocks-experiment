import { __ } from '@wordpress/i18n';

export const SPACING_SIZES_MAP = [
	{
		value: '0',
		label: __('None', 'kadence-blocks'),
		size: 0,
		name: __('None', 'kadence-blocks'),
	},
	{
		value: 'xxs',
		output: 'var(--kbs-spacing-xxs, 0.5rem)',
		size: 8,
		label: __('XXS', 'kadence-blocks'),
		name: __('2X Small', 'kadence-blocks'),
	},
	{
		value: 'xs',
		output: 'var(--kbs-spacing-xs, 1rem)',
		size: 16,
		label: __('XS', 'kadence-blocks'),
		name: __('X Small', 'kadence-blocks'),
	},
	{
		value: 'sm',
		output: 'var(--kbs-spacing-sm, 1.5rem)',
		size: 24,
		label: __('SM', 'kadence-blocks'),
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'md',
		output: 'var(--kbs-spacing-md, 2rem)',
		size: 32,
		label: __('MD', 'kadence-blocks'),
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		output: 'var(--kbs-spacing-lg, 3rem)',
		size: 48,
		label: __('LG', 'kadence-blocks'),
		name: __('Large', 'kadence-blocks'),
	},
	{
		value: 'xl',
		output: 'var(--kbs-spacing-xl, 4rem)',
		size: 64,
		label: __('XL', 'kadence-blocks'),
		name: __('X Large', 'kadence-blocks'),
	},
	{
		value: 'xxl',
		output: 'var(--kbs-spacing-xxl, 5rem)',
		size: 80,
		label: __('XXL', 'kadence-blocks'),
		name: __('2X Large', 'kadence-blocks'),
	},
	{
		value: '3xl',
		output: 'var(--kbs-spacing-3xl, 6.5rem)',
		size: 104,
		label: __('3XL', 'kadence-blocks'),
		name: __('3X Large', 'kadence-blocks'),
	},
	{
		value: '4xl',
		output: 'var(--kbs-spacing-4xl, 8rem)',
		size: 128,
		label: __('4XL', 'kadence-blocks'),
		name: __('4X Large', 'kadence-blocks'),
	},
	{
		value: '5xl',
		output: 'var(--kbs-spacing-5xl, 10rem)',
		size: 160,
		label: __('5XL', 'kadence-blocks'),
		name: __('5X Large', 'kadence-blocks'),
	},
];
export const LETTER_SPACING_SIZES_MAP = [
	{
		value: 'none',
		label: __('None', 'kadence-blocks'),
		output: 'var(--kbs-letter-spacing-none, 0rem)',
		name: __('None', 'kadence-blocks'),
	},
	{
		value: 'xs',
		label: __('X Small', 'kadence-blocks'),
		output: 'var(--kbs-letter-spacing-xs, 0.5rem)',
		name: __('X Small', 'kadence-blocks'),
	},
	{
		value: 'sm',
		label: __('Small', 'kadence-blocks'),
		output: 'var(--kbs-letter-spacing-sm, 1rem)',
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'md',
		label: __('Medium', 'kadence-blocks'),
		output: 'var(--kbs-letter-spacing-md, 2rem)',
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		label: __('Large', 'kadence-blocks'),
		output: 'var(--kbs-letter-spacing-lg, 4rem)',
		name: __('Large', 'kadence-blocks'),
	},
];
export const FONT_SIZES_MAP = [
	{
		value: 'sm',
		label: __('Small', 'kadence-blocks'),
		output: 'var(--kbs-font-size-sm, 0.9rem)',
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'base',
		label: __('Base', 'kadence-blocks'),
		output: 'var(--kbs-font-size-base, 1rem)',
		name: __('Base', 'kadence-blocks'),
	},
	{
		value: 'md',
		label: __('Medium', 'kadence-blocks'),
		output: 'var(--kbs-font-size-md, 1.25rem)',
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		label: __('Large', 'kadence-blocks'),
		output: 'var(--kbs-font-size-lg, 2rem)',
		name: __('Large', 'kadence-blocks'),
	},
	{
		value: 'xl',
		label: __('X Large', 'kadence-blocks'),
		output: 'var(--kbs-font-size-xl, 3rem)',
		name: __('X Large', 'kadence-blocks'),
	},
	{
		value: 'xxl',
		label: __('XX Large', 'kadence-blocks'),
		output: 'var(--kbs-font-size-xxl, 56px)',
		name: __('XX Large', 'kadence-blocks'),
	},
	{
		value: '3xl',
		label: __('3X Large', 'kadence-blocks'),
		output: 'var(--kbs-font-size-3xl, 5rem)',
		name: __('3X Large', 'kadence-blocks'),
	},
];
export const LINE_HEIGHT_SIZES_MAP = [
	{
		value: 'xs',
		label: __('X Small', 'kadence-blocks'),
		output: 'var(--kbs-line-height-xs, 1)',
		name: __('X Small', 'kadence-blocks'),
	},
	{
		value: 'sm',
		label: __('Small', 'kadence-blocks'),
		output: 'var(--kbs-line-height-sm, 1.2)',
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'base',
		label: __('Normal', 'kadence-blocks'),
		output: 'var(--kbs-line-height-base, 1.4)',
		name: __('Normal', 'kadence-blocks'),
	},
	{
		value: 'md',
		label: __('Medium', 'kadence-blocks'),
		output: 'var(--kbs-line-height-md, 1.6)',
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		label: __('Large', 'kadence-blocks'),
		output: 'var(--kbs-line-height-lg, 1.8)',
		name: __('Large', 'kadence-blocks'),
	},
	{
		value: 'xl',
		label: __('X Large', 'kadence-blocks'),
		output: 'var(--kbs-line-height-xl, 2)',
		name: __('X Large', 'kadence-blocks'),
	},
];

export const BORDER_RADIUS_SIZES_MAP = [
	{
		value: 'sm',
		output: 'var(--global-kb-border-radius-sm, 5px)',
		label: __('Slight', 'kadence-blocks'),
		size: 5,
		name: __('Slight', 'kadence-blocks'),
	},
	{
		value: 'md',
		output: 'var(--global-kb-border-radius-md, 15px)',
		label: __('Medium', 'kadence-blocks'),
		size: 15,
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		output: 'var(--global-kb-border-radius-lg, 30px)',
		label: __('Heavy', 'kadence-blocks'),
		size: 30,
		name: __('Heavy', 'kadence-blocks'),
	},
];

export const ICON_SIZES_MAP = [
	{
		value: 'xs',
		output: 'var(--kbs-iconsize-xs, 1rem)',
		size: 16,
		label: __('XS', 'kadence-blocks'),
		name: __('X Small', 'kadence-blocks'),
	},
	{
		value: 'sm',
		output: 'var(--kbs-iconsize-sm, 2rem)',
		size: 32,
		label: __('SM', 'kadence-blocks'),
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'md',
		output: 'var(--kbs-iconsize-md, 3rem)',
		size: 48,
		label: __('MD', 'kadence-blocks'),
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		output: 'var(--kbs-iconsize-lg, 4rem)',
		size: 64,
		label: __('LG', 'kadence-blocks'),
		name: __('Large', 'kadence-blocks'),
	},
	{
		value: 'xl',
		output: 'var(--kbs-iconsize-xl, 5rem)',
		size: 80,
		label: __('XL', 'kadence-blocks'),
		name: __('X Large', 'kadence-blocks'),
	},
];

export const CONTENT_WIDTH_SIZES_MAP = [
	{
		value: 'wide',
		output: 'var(--kbs-contentwidth-wide, 800px)',
		size: 800,
		label: __('Wide', 'kadence-blocks'),
		name: __('Wide', 'kadence-blocks'),
	},
	{
		value: 'medium',
		output: 'var(--kbs-contentwidth-medium, 550px)',
		size: 550,
		label: __('Medium', 'kadence-blocks'),
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'narrow',
		output: 'var(--kbs-contentwidth-narrow, 300px)',
		size: 300,
		label: __('Narrow', 'kadence-blocks'),
		name: __('Narrow', 'kadence-blocks'),
	},
	{
		value: 'auto',
		output: '',
		size: 0,
		label: __('Auto', 'kadence-blocks'),
		name: __('Auto', 'kadence-blocks'),
	},
	{
		value: 'full',
		output: 'var(--kbs-contentwidth-full, 100%)',
		size: 1000,
		label: __('Full', 'kadence-blocks'),
		name: __('Full', 'kadence-blocks'),
	},
];

export const COMPONENTS = ['typography', 'flexBox'];
