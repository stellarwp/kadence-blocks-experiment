/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
export const SECTION_ICON = <svg
xmlns="http://www.w3.org/2000/svg"
fillRule="evenodd"
width="20px" height="20px"
strokeLinejoin="round"
strokeMiterlimit="2"
clipRule="evenodd"
viewBox="0 0 48 48"
>
<path
	fill="var(--kadence-color, #0058b0 )"
	d="M23.41 29.629h-5.385v1.652h5.385v-1.652zm7.18 0h-5.385v1.652h5.385v-1.652zm7.18 0h-5.385v1.652h5.385v-1.652zM4.587 28.613H2.792v.629l.006.142c.079 1.059 1.039 1.897 2.21 1.897h4.041v-1.652H5.008c-.232 0-.421-.174-.421-.387v-.629zm11.642 1.016h-5.385v1.652h5.385v-1.652zm27.183-1.582v1.195c0 .213-.189.387-.421.387h-3.426v1.652h3.426c1.223 0 2.216-.914 2.216-2.039v-1.195h-1.795zM4.587 22.004H2.792v4.957h1.795v-4.957zm38.825-.566v4.957h1.795v-4.957h-1.795zM4.587 15.396H2.792v4.956h1.795v-4.956zm38.825-.567v4.957h1.795v-4.957h-1.795zM7.751 11.533V9.881H5.008c-1.223 0-2.216.914-2.216 2.039v1.823h1.795V11.92c0-.213.189-.387.421-.387h2.743zm35.661.387v1.257h1.795V11.92h-1.795zm-5.145-.387h4.724c.232 0 .421.174.421.387h1.795c0-1.125-.993-2.039-2.216-2.039h-4.724v1.652zm-23.335 0V9.881H9.546v1.652h5.386zm7.18 0V9.881h-5.385v1.652h5.385zm7.18 0V9.881h-5.385v1.652h5.385zm7.18 0V9.881h-5.385v1.652h5.385z"
	transform="translate(0 3.418) matrix(1.11418 0 0 1.21048 -2.754 -4.333)"
></path>
<path
	fill="var(--kadence-color, #0058b0 )"
	fillRule="nonzero"
	d="M24 40.123c4.365 0 7.957-3.592 7.957-7.957S28.365 24.209 24 24.209s-7.957 3.592-7.957 7.957v.003c0 4.363 3.591 7.954 7.954 7.954H24z"
	transform="translate(0 3.418) matrix(.91115 0 0 .91115 2.132 -8.726)"
></path>
<path
	fill="var(--kadence-color-white, #ffffff )"
	fillRule="nonzero"
	d="M20.811 31.539h2.307V29.23c0-.484.398-.882.882-.882s.882.398.882.882v2.309h2.307c.483 0 .882.398.882.882a.887.887 0 01-.882.882h-2.307v2.307a.886.886 0 01-.882.882.886.886 0 01-.882-.882v-2.307h-2.307a.887.887 0 01-.882-.882c0-.484.399-.882.882-.882z"
	transform="translate(0 3.418) translate(0 -11.6)"
></path>
</svg>;

export const FORM_ALLOWED_BLOCKS = [
	'core/paragraph',
	'kadence/advancedheading',
	'kadence/spacer',
	'kadence/rowlayout',
	'kadence/column',
	'kadence/advanced-form-text',
	'kadence/advanced-form-textarea',
	'kadence/advanced-form-select',
	'kadence/advanced-form-submit',
	'kadence/advanced-form-radio',
	'kadence/advanced-form-file',
	'kadence/advanced-form-time',
	'kadence/advanced-form-date',
	'kadence/advanced-form-telephone',
	'kadence/advanced-form-checkbox',
	'kadence/advanced-form-email',
	'kadence/advanced-form-accept',
	'kadence/advanced-form-number',
	'kadence/advanced-form-hidden',
	'kadence/advanced-form-captcha',
];
export const SPACING_SIZES_MAP = [
	{
		value: '0',
		label: __('None', 'kadence-blocks'),
		size: 0,
		name: __('None', 'kadence-blocks'),
	},
	{
		value: 'xxs',
		output: 'var(--global-kb-spacing-xxs, 0.5rem)',
		size: 8,
		label: __('XXS', 'kadence-blocks'),
		name: __('2X Small', 'kadence-blocks'),
	},
	{
		value: 'xs',
		output: 'var(--global-kb-spacing-xs, 1rem)',
		size: 16,
		label: __('XS', 'kadence-blocks'),
		name: __('X Small', 'kadence-blocks'),
	},
	{
		value: 'sm',
		output: 'var(--global-kb-spacing-sm, 1.5rem)',
		size: 24,
		label: __('SM', 'kadence-blocks'),
		name: __('Small', 'kadence-blocks'),
	},
	{
		value: 'md',
		output: 'var(--global-kb-spacing-md, 2rem)',
		size: 32,
		label: __('MD', 'kadence-blocks'),
		name: __('Medium', 'kadence-blocks'),
	},
	{
		value: 'lg',
		output: 'var(--global-kb-spacing-lg, 3rem)',
		size: 48,
		label: __('LG', 'kadence-blocks'),
		name: __('Large', 'kadence-blocks'),
	},
	{
		value: 'xl',
		output: 'var(--global-kb-spacing-xl, 4rem)',
		size: 64,
		label: __('XL', 'kadence-blocks'),
		name: __('X Large', 'kadence-blocks'),
	},
	{
		value: 'xxl',
		output: 'var(--global-kb-spacing-xxl, 5rem)',
		size: 80,
		label: __('XXL', 'kadence-blocks'),
		name: __('2X Large', 'kadence-blocks'),
	},
	{
		value: '3xl',
		output: 'var(--global-kb-spacing-3xl, 6.5rem)',
		size: 104,
		label: __('3XL', 'kadence-blocks'),
		name: __('3X Large', 'kadence-blocks'),
	},
	{
		value: '4xl',
		output: 'var(--global-kb-spacing-4xl, 8rem)',
		size: 128,
		label: __('4XL', 'kadence-blocks'),
		name: __('4X Large', 'kadence-blocks'),
	},
	{
		value: '5xl',
		output: 'var(--global-kb-spacing-5xl, 10rem)',
		size: 160,
		label: __('5XL', 'kadence-blocks'),
		name: __('5X Large', 'kadence-blocks'),
	},
];

//Mapping of column amounts and their colLayout values to what each column width should be.
export const COLUMN_WIDTH_MAP = {
	1: {
		equal: [100],
	},
	2: {
		'left-golden': [66.67, 33.33],
		'right-golden': [33.33, 66.67],
		equal: [50, 50],
	},
	3: {
		'first-row': [100, 50, 50],
		'left-half': [50, 25, 25],
		'right-half': [25, 25, 50],
		'center-half': [25, 50, 25],
		'center-wide': [20, 60, 20],
		'center-exwide': [15, 70, 15],
		equal: [33.33, 33.33, 33.33],
	},
	4: {
		'left-forty': [40, 20, 20, 20],
		'right-forty': [20, 20, 20, 40],
		equal: [25, 25, 25, 25],
	},
	5: {
		equal: [20, 20, 20, 20, 20],
	},
	6: {
		equal: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66],
	},
};

export const PADDING_RESIZE_MAP = [0, 8, 16, 24, 32, 48, 64, 80, 104, 128, 160];
