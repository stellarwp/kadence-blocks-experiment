/**
 * Radio Button Control Constants
 *
 */
import {
	Dashicon,
	Button,
	ButtonGroup,
	Path, SVG
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { 
	alignLeft as textAlignLeft,
	alignRight as textAlignRight,
	alignCenter as textAlignCenter,
} from '@wordpress/icons';
/**
 * Internal block libraries
 */

export const alignBottom = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z" />
	</SVG>
);

export const alignCenter = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z" />
	</SVG>
);

export const alignTop = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M9 20h6V9H9v11zM4 4v1.5h16V4H4z" />
	</SVG>
);

export const alignStretch = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M4 4L20 4L20 5.5L4 5.5L4 4ZM10 7L14 7L14 17L10 17L10 7ZM20 18.5L4 18.5L4 20L20 20L20 18.5Z" />
	</SVG>
);

export const verticalSpaceBetween = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M7 4H17V8L7 8V4ZM7 16L17 16V20L7 20V16ZM20 11.25H4V12.75H20V11.25Z" />
	</SVG>
);
export const verticalSpaceEvenly = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="M8 8v3h32V8H8zm32 29H8v3h32v-3zM17.911 14.318v8h12v-8h-12zM17.983 25.637v8h12v-8h-12z" />
	</SVG>
);
export const verticalSpaceAround = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="M8 8v3h32V8H8zm32 29H8v3h32v-3zM17.911 12.605v8h12v-8h-12zM17.993 27.275v8h12v-8h-12z" />
	</SVG>
);
export const spaceAround = (
	<SVG
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 48 48"
    >
      <Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z"/>
      <Path d="M12.605 18.089H20.605V30.089H12.605z"/>
      <Path d="M27.275 18.007H35.275V30.007H27.275z"/>
    </SVG>
);

export const spaceEvenly = (
	<SVG
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 48 48"
    >
		<Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z"/>
		<Path d="M14.318 18.089H22.317999999999998V30.089H14.318z"/>
		<Path d="M25.637 18.017H33.637V30.017H25.637z"/>
    </SVG>
);

export const wrap = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
	>
		<Path d="M13.562 6.899H8.357v1.547h5.206c.727-.001 1.285.141 1.649.504.364.364.505.923.505 1.65 0 .728-.141 1.287-.505 1.65-.364.364-.922.506-1.649.505H5.671l1.836-1.838-1.095-1.093-3.156 3.161a.773.773 0 0 0 0 1.093l3.158 3.158 1.094-1.094-1.84-1.84h7.895c1.224.001 2.13-.345 2.743-.958.612-.612.958-1.518.958-2.744 0-1.225-.346-2.131-.958-2.743-.613-.613-1.519-.959-2.744-.958M20.035 3l-.107 17.999L21.02 21l.108-17.998z"/>
	</SVG>
);
export const nowrap = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
	>
		<Path d="M2.45 11.228v1.547h15.933l-1.836 1.838 1.095 1.093 3.156-3.161a.773.773 0 0 0 0-1.093L17.64 8.294l-1.094 1.094 1.84 1.84zM15.425 15.287h-1.093l-.034 5.712 1.093.001zm-1.053-6.585h1.092l.034-5.701L14.406 3z"/>
	</SVG>
);


export const TEXT_ALIGNMENT_OPTIONS = [
	{
		icon: textAlignLeft,
		title: __( 'Align text left', 'kadence-blocks' ),
		align: 'left',
	},
	{
		icon: textAlignCenter,
		title: __( 'Align text center', 'kadence-blocks' ),
		align: 'center',
	},
	{
		icon: textAlignRight,
		title: __( 'Align text right', 'kadence-blocks' ),
		align: 'right',
	},
];