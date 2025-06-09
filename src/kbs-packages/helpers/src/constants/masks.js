import { __ } from '@wordpress/i18n';

export const masks = [
	{
		label: __('Dots 1', 'kadence-blocks'),
		value: 'kbs-pattern-dots-1',
		'background-image':
			'radial-gradient(var(--kbs-pattern-color) calc( ( 1px*(var(--kbs-pattern-size) + 4)/20)), var(--kbs-pattern-bg) calc( ( 1px*(var(--kbs-pattern-size) + 4)/20)))',
		'background-size': 'calc( 1px*(var(--kbs-pattern-size) + 4)) calc( 1px*(var(--kbs-pattern-size) + 4))',
	},
	{
		label: __('Dots 2', 'kadence-blocks'),
		value: 'kbs-pattern-dots-2',
		'background-image':
			'radial-gradient(var(--kbs-pattern-color) calc( ( 1px*(var(--kbs-pattern-size) + 4)/20)), transparent calc( ( 1px*(var(--kbs-pattern-size) + 4)/20))), radial-gradient(var(--kbs-pattern-color) calc( ( 1px*(var(--kbs-pattern-size) + 4)/20)), var(--kbs-pattern-bg) calc( ( 1px*(var(--kbs-pattern-size) + 4)/20)))',
		'background-size':
			'calc( 2 * (1px*(var(--kbs-pattern-size) + 4))) calc( 2 * (1px*(var(--kbs-pattern-size) + 4)))',
		'background-position': '0 0,calc( 1px*(var(--kbs-pattern-size) + 4)) calc( 1px*(var(--kbs-pattern-size) + 4))',
	},
	{
		label: __('Plus 1', 'kadence-blocks'),
		value: 'kbs-pattern-plus-1',
		background:
			'radial-gradient(circle, transparent 20%, var(--kbs-pattern-bg) 20%, var(--kbs-pattern-bg) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, var(--kbs-pattern-bg) 20%, var(--kbs-pattern-bg) 80%, transparent 80%, transparent) calc( 1px*(var(--kbs-pattern-size) + 10)) calc( 1px*(var(--kbs-pattern-size) + 10)), linear-gradient(var(--kbs-pattern-color) calc((1px*(var(--kbs-pattern-size) + 10))/12.5), transparent calc((1px*(var(--kbs-pattern-size) + 10))/12.5)) 0 calc((-1px*(var(--kbs-pattern-size) + 10))/25), linear-gradient( 90deg, var(--kbs-pattern-color) calc((1px*(var(--kbs-pattern-size) + 10))/12.5), var(--kbs-pattern-bg) calc((1px*(var(--kbs-pattern-size) + 10))/12.5)) calc((-1px*(var(--kbs-pattern-size) + 10))/25) 0',
		'background-size':
			'calc( 2*(1px*(var(--kbs-pattern-size) + 10))) calc( 2*(1px*(var(--kbs-pattern-size) + 10))), calc( 2*(1px*(var(--kbs-pattern-size) + 10))) calc( 2*(1px*(var(--kbs-pattern-size) + 10))), calc( 1px*(var(--kbs-pattern-size) + 10)) calc( 1px*(var(--kbs-pattern-size) + 10)), calc( 1px*(var(--kbs-pattern-size) + 10)) calc( 1px*(var(--kbs-pattern-size) + 10))',
	},
];
