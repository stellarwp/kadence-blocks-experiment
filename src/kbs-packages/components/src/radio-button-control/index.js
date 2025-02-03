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

import DeviceSwitchControl from '../device-switch-control';

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
} ) {
	const deviceType = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	const desktopValue = getDeviceValue( attributeName, attributes, 'Desktop' );
	const tabletValue = getDeviceValue( attributeName, attributes, 'Tablet' );
	const mobileValue = getDeviceValue( attributeName, attributes, 'Mobile' );
	const placeholderDesktop = ( placeholder?.['Desktop'] ? placeholder['Desktop'] : '' );
	const placeholderTablet = ( placeholder?.['Tablet'] ? placeholder['Tablet'] : placeholderDesktop );
	const placeholderMobile = ( placeholder?.['Mobile'] ? placeholder['Mobile'] : placeholderTablet );
	const inheritedDesktop = placeholderDesktop;
	const inheritedTablet = ( desktopValue ? desktopValue : placeholderTablet );
	const inheritedMobile = ( tabletValue ? tabletValue : ( desktopValue ? desktopValue : placeholderTablet ) );
	const onReset = () => {
		let resetValue = null;
		if ( defaultValue ) {
			resetValue = defaultValue;
		}
		onChange( resetValue, 'all' );
	}
	const onChange = ( value, device ) => {
		if ( customOnChange ) {
			customOnChange( value, device );
		} else {
			const newAttributes = { ...attributes };
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

	let alignmentControls = '';
	let UIComponent = AlignmentToolbar;
	if ( type === 'justify' ) {
		UIComponent = JustifyToolbar;
	} else if ( type === 'vertical' ) {
		UIComponent = BlockVerticalAlignmentToolbar;
	} else if ( 'flex-direction' ) {
		alignmentControls = [
			{
				icon: arrowRight,
				title: __( 'Horizontal Direction', 'kadence-blocks' ),
				align: 'row',
			},
			{
				icon: arrowDown,
				title: __( 'Vertical Direction', 'kadence-blocks' ),
				align: 'column',
			},
			{
				icon: arrowLeft,
				title: __( 'Horizontal Reverse', 'kadence-blocks' ),
				align: 'row-reverse',
			},
			{
				icon: arrowUp,
				title: __( 'Vertical Reverse', 'kadence-blocks' ),
				align: 'column-reverse',
			},
		]
	} else if ( type === 'vertical-column' ) {
		alignmentControls = [
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
		alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls = [
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
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	output.Tablet = (
		<UIComponent
			value={ ( tabletValue ? tabletValue : '' ) }
			inherited={ ( inheritedTablet ? inheritedTablet : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( itemValue ) => onChange( itemValue, 'Tablet' ) }
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	output.Desktop = (
		<UIComponent
			value={ ( desktopValue ? desktopValue : '' ) }
			inherited={ ( inheritedDesktop ? inheritedDesktop : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( itemValue ) => onChange( itemValue, 'Desktop' ) }
			alignmentControls={ alignmentControls ? alignmentControls : undefined }
		/>
	);
	return (
		<div className={ `components-base-control kbs-control kbs-radio-control kbs-radio-control-${ type }` }>
			<div className="kbs-control-title-bar">
				{ reset && (
					<Button
						className="kbs-clear-button"
						size='small'
						variant='secondary'
						onClick={() => {
							if (typeof reset === 'function') {
								reset();
							} else {
								onReset();
							}
						}}
					>
						{ __( 'Clear', 'kadence-blocks' ) }
					</Button>
				) }
				{ label && (
					<span className="kbs-control-title">{ label }</span>
				) }
				<DeviceSwitchControl />
			</div>
			<div className="kbs-control-inner">
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
			</div>
		</div>
	);
}
