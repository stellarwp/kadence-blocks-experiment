/**
 * Responsive Radio Button Control
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { getDeviceValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';
import { handleAttributeChange } from '@kadence/kbsHelpers';

import TitleBar from '../title-bar';
import RadioButtonUI from './ui';
import RadioTextButtonUI from './ui-text';
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

import { alignBottom, alignCenter, alignTop, alignStretch, verticalSpaceBetween, verticalSpaceEvenly, verticalSpaceAround, spaceAround, spaceEvenly, wrap, nowrap } from './constants';

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
	initial,
	attributes,
	setAttributes,
	isCollapsed = false,
	type = 'textAlign',
	reset = true,
	previewDevice,
	meta,
	previewDirection = 'column',
} ) {
	const radioType = meta?.property ? meta?.property : type;
	const initialValue = meta?.initial ? meta?.initial : initial;
	const onReset = () => {
		let resetValue = undefined;
		if ( defaultValue ) {
			resetValue = defaultValue;
		}
		onChange( resetValue, 'all' );
	}
	const onChange = (value, device, type) => {
		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type
		);
	};

	let controls = '';
	let UIComponent = RadioButtonUI;
	switch ( radioType ) {
		case 'justify':
			UIComponent = JustifyToolbar;
			break;
		case 'vertical':
			UIComponent = BlockVerticalAlignmentToolbar;
			break;
		case 'flex-wrap':
			UIComponent = RadioTextButtonUI;
			controls = [
				{
					icon: wrap,
					title: __( 'Wrap', 'kadence-blocks' ),
					align: 'wrap',
				},
				{
					icon: nowrap,
					title: __( 'No Wrap', 'kadence-blocks' ),
					align: 'nowrap',
				},
			];
			break;
		case 'flex-direction':
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
			break;
		case 'justify-content':
			switch ( previewDirection ) {
				case 'column':
					controls = [
						{
							icon: alignTop,
							title: __( 'Start', 'kadence-blocks' ),
							align: 'flex-start',
						},
						{
							icon: alignCenter,
							title: __( 'Center', 'kadence-blocks' ),
							align: 'center',
						},
						{
							icon: alignBottom,
							title: __( 'End', 'kadence-blocks' ),
							align: 'flex-end',
						},
						{
							icon: alignStretch,
							title: __( 'Stretch', 'kadence-blocks' ),
							align: 'stretch',
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
					];
					break;
				case 'column-reverse':
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
					break;
				case 'row':
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
					break;
				case 'row-reverse':
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
					break;
			}
			break;
		case 'align-items':
			switch ( previewDirection ) {
				case 'column':
					controls = [
						{
							icon: justifyStretch,
							title: __( 'Stretch', 'kadence-blocks' ),
							align: 'stretch',
						},
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
					]
				break;
				case 'column-reverse':
					controls = [
						{
							icon: justifyStretch,
							title: __( 'Stretch', 'kadence-blocks' ),
							align: 'stretch',
						},
						{
							icon: justifyLeft,
							title: __( 'End', 'kadence-blocks' ),
							align: 'flex-end',
						},
						{
							icon: justifyCenter,
							title: __( 'Center', 'kadence-blocks' ),
							align: 'center',
						},
						{
							icon: justifyRight,
							title: __( 'Start', 'kadence-blocks' ),
							align: 'flex-start',
						},
					]
					break;
				case 'row':
					controls = [
						{
							icon: alignStretch,
							title: __( 'Stretch', 'kadence-blocks' ),
							align: 'stretch',
						},
						{
							icon: alignTop,
							title: __( 'Start', 'kadence-blocks' ),
							align: 'flex-start',
						},
						{
							icon: alignCenter,
							title: __( 'Center', 'kadence-blocks' ),
							align: 'center',
						},
						{
							icon: alignBottom,
							title: __( 'End', 'kadence-blocks' ),
							align: 'flex-end',
						},
					]
					break;
				case 'row-reverse':
					controls = [
						{
							icon: alignStretch,
							title: __( 'Stretch', 'kadence-blocks' ),
							align: 'stretch',
						},
						{
							icon: alignBottom,
							title: __( 'End', 'kadence-blocks' ),
							align: 'flex-end',
						},
						{
							icon: alignCenter,
							title: __( 'Center', 'kadence-blocks' ),
							align: 'center',
						},
						{
							icon: alignTop,
							title: __( 'Start', 'kadence-blocks' ),
							align: 'flex-start',
						},
					]
					break;
			}
			break;
	}

	const currentValue = getDeviceValue(attributeName, attributes, previewDevice);
	const inheritedValue = getInheritedDeviceValue(attributeName, attributes, previewDevice, initialValue);

	return (
		<div className={ `components-base-control kbs-control kbs-radio-control kbs-radio-control-${ radioType }` }>
			<TitleBar
				label={ label }
				reset={ reset }
				onReset={ onReset }
				hasDeviceControls={true}
			/>
			<div className="kbs-control-inner">
				<UIComponent
					value={ currentValue }
					inherited={ inheritedValue }
					isCollapsed={ isCollapsed }
					onChange={ ( itemValue ) => onChange( itemValue, previewDevice ) }
					controls={ controls ? controls : undefined }
				/>
			</div>
		</div>
	);
}
