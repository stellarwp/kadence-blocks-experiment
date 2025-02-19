/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'
import { showSettings } from '@kadence/helpers';
import { get } from 'lodash';
import { forwardRef, useRef } from '@wordpress/element';

const proSvg = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={ { paddingTop: '1px' } }>
	<rect width="20" height="16" fill="#0073e6" rx="3" ry="3"></rect>
	<text
		x="50%"
		y="57%"
		fontSize="9"
		textAnchor="middle"
		color={"#fff"}
	>
		Pro
	</text>
</svg>;

const PanelTitle = forwardRef(
	(
		{
			tools,
			isToggle = true,
			isOpened,
			icon,
			title,
			...props
		}
	) => {
		if ( ! title ) {
			return null;
		}

		return (
			<h2 className="components-panel__body-title">
				{ isToggle && (
					<Button
						__next40pxDefaultSize
						className="components-panel__body-toggle"
						aria-expanded={ isOpened }
						ref={ ref }
						{ ...props }
					>
						{ /*
						Firefox + NVDA don't announce aria-expanded because the browser
						repaints the whole element, so this wrapping span hides that.
					*/ }
						<span aria-hidden="true">
							<Icon
								className="components-panel__arrow"
								icon={ isOpened ? chevronUp : chevronDown }
							/>
						</span>
						{ title }
						{ icon && (
							<Icon
								icon={ icon }
								className="components-panel__icon"
								size={ 20 }
							/>
						) }
					</Button>
				) }
				{ ! isToggle && (
					<span className="components-panel__body-title-text">
						{ title }
						{ icon && (
							<Icon
								icon={ icon }
								className="components-panel__icon"
								size={ 20 }
							/>
						) }
					</span>
				) }
				{ tools && (
					{ tools }
				) }
			</h2>
		);
	}
);
function ToolsPanelBody( {
		children,
		title,
		initialOpen = true,
		isOpened,
		toggleOpened,
		className = '',
		icon = '',
		buttonProps = {},
		blockSlug = false,
		index = false,
		proTag = false,
		panelName,
	} ) {

	/* If the block slug is set, check the panel name against the allowed settings for the user */
	if( blockSlug !== false && !showSettings( panelName, blockSlug ) ) {
		return null;
	}

	if( proTag ) {
		buttonProps.icon = proSvg;
		buttonProps.iconPosition = 'right';
	}

	return (
		<PanelBody
			title={ title }
			initialOpen={ initialOpen }
			onToggle={ toggleOpened }
			opened={ isOpened }
			className={ className }
			icon={ icon }
			buttonProps={ buttonProps }
		>
			{ children }
		</PanelBody>
	)
}

export default compose([
	withSelect( (select, ownProps ) => {
		const initialOpen = ( undefined !== ownProps.initialOpen ? ownProps.initialOpen : true );
		const index = get(ownProps, ['index'], '');

		return {
			isOpened: select( 'kadenceblocks/data' ).isEditorPanelOpened( ownProps.panelName + index + select('core/block-editor').getSelectedBlockClientId(), initialOpen ),
		}
	}),
	withDispatch((dispatch, ownProps, { select }) => {
		const { getSelectedBlockClientId } = select('core/block-editor')
		const initialOpen = ( undefined !== ownProps.initialOpen ? ownProps.initialOpen : true );
		const index = get(ownProps, ['index'], '');

		return {
			toggleOpened: () => {
				dispatch('kadenceblocks/data').toggleEditorPanelOpened( ownProps.panelName + index + getSelectedBlockClientId(), initialOpen )
			},
		}
	})
])(ToolsPanelBody)
