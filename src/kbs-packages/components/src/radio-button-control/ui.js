/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import { alignLeft, alignRight, alignCenter } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import { TEXT_ALIGNMENT_OPTIONS } from './constants';
const POPOVER_PROPS = {
	placement: 'bottom-start',
};

function RadioButtonUI( {
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
		( control ) => control.align === value
	);

	function setIcon() {
		if ( activeControl ) {
			return activeControl.icon;
		}
		return isRTL() ? alignRight : alignLeft;
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
			controls={ controls.map( ( control ) => {
				const { align } = control;
				const isActive = value === align;
				const isInherited = !value && align === inherited?.inheritedValue;
				return {
					...control,
					className: isInherited ? 'is-inherited' : '',
					isActive,
					role: isCollapsed ? 'menuitemradio' : undefined,
					onClick: applyOrUnset( align ),
				};
			} ) }
			{ ...extraProps }
		/>
	);
}

export default RadioButtonUI;
