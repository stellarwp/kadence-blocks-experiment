/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
export const SECTION_ICON = <svg
xmlns="http://www.w3.org/2000/svg"
fillRule="evenodd"
strokeLinejoin="round"
strokeMiterlimit="2"
clipRule="evenodd"
viewBox="0 0 24 24"
>
<path fill="var(--kadence-color, #0058b0)" d="M13.456 9.185l-1.894 6.775a.142.142 0 01-.14.115h-.644a.246.246 0 01-.037-.004.143.143 0 01-.099-.175l1.895-6.775a.142.142 0 01.14-.115h.646c.012 0 .025.002.037.004a.146.146 0 01.096.175zm4.428 6.566h-1.807c-.262 0-.448-.057-.558-.175-.113-.117-.168-.303-.168-.558v-4.447c0-.259.057-.448.172-.561.115-.115.299-.172.554-.172h1.918c.283 0 .526.018.733.053.207.037.393.101.559.202.14.083.262.189.372.317a1.392 1.392 0 01.331.913c0 .591-.296 1.026-.887 1.299.777.248 1.166.729 1.166 1.444 0 .331-.085.63-.256.894-.17.267-.397.462-.685.587a2.391 2.391 0 01-.62.158c-.24.032-.513.046-.824.046zm-.089-2.625h-1.249v1.726h1.288c.811 0 1.216-.292 1.216-.876 0-.299-.103-.515-.315-.65-.209-.134-.524-.2-.94-.2zm-1.249-2.389v1.529h1.099c.299 0 .529-.03.692-.085a.67.67 0 00.375-.322.729.729 0 00.101-.379c0-.299-.105-.497-.319-.596-.212-.099-.538-.147-.973-.147h-.975zm-8.534 4.345l-.283-.742H5.327l-.283.756c-.11.297-.204.497-.283.598-.078.103-.204.156-.381.156a.567.567 0 01-.4-.165.509.509 0 01-.173-.375c0-.081.014-.166.039-.251.028-.087.072-.204.134-.358l1.51-3.838c.044-.11.094-.241.157-.395.059-.156.124-.283.193-.386a.825.825 0 01.269-.249.817.817 0 01.413-.094c.168 0 .309.032.419.094.113.065.2.145.269.244s.126.207.172.322c.046.115.108.267.18.457l1.545 3.815c.121.289.181.501.181.632a.53.53 0 01-.17.377.562.562 0 01-.414.17.514.514 0 01-.411-.186 1.162 1.162 0 01-.145-.267c-.053-.119-.097-.225-.136-.315zm-2.37-1.644h1.766l-.89-2.437-.876 2.437zM1.736 2.379h20.528A1.74 1.74 0 0124 4.115v15.399c0 .954-.782 1.736-1.736 1.736H1.736A1.742 1.742 0 010 19.514V4.115a1.739 1.739 0 011.736-1.736zm20.687 3.42H1.653v13.333a.48.48 0 00.481.481h19.799a.478.478 0 00.481-.481V5.799h.009z"></path>
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
