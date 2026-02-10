/**
 * Radio Button Control Constants
 *
 */
import { Dashicon, Button, ButtonGroup, Path, SVG } from '@wordpress/components';
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
		<Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z" />
		<Path d="M12.605 18.089H20.605V30.089H12.605z" />
		<Path d="M27.275 18.007H35.275V30.007H27.275z" />
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
		<Path d="M8 40h3V8H8v32zM37 8v32h3V8h-3z" />
		<Path d="M14.318 18.089H22.317999999999998V30.089H14.318z" />
		<Path d="M25.637 18.017H33.637V30.017H25.637z" />
	</SVG>
);

export const wrap = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M13.562 6.899H8.357v1.547h5.206c.727-.001 1.285.141 1.649.504.364.364.505.923.505 1.65 0 .728-.141 1.287-.505 1.65-.364.364-.922.506-1.649.505H5.671l1.836-1.838-1.095-1.093-3.156 3.161a.773.773 0 0 0 0 1.093l3.158 3.158 1.094-1.094-1.84-1.84h7.895c1.224.001 2.13-.345 2.743-.958.612-.612.958-1.518.958-2.744 0-1.225-.346-2.131-.958-2.743-.613-.613-1.519-.959-2.744-.958M20.035 3l-.107 17.999L21.02 21l.108-17.998z" />
	</SVG>
);
export const nowrap = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M2.45 11.228v1.547h15.933l-1.836 1.838 1.095 1.093 3.156-3.161a.773.773 0 0 0 0-1.093L17.64 8.294l-1.094 1.094 1.84 1.84zM15.425 15.287h-1.093l-.034 5.712 1.093.001zm-1.053-6.585h1.092l.034-5.701L14.406 3z" />
	</SVG>
);
export const flexAuto = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
		<Path d="m17.71 11.29-2.5-2.5a1 1 0 0 0-1.42 1.42l.8.79H9.41l.8-.79a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l2.5 2.5a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.8-.79h5.18l-.8.79a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l2.5-2.5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76 1 1 0 0 0-.21-.33M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1m18 0a1 1 0 0 0-1 1v10a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1" />
	</SVG>
);

export const flexShrink = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
		<Path d="m10.71 11.29-2.5-2.5a1 1 0 1 0-1.42 1.42l.8.79H3a1 1 0 0 0 0 2h4.59l-.8.79a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l2.5-2.5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76 1 1 0 0 0-.21-.33M21 11h-4.59l.8-.79a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l2.5 2.5a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.8-.79H21a1 1 0 0 0 0-2" />
	</SVG>
);
export const flexGrow = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 24 24">
		<Path d="M21.92 11.62a1 1 0 0 0-.21-.33l-2.5-2.5a1 1 0 0 0-1.42 1.42l.8.79H14a1 1 0 0 0 0 2h4.59l-.8.79a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l2.5-2.5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76M10 11H5.41l.8-.79a1 1 0 0 0-1.42-1.42l-2.5 2.5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l2.5 2.5a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.8-.79H10a1 1 0 0 0 0-2" />
	</SVG>
);
export const flexForce = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 800 800">
		<Path d="M100 200c-18.286 0-33.333 15.047-33.333 33.333v333.334C66.667 584.953 81.714 600 100 600s33.333-15.047 33.333-33.333V233.333C133.333 215.047 118.286 200 100 200m600 0c-18.286 0-33.333 15.047-33.333 33.333v333.334C666.667 584.953 681.714 600 700 600s33.333-15.047 33.333-33.333V233.333C733.333 215.047 718.286 200 700 200M523.667 523.667a33.35 33.35 0 0 0 9.86-23.667c0-8.884-3.552-17.41-9.86-23.667L447 400l76.667-76.333A33.49 33.49 0 0 0 533.47 300c0-18.361-15.109-33.47-33.47-33.47a33.49 33.49 0 0 0-23.667 9.803L400 353l-76.333-76.667A33.49 33.49 0 0 0 300 266.53c-18.361 0-33.47 15.109-33.47 33.47a33.49 33.49 0 0 0 9.803 23.667L353 400l-76.667 76.333a33.35 33.35 0 0 0-9.86 23.667c0 8.884 3.552 17.41 9.86 23.667a33.35 33.35 0 0 0 23.667 9.86c8.884 0 17.41-3.552 23.667-9.86L400 447l76.333 76.667a33.35 33.35 0 0 0 23.667 9.86c8.884 0 17.41-3.552 23.667-9.86" />
	</SVG>
);
export const repeat = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		fillRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="2"
		clipRule="evenodd"
		viewBox="0 0 24 24"
	>
		<Path
			fillRule="nonzero"
			d="M4.986 17c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m7 0c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m7.029 0c-1.098 0-2 .903-2 2s.902 2 2 2 2-.903 2-2-.903-2-2-2m-14.03-7c-1.096 0-2 .903-2 2s.904 2 2 2c1.098 0 2-.903 2-2s-.902-2-2-2m7 0c-1.096 0-2 .903-2 2s.904 2 2 2c1.098 0 2-.903 2-2s-.902-2-2-2m7.03 0c-1.098 0-2 .903-2 2s.902 2 2 2 2-.903 2-2-.903-2-2-2m-7.03-3c1.098 0 2-.903 2-2s-.902-2-2-2c-1.096 0-2 .903-2 2s.904 2 2 2m-7-4c-1.096 0-2 .903-2 2s.904 2 2 2c1.098 0 2-.903 2-2s-.902-2-2-2m14.03 4c1.097 0 2-.903 2-2s-.903-2-2-2c-1.098 0-2 .903-2 2s.902 2 2 2"
		/>
	</SVG>
);
export const repeatX = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		fillRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="2"
		clipRule="evenodd"
		viewBox="0 0 24 24"
	>
		<Path
			fillRule="nonzero"
			d="M4.986 10c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m7 0c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m7.029 0c-1.098 0-2 .903-2 2s.902 2 2 2 2-.903 2-2-.903-2-2-2"
		/>
	</SVG>
);
export const repeatY = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		fillRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="2"
		clipRule="evenodd"
		viewBox="0 0 24 24"
	>
		<Path
			fillRule="nonzero"
			d="M11.986 17c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m0-7c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2m0-3c1.097 0 2-.903 2-2s-.903-2-2-2-2 .903-2 2 .903 2 2 2"
		/>
	</SVG>
);
export const noRepeat = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		fillRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="2"
		clipRule="evenodd"
		viewBox="0 0 24 24"
	>
		<Path fillRule="nonzero" d="M11.986 10c-1.097 0-2 .903-2 2s.903 2 2 2 2-.903 2-2-.903-2-2-2" />
	</SVG>
);

export const horizontalTextOrientationIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" id="b" viewBox="0 0 131 164.33">
		<g id="c" strokeWidth="0">
			<Path d="m131 145.76-28.18-18.57v10.82H0v15.5h102.82v10.82zM84.03 97.69H42.98L37.28 117H.37L44.34 0h39.44l43.96 117H89.88zm-7.5-25.3L63.62 30.33 50.84 72.39z"></Path>
		</g>
	</SVG>
);
export const stackedTextOrientationIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" id="b" viewBox="0 0 164 164.33">
		<g id="c" strokeWidth="0">
			<Path d="M126.51 99.72H85.46l-5.7 19.31H42.85L86.83 2.04h39.44l43.96 117h-37.86l-5.85-19.31Zm-7.5-25.3L106.1 32.36 93.32 74.42zM18.57 131l18.58-28.18H26.32V0h-15.5v102.82H0z"></Path>
		</g>
	</SVG>
);
export const sidewaysDownTextOrientationIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" id="b" viewBox="0 0 164 164.33">
		<g id="c" strokeWidth="0">
			<Path d="m18.57 131 18.58-28.18H26.32V0h-15.5v102.82H0zM66.65 84.03V42.98l-19.31-5.7V.37l117 43.97v39.44l-117 43.96V89.88zm25.3-7.5 42.06-12.91-42.06-12.78z"></Path>
		</g>
	</SVG>
);
export const sidewaysUpTextOrientationIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" id="b" viewBox="0 0 164 164.33">
		<g id="c" strokeWidth="0">
			<Path d="m145.76 0-18.57 28.18h10.82V131h15.5V28.18h10.82zM97.69 46.97v41.05l19.31 5.7v36.91L0 86.66V47.22L117 3.26v37.86zm-25.3 7.5L30.33 67.38l42.06 12.78z"></Path>
		</g>
	</SVG>
);
export const TEXT_ALIGNMENT_OPTIONS = [
	{
		icon: textAlignLeft,
		title: __('Align text left', 'kadence-blocks'),
		align: 'left',
	},
	{
		icon: textAlignCenter,
		title: __('Align text center', 'kadence-blocks'),
		align: 'center',
	},
	{
		icon: textAlignRight,
		title: __('Align text right', 'kadence-blocks'),
		align: 'right',
	},
];
