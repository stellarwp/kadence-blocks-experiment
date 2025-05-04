/**
 * WordPress dependencies
 */
import classnames from 'classnames';
import { __, isRTL } from '@wordpress/i18n';
import { ToolbarDropdownMenu, ToolbarGroup, Button } from '@wordpress/components';
import { alignLeft, alignRight, alignCenter } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import { TEXT_ALIGNMENT_OPTIONS } from './constants';
const POPOVER_PROPS = {
	placement: 'bottom-start',
};

function RadioTextButtonUI( {
	value,
	onChange,
	inherited,
	controls = TEXT_ALIGNMENT_OPTIONS,
	label = __( 'Align text', 'kadence-blocks' ),
	description = __( 'Change text alignment', 'kadence-blocks' ),
	isCollapsed = true,
	isToolbar = false,
} ) {
	function applyOrUnset( align ) {
		return () => onChange( value === align ? undefined : align );
	}

	const activeControl = controls.find(
		( control ) => control.align === value || ( !value && control.align === inherited )
	);
	// console.log( 'activeControl', activeControl );

	function setIcon() {
		if ( activeControl ) {
			return activeControl?.icon;
		}
		return undefined;
	}

	const UIComponent = isToolbar ? ToolbarDropdownMenu : ToolbarGroup;
	const extraProps = isToolbar
		? {
			toggleProps: {
				description,
			},
			popoverProps: POPOVER_PROPS,
	  } : { isCollapsed };
	
	return (
		<UIComponent
			icon={ setIcon() }
			label={ label }
			className="kadence-radio-button-control__group"
			{ ...extraProps }
		>
			{ controls.map( ( control ) => {
				const { align } = control;
				const isActive = value === align;
				const isInherited = !value && align === inherited?.inheritedValue;
				return (
					<div key={ align } className="kadence-radio-button-control__item">
						<Button
							key={ align }
							className={ classnames(
								'kadence-radio-button-control__button',
								isInherited ? 'is-inherited' : '',
								isActive ? 'is-pressed' : '',
							) }
							onClick={ applyOrUnset( align ) }
							icon={ control?.icon || undefined }
							iconPosition="right"
						>	
							{ control.title }
						</Button>
					</div>
				);
			} ) }
		</UIComponent>
	);
}

export default RadioTextButtonUI;
