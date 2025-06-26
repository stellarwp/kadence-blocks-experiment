import { __ } from '@wordpress/i18n';

export const BORDER_STYLES_DEFAULTS = {
	color: 'var(--kbs-border-default-color,black)',
	style: 'var(--kbs-border-default-style,solid)',
	width: 'var(--kbs-border-default-width,0)',
};

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
