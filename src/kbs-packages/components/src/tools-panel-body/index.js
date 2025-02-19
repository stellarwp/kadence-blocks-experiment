/**
 * WordPress dependencies
 */
import { PanelRow, Panel, Icon, DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'
import { showSettings } from '@kadence/helpers';
import { get } from 'lodash';
import { moreVertical, check } from '@wordpress/icons';
import { speak } from '@wordpress/a11y';
import { __ } from '@wordpress/i18n';

import './editor.scss';
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

export default function ToolsPanelBody( {
		children,
		title,
		className = '',
		extraProps = {},
		blockSlug = false,
		proTag = false,
		panelName,
		resetAll,
		canResetAll = true,
		view = 'normal',
		selectView,
	} ) {

	/* If the block slug is set, check the panel name against the allowed settings for the user */
	if( blockSlug !== false && !showSettings( panelName, blockSlug ) ) {
		return null;
	}

	if ( proTag ) {
		extraProps.icon = proSvg;
	}
	const tools = [
		{
			label: __( 'Preset Only', 'kadence-blocks' ),
			value: 'preset',
		},
		{
			label: __( 'Normal', 'kadence-blocks' ),
			value: 'normal',
		},
		{
			label: __( 'Advanced', 'kadence-blocks' ),
			value: 'advanced',
		},
	]
	const header = (
		<>
			<span className={ `components-panel__body-title-text ${ extraProps?.icon ? 'kbs-tools-panel-body__title-text-with-icon' : '' }` }>
				{ title }
				{ extraProps?.icon && (
					<Icon
						icon={ extraProps?.icon }
						className="components-panel__body-title-text__icon"
						size={ 20 }
					/>
				) }
			</span>
			<span className='kbs-tools-panel-body__tools'>
				<DropdownMenu
					icon={ moreVertical }
					label="Select a direction"
				>
					{ () => (
						<>
							<MenuGroup label={ __( 'Component View', 'kadence-blocks' ) }>
								{ tools.map( ( control, index ) => {
									const isSelected = control?.value === view;
									const label = control?.label;
									return (
										<MenuItem
											key={ index }
											icon={ isSelected ? check : null }
											isSelected={ isSelected }
											disabled={ isSelected }
											label={ label }
											onClick={ () => {
												if ( !isSelected ) {
													speak(
														sprintf(
															// translators: %s: The name of the control being reset e.g. "Padding".
															__( '%s is now the active view' ),
															label
														),
														'assertive'
													);
													selectView( control?.value );
												}
											} }
											role="menuitemcheckbox"
										>
											{ label }
										</MenuItem>
									);
								} ) }
							</MenuGroup>
							<MenuGroup label={ __( 'Reset Component Settings', 'kadence-blocks' ) }>
								<MenuItem
									aria-disabled={ ! canResetAll }
									variant="tertiary"
									onClick={ () => {
										if ( canResetAll ) {
											resetAll();
											speak(
												__( 'All component options reset' ),
												'assertive'
											);
										}
									} }
								>
									{ __( 'Reset Settings' ) }
								</MenuItem>
							</MenuGroup>
						</>
					) }
				</DropdownMenu>
			</span>
		</>
	);
	return (
		<Panel
			className={ 'kbs-tools-panel-body' + ( className ? ' ' + className : '' ) }
		>
			<div className="kbs-tools-panel-body__content components-panel__body is-opened">
				<h2 className="kbs-tools-panel-body__title">
					{ header }
				</h2>
				{ children }
			</div>
		</Panel>
	)
}