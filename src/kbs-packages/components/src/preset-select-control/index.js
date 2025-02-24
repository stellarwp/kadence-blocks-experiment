/**
 * WordPress dependencies
 */
import clsx from 'clsx';
import { Icon, Dropdown, DropdownContentWrapper, Button, HStack, FlexItem } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'
import { showSettings } from '@kadence/helpers';
import { get } from 'lodash';
import { __ } from '@wordpress/i18n';
import { useRef, useEffect } from '@wordpress/element';
import { shadow as shadowIcon, check, reset } from '@wordpress/icons';

import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

import './editor.scss';

function renderPresetToggle( presetType, presetValue, onClear ) {
	return ( { onToggle, isOpen } ) => {
		const presetButtonRef = useRef( undefined );

		const toggleProps = {
			onClick: onToggle,
			className: clsx( { 'is-open': isOpen } ),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};

		const removeButtonProps = {
			onClick: () => {
				if ( isOpen ) {
					onToggle();
				}
				onClear();
				// Return focus to parent button.
				presetButtonRef.current?.focus();
			},
			className: clsx(
				'kbs-preset-select-control__remove-button',
				{ 'is-open': isOpen }
			),
			label: __( 'Remove', 'kadence-blocks' ),
		};

		return (
			<>
				<Button __next40pxDefaultSize { ...toggleProps }>
					<HStack justify="flex-start">
						<Icon
							className="kbs-preset-select-control__toggle-icon"
							icon={ shadowIcon }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Preset', 'kadence-blocks' ) }</FlexItem>
					</HStack>
				</Button>
				{ !! presetValue && (
					<Button
						__next40pxDefaultSize
						size="small"
						icon={ reset }
						{ ...removeButtonProps }
					/>
				) }
			</>
		);
	};
}


export default function PresetSelectControl( {
		attributes,
		setAttributes,
		attributeName,
		meta,
	} ) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};
	const presetType = meta?.property ? meta?.property : '';
	const presetValue = attributes?.[ attributeName ]?.preset;
	const onClear = () => {
		setAttributes( {
			[ attributeName ]: {
				preset: undefined,
			},
		} );
	};
	if ( true ) {
		return null;
	}

	return (
		<Dropdown
			popoverProps={ popoverProps }
			className="kbs-preset-select-control__dropdown"
			renderToggle={ renderPresetToggle( presetType, presetValue, onClear ) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					
				</DropdownContentWrapper>
			) }
		/>
	);
}