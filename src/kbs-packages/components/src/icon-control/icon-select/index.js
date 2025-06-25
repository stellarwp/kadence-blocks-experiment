import {
	Popover,
	TextControl,
	PanelBody,
	SelectControl,
	Icon
} from '@wordpress/components';
import {__} from '@wordpress/i18n'
import { debounce, get } from 'lodash';
import {applyFilters} from '@wordpress/hooks'
import { useState, useMemo, useEffect, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { plus } from '@wordpress/icons';
import './editor.scss';
import {
	chevronDown,
	closeSmall,
} from '@wordpress/icons';

import { compareVersions } from '@kadence/helpers';
import {default as GenIcon} from '../gen-icon';
import SvgAddModal from './svg-add-modal';
import SvgDeleteModal from './svg-delete-modal';

export default function KadenceIconPicker({
		value,
		onChange,
		label,
		placeholder = __( 'Select Icon', 'kadence-blocks' ),
		showSearch = true,
		className,
		allowClear = false
	}) {

	const [ popoverAnchor, setPopoverAnchor ] = useState();
	const [ isVisible, setIsVisible ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	const [ filter, setFilter ] = useState( 'all' );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isDeleteOpen, setIsDeleteOpen ] = useState( false );
	const [ deleteId, setDeleteId ] = useState( null );

	// Get icons from Redux store
	const { storeIcons, areIconsLoaded } = useSelect((select) => {
		return {
			storeIcons: select('kadenceblocks/data').getIcons(),
			areIconsLoaded: select('kadenceblocks/data').areIconsLoaded(),
		};
	}, []);

	const { fetchIcons } = useDispatch('kadenceblocks/data');

	// Fetch icons if not loaded
	useEffect(() => {
		if (!areIconsLoaded) {
			fetchIcons();
		}
	}, [areIconsLoaded, fetchIcons]);

	// Make sure user has pro and the appropriate version that has the rest endpoint to accept SVGs
	const hasPro = typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params && kadence_blocks_params.pro && kadence_blocks_params.pro === 'true' ? true : false;
	const proVersion = window?.kbpData ? get( window.kbpData, ['pVersion'], '1.0.0' ) : '1.0.0';
	const isSupportedProVersion = compareVersions(proVersion, '2.4.0') >= 0;
	const toggleVisible = () => {
		setIsVisible( !isVisible );
	}
	const debounceToggle = debounce( toggleVisible, 100 );

	const deleteCallback = () => {
		setDeleteId( null );
	};

	const addCallback = ( postId ) => {
		onChange('kb-custom-' + postId.toString() );

        // Refetch icons
        fetchIcons();
	};

	const translatedCustomSvgString = __( 'My Icons', 'kadence-blocks' );

	const iconNames = useMemo( () => {

		// Generate icon names from store
		let iconNamesData = {};
		if (areIconsLoaded && storeIcons) {
			const lineIcons = Object.keys(storeIcons.lineIcons || {});
			const solidIcons = Object.keys(storeIcons.solidIcons || {});
			const customIcons = Object.keys(storeIcons.custom || {});

			if (lineIcons.length > 0) {
				iconNamesData['Line Icons'] = lineIcons;
			}
			if (solidIcons.length > 0) {
				iconNamesData['Solid Icons'] = solidIcons;
			}
			if (customIcons.length > 0) {
				iconNamesData['Custom Icons'] = customIcons;
			}

            const svgs = applyFilters( 'kadence.icon_options_names', iconNamesData );

            if ( customIcons.length > 0 ) {
                return { [translatedCustomSvgString]: customIcons, ...svgs };
            } else if( hasPro && isSupportedProVersion ) {
                return { [translatedCustomSvgString]: [ 'placeholder' ], ...svgs };
            }
            
            return svgs;
		}

		return iconNamesData;
	}, [ areIconsLoaded, storeIcons, hasPro, isSupportedProVersion, translatedCustomSvgString ] );

	const iconOptions = useMemo( () => {
		const combinedIcons = storeIcons?.combinedIcons || {};

		return applyFilters( 'kadence.icon_options', combinedIcons );
	}, [ storeIcons, areIconsLoaded ] )

	const iconFilterOptions = useMemo( () => {
		let options = Object.keys( iconNames ).map( ( label, index ) => {
			return { value: index, label: label }
		} )

		return [ { value: 'all', label: __( 'Show All', 'kadence-blocks' ) }, ...options ]
	}, [ iconNames ] )

	const iconRenderFunc = useCallback( ( iconSlug ) => {
		return <GenIcon className={`kt-svg-icon-single-${iconSlug}`} name={iconSlug} icon={iconOptions[ iconSlug ]}/>;
	}, [ iconOptions ] );

	const iconRenderFunction = iconRenderFunc;

	const results = useMemo( () => {
		const searchLower = search.toLowerCase();

		return Object.keys(iconNames).reduce((acc, label, groupIndex) => {
			if (filter === 'all' || groupIndex === parseInt(filter)) {
				const filteredIcons = iconNames[label].filter(icon => {
					const iconLower = icon.toLowerCase();
					// The original logic `|| (groupIndex === 0)` was likely intended to always show the 'My Icons'
					// group, but it prevented searching within that group. This implementation fixes that.
					if (label === translatedCustomSvgString) {
						return search === '' || iconLower.includes(searchLower);
					}
					return search === '' || iconLower.includes(searchLower);
				});

				if (filteredIcons.length > 0) {
					if (!acc[groupIndex]) {
						acc[groupIndex] = {
							label: label,
							icons: {},
						};
					}
					filteredIcons.forEach(icon => {
						acc[groupIndex].icons[icon] = iconOptions[icon];
					});
				}
			}
			return acc;
		}, {});
	}, [search, filter, iconNames, iconOptions, translatedCustomSvgString]);

	return (
		<div className={'kadence-icon-picker'}>
			<SvgAddModal isOpen={isOpen} setIsOpen={setIsOpen} callback={addCallback} />
			<SvgDeleteModal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} id={deleteId} callback={deleteCallback}/>
			<div className={`kadence-icon-picker-selection ${className ? ' ' + className : ''}`}>
				{label && (
					<div className="kadence-icon-picker__title">
						<label className="components-base-control__label">{label}</label>
					</div>
				)}
				<div className='kadence-icon-picker-toggle-wrap'>
					<button
						onClick={() => debounceToggle()}
						ref={setPopoverAnchor}
						className={'kadence-icon-picker-link kadence-icon-picker-selection-toggle'}
					>
						<span className={`kadence-icon-picker-selection-value${!value ? ' kadence-icon-picker-placeholder' : ''}`}>{value ? iconRenderFunction( value ) : placeholder}</span>
						<span className='kadence-icon-picker-selection-arrow'><Icon icon={chevronDown}></Icon></span>
					</button>
					{value && allowClear && (
						<button className='kadence-icon-picker-clear' onClick={() => {
							onChange( '' );
							setIsVisible( false );
						}}><Icon icon={closeSmall}></Icon></button>
					)}
				</div>
			</div>

			{isVisible &&
				<Popover
					headerTitle={__( 'Select Icon', 'kadence-blocks' )}
					noArrow={false}
					// expandOnMobile={true}
					onClose={debounceToggle}
					placement="bottom-end"
					anchor={popoverAnchor}
					className={`kadence-icon-picker-pop-selection kadence-icon-picker-pop-theme-default`}
				>
					<div className="kadence-icon-picker-container">
						{showSearch && (
							<div className={'kadence-icon-picker-search'}>
								<TextControl
									label={__( 'Search Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={search}
									placeholder={__( 'Search Icons', 'kadence-blocks' )}
									onChange={( value ) => setSearch( value )}
								/>
								<SelectControl
									label={__( 'Filter Icons', 'kadence-blocks' )}
									hideLabelFromVision={true}
									value={filter}
									options={iconFilterOptions}
									onChange={setFilter}
								/>
							</div>
						)}
						<div className={`kadence-icon-picker-content${showSearch ? ' has-search' : ''}`}>
                            { !areIconsLoaded && (
                                <Spinner />
                            )}
							{areIconsLoaded && storeIcons && (
								<>
									{Object.keys( results ).length === 0 &&
										<div style={{ padding: '15px' }}>
											<p>{__( 'No icons found', 'kadence-blocks' )}</p>
										</div>
									}
									{Object.keys( results ).map( ( groupKey ) => {
										return (
											<PanelBody
												title={results[ groupKey ].label}
												key={groupKey}
											>
												<div className='kadence-icon-grid-wrap'>
													{results[ groupKey ].label === translatedCustomSvgString && search === '' && isSupportedProVersion && hasPro && (
														<button
															className={'kadence-icon-picker-link add-custom-svg'}
															onClick={() => {
																setIsOpen( true );
																debounceToggle();
															}}
														>
															<Icon icon={plus}/>
														</button>
													)}
													{Object.keys( results[ groupKey ].icons ).map( ( iconKey ) => {
														if ( results[ groupKey ].label === translatedCustomSvgString ) {
															if( iconKey === 'placeholder'){
																return;
															}

															return (
																<div className={'kb-custom-svg'}>
																	{ hasPro && isSupportedProVersion && ( <div className={'custom-svg-delete'}
																		 onClick={() => {
																			setDeleteId( iconKey );
																			setIsDeleteOpen( true );
																		 }}>
																		<Icon icon={closeSmall} size={20}/>
																	</div> ) }
																	<button
																		className={'kadence-icon-picker-link'}
																		key={results[ groupKey ].label + iconKey}
																		onClick={() => {
																			onChange( 'kb-custom-' + iconKey );
																			debounceToggle();
																		}}
																	>
																		{iconRenderFunction( 'kb-custom-' + iconKey )}
																	</button>
																</div>
															);
														} else {
															return (
																<button
																	className={'kadence-icon-picker-link'}
																	key={results[ groupKey ].label + iconKey}
																	onClick={() => {
																		onChange( iconKey );
																		debounceToggle();
																	}}
																>
																	{iconRenderFunction( iconKey )}
																</button>
															);
														}
													} )
													}
												</div>

											</PanelBody>
										)
									} )}
								</>
							)}
						</div>
					</div>
				</Popover>
			}
		</div>
	)
}
