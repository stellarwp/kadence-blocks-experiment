import { __ } from '@wordpress/i18n';

export const BORDER_STYLES_DEFAULTS = {
	color: { var: 'var(--kbs-border-default-color,transparent)', value: 'transparent' },
	style: { var: 'var(--kbs-border-default-style,solid)', value: 'solid' },
	width: { var: 'var(--kbs-border-default-width,0)', value: '0' },
};

export const BORDER_RADIUS_SIZES_MAP = [
	{
		value: '0',
		label: __('None', 'kadence-blocks'),
		size: 0,
		name: __('None', 'kadence-blocks'),
	},
	{
		value: 'sm',
		output: 'var(--global-kb-border-radius-sm, clamp(5px, 3.4321px + 0.3484vw, 7px))',
		label: __('Small', 'kadence-blocks'),
		size: 5,
		name: __('SM', 'kadence-blocks'),
	},
	{
		value: 'md',
		output: 'var(--global-kb-border-radius-md, clamp(15px, 10.2962px + 1.0453vw, 21px))',
		label: __('Medium', 'kadence-blocks'),
		size: 15,
		name: __('MD', 'kadence-blocks'),
	},
	{
		value: 'lg',
		output: 'var(--global-kb-border-radius-lg, clamp(30px, 20.5923px + 2.0906vw, 42px))',
		label: __('Large', 'kadence-blocks'),
		size: 30,
		name: __('LG', 'kadence-blocks'),
	},
	{
		value: 'xl',
		output: 'var(--global-kb-border-radius-xl, clamp(60px, 41.1847px + 4.1812vw, 84px))',
		label: __('X-Large', 'kadence-blocks'),
		size: 60,
		name: __('XL', 'kadence-blocks'),
	},
	{
		value: 'full',
		output: 'var(--global-kb-border-radius-full, 100%)',
		label: __('Full', 'kadence-blocks'),
		size: 100,
		name: __('Full', 'kadence-blocks'),
	},
];
