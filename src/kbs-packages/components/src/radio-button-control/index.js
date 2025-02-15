/**
 * Responsive Radio Button Control
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { getDeviceValue, getDeviceAttributeSlug } from '@kadence/kbsHelpers';

import TitleBar from '../title-bar';
import RadioButtonUI from './ui';

import {
	arrowUp,
	arrowLeft,
	arrowRight,
	arrowDown,
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
} from '@wordpress/icons';
import {
	Dashicon,
	Button,
	ButtonGroup,
	Path, SVG
} from '@wordpress/components';
import { AlignmentToolbar, JustifyToolbar, BlockVerticalAlignmentToolbar } from '@wordpress/blockEditor';

import { alignBottom, alignCenter, alignTop, alignStretch, verticalSpaceBetween, verticalSpaceEvenly, verticalSpaceAround, spaceAround, spaceEvenly } from './constants';


import './editor.scss';


/**
 * Build the Radio Button control.
 */
export default function RadioButtonControl( {
	label,
	customOnChange,
	defaultValue,
	attributeName,
	options,
	placeholder,
	attributes,
	setAttributes,
	isCollapsed = false,
	type = 'textAlign',
	reverse = false,
	reset = true,
	previewDevice,
} ) {
	const desktopValue = getDeviceValue( attributeName, attributes, 'Desktop' );
	const tabletValue = getDeviceValue( attributeName, attributes, 'Tablet' );
	const mobileValue = getDeviceValue( attributeName, attributes, 'Mobile' );
	const placeholderDesktop = ( placeholder?.desktop ? placeholder.desktop : '' );
	const placeholderTablet = ( placeholder?.['tablet'] ? placeholder['tablet'] : placeholderDesktop );
	const placeholderMobile = ( placeholder?.['mobile'] ? placeholder['mobile'] : placeholderTablet );
	const inheritedDesktop = placeholderDesktop;
	const inheritedTablet = ( desktopValue ? desktopValue : placeholderTablet );
	const inheritedMobile = ( tabletValue ? tabletValue : ( desktopValue ? desktopValue : placeholderMobile ) );
	const onReset = () => {
		let resetValue = undefined;
		if ( defaultValue ) {
			resetValue = defaultValue;
		}
		onChange( resetValue, 'all' );
	}
	const onChange = ( value, device ) => {
		if ( customOnChange ) {
			customOnChange( value, device );
		} else {
			// Deep clone the attributes object to trigger an update.
			const newAttributes = JSON.parse( JSON.stringify( attributes ) );
			if ( 'all' === device ) {
				newAttributes[ attributeName ] = value;
			} else {
				const deviceSlug = getDeviceAttributeSlug( device );
				if ( ! newAttributes[ attributeName ] ) {
					newAttributes[ attributeName ] = {};
				}
				newAttributes[ attributeName ][ deviceSlug ] = value;
			}
			setAttributes( newAttributes );
		}
	};

	let controls = '';
	let UIComponent = RadioButtonUI;
	if ( type === 'justify' ) {
		UIComponent = JustifyToolbar;
	} else if ( type === 'vertical' ) {
		UIComponent = BlockVerticalAlignmentToolbar;
	} else if ( type === 'flex-direction' ) {
		controls = [
			{
				icon: arrowDown,
				title: __( 'Vertical Direction', 'kadence-blocks' ),
				align: 'column',
			},
			{
				icon: arrowRight,
				title: __( 'Horizontal Direction', 'kadence-blocks' ),
				align: 'row',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse', 'kadence-blocks' ),
				align: 'column-reverse',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse', 'kadence-blocks' ),
				align: 'row-reverse',
			},
		]
	} else if ( type === 'vertical-column' ) {
		controls = [
			{
				icon: alignTop,
				title: __( 'Top', 'kadence-blocks' ),
				align: 'top',
			},
			{
				icon: alignCenter,
				title: __( 'Middle', 'kadence-blocks' ),
				align: 'middle',
			},
			{
				icon: alignBottom,
				title: __( 'Bottom', 'kadence-blocks' ),
				align: 'bottom',
			},
			{
				icon: alignStretch,
				title: __( 'Stretch', 'kadence-blocks' ),
				align: 'stretch',
			},
		]
	} else if ( type === 'orientation-column' ) {
		controls = [
			{
				icon: arrowDown,
				title: __( 'Vertical Direction', 'kadence-blocks' ),
				align: 'vertical',
			},
			{
				icon: arrowRight,
				title: __( 'Horizontal Direction', 'kadence-blocks' ),
				align: 'horizontal',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse', 'kadence-blocks' ),
				align: 'vertical-reverse',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse', 'kadence-blocks' ),
				align: 'horizontal-reverse',
			},
		]
	} else if ( type === 'justify-align' ) {
		if ( reverse ) {
			controls = [
				{
					icon: justifyRight,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyLeft,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifyStretch,
					title: __( 'Stretch', 'kadence-blocks' ),
					align: 'stretch',
				},
			]
		} else {
			controls = [
				{
					icon: justifyLeft,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyRight,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifyStretch,
					title: __( 'Stretch', 'kadence-blocks' ),
					align: 'stretch',
				},
			]
		}
	} else if ( type === 'justify-column' ) {
		if ( reverse ) {
			controls = [
				{
					icon: justifyRight,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyLeft,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifySpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: spaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: spaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		} else {
			controls = [
				{
					icon: justifyLeft,
					title: __( 'Start', 'kadence-blocks' ),
					align: 'flex-start',
				},
				{
					icon: justifyCenter,
					title: __( 'Center', 'kadence-blocks' ),
					align: 'center',
				},
				{
					icon: justifyRight,
					title: __( 'End', 'kadence-blocks' ),
					align: 'flex-end',
				},
				{
					icon: justifySpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: spaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: spaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		}
	} else if ( type === 'justify-vertical' ) {
		if ( reverse ) {
			controls = [
				{
					icon: alignBottom,
					title: __( 'Bottom', 'kadence-blocks' ),
					align: 'top',
				},
				{
					icon: alignCenter,
					title: __( 'Middle', 'kadence-blocks' ),
					align: 'middle',
				},
				{
					icon: alignTop,
					title: __( 'Top', 'kadence-blocks' ),
					align: 'bottom',
				},
				{
					icon: verticalSpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: verticalSpaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: verticalSpaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		} else {
			controls = [
				{
					icon: alignTop,
					title: __( 'Top', 'kadence-blocks' ),
					align: 'top',
				},
				{
					icon: alignCenter,
					title: __( 'Middle', 'kadence-blocks' ),
					align: 'middle',
				},
				{
					icon: alignBottom,
					title: __( 'Bottom', 'kadence-blocks' ),
					align: 'bottom',
				},
				{
					icon: verticalSpaceBetween,
					title: __( 'Space Between', 'kadence-blocks' ),
					align: 'space-between',
				},
				{
					icon: verticalSpaceAround,
					title: __( 'Space Around', 'kadence-blocks' ),
					align: 'space-around',
				},
				{
					icon: verticalSpaceEvenly,
					title: __( 'Space Evenly', 'kadence-blocks' ),
					align: 'space-evenly',
				},
			]
		}
	}
	const output = {};
	output.Mobile = (
		<UIComponent
			value={ ( mobileValue ? mobileValue : '' ) }
			inherited={ ( inheritedMobile ? inheritedMobile : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( itemValue ) => onChange( itemValue, 'Mobile' ) }
			controls={ controls ? controls : undefined }
		/>
	);
	output.Tablet = (
		<UIComponent
			value={ ( tabletValue ? tabletValue : '' ) }
			inherited={ ( inheritedTablet ? inheritedTablet : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( itemValue ) => onChange( itemValue, 'Tablet' ) }
			controls={ controls ? controls : undefined }
		/>
	);
	output.Desktop = (
		<UIComponent
			value={ ( desktopValue ? desktopValue : '' ) }
			inherited={ ( inheritedDesktop ? inheritedDesktop : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( itemValue ) => onChange( itemValue, 'Desktop' ) }
			controls={ controls ? controls : undefined }
		/>
	);
	return (
		<div className={ `components-base-control kbs-control kbs-radio-control kbs-radio-control-${ type }` }>
			<TitleBar
				label={ label }
				reset={ reset }
				onReset={ onReset }
				hasDeviceControls={true}
			/>
			<div className="kbs-control-inner">
				{ ( output[ previewDevice ] ? output[ previewDevice ] : output.Desktop ) }
			</div>
		</div>
	);
}
