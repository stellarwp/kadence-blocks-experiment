/**
 * External libraries
 */
import clsx from 'clsx';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
/**
 * WordPress libraries
 */
import { useState, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon, DropdownMenu, MenuGroup, MenuItem, Button } from '@wordpress/components';
import { arrowUp, arrowDown, trash, copy, moreVertical } from '@wordpress/icons';
/**
 * Internal libraries
 */
import { getInheritedValue, handleAttributeChange, getPresetOptions } from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ShadowLayer from './shadow-layer';
import LayerTitleBar from './layer-title-bar';
import ShadowPresetControl from './shadow-preset-control';

import './editor.scss';

function SortableShadowLayer({ layer, index, totalLayers, type, ...props }) {
	const {
		attributes: sortableAttributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: index,
		transition: {
			duration: 0,
		},
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.8 : 1,
		zIndex: isDragging ? 1 : 0,
	};
	const handleLayerMove = (oldIndex, newIndex) => {
		const newLayers = arrayMove(props.attributes[props.attributeName].layers, oldIndex, newIndex);
		const newAttributes = JSON.parse(
			JSON.stringify({
				...props.attributes[props.attributeName],
				layers: newLayers,
			})
		);
		props.setAttributes({
			[props.attributeName]: newAttributes,
		});
	};
	const handleLayerDuplicate = (index) => {
		const newLayers = [...props.attributes[props.attributeName].layers];
		newLayers.splice(index + 1, 0, newLayers[index]);
		props.setAttributes({
			[props.attributeName]: { ...props.attributes[props.attributeName], layers: newLayers },
		});
	};
	const handleLayerRemove = (index) => {
		if (props?.attributes?.[props.attributeName]?.layers) {
			const newLayers = [...props.attributes[props.attributeName].layers];
			newLayers.splice(index, 1);
			props.setAttributes({
				[props.attributeName]: { ...props.attributes[props.attributeName], layers: newLayers },
			});
		}
	};
	return (
		<div
			key={index + type}
			className={clsx('kbs-shadow-layer-wrapper', {
				'is-dragging': isDragging,
			})}
			ref={setNodeRef}
			style={style}
		>
			<div className="kbs-shadow-layer-inner">
				<ShadowLayer layer={layer} layerKey={index} {...props} />
				<div className="kbs-shadow-layer-handle-wrap" {...listeners} {...sortableAttributes}>
					<DropdownMenu
						icon={moreVertical}
						label={__('Item Controls', 'kadence-blocks')}
						className="kbs-shadow-layer-controls"
					>
						{({ onClose }) => (
							<>
								<MenuGroup>
									<MenuItem
										disabled={index === 0}
										icon={arrowUp}
										onClick={() => {
											handleLayerMove(index, index - 1);
											onClose();
										}}
									>
										{__('Move Up', 'kadence-blocks')}
									</MenuItem>
									<MenuItem
										disabled={index === totalLayers - 1}
										icon={arrowDown}
										onClick={() => {
											handleLayerMove(index, index + 1);
											onClose();
										}}
									>
										{__('Move Down', 'kadence-blocks')}
									</MenuItem>
								</MenuGroup>
								<MenuGroup>
									<MenuItem
										icon={copy}
										onClick={() => {
											handleLayerDuplicate(index);
											onClose();
										}}
									>
										{__('Duplicate', 'kadence-blocks')}
									</MenuItem>
								</MenuGroup>
								<MenuGroup>
									<MenuItem
										icon={trash}
										disabled={totalLayers === 0}
										onClick={() => {
											handleLayerRemove(index);
											onClose();
										}}
									>
										{__('Remove', 'kadence-blocks')}
									</MenuItem>
								</MenuGroup>
							</>
						)}
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}

function getPresetLabel(preset, meta, attributeName) {
	const attributeMeta = meta?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return '';
	}
	// Fetch available presets
	const presets = getPresetOptions(presetType);
	const presetData = presets.find((p) => p.value === preset);
	return presetData?.label;
}

export default function LayeredShadowControl({
	title,
	attributes,
	setAttributes,
	metaData,
	previewDevice,
	attributeName,
	previewDirection = 'column',
	globalStylesIds,
	customOnChange,
	forStyleBook = false,
	forPresetControl,
	globalStylesCss,
	type = 'boxShadow',
}) {
	const inherited = getInheritedValue(attributeName, attributes, 'none', metaData, 'layers', globalStylesIds);
	const presetLabel = getPresetLabel(attributes[attributeName]?.preset, metaData, attributeName);
	const onLayerReset = () => {
		handleAttributeChange(
			undefined,
			'none',
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			'layers',
			metaData
		);
	};
	const onTogglePlus = () => {
		AddNewEmptyLayer();
	};
	const AddNewEmptyLayer = () => {
		const newLayers = [{}, ...(inherited.inheritedValue || [])];
		const newAttributes = JSON.parse(JSON.stringify({ ...attributes[attributeName], layers: newLayers }));
		setAttributes({
			[attributeName]: newAttributes,
		});
	};
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);
	const onSetAttributes = (newAttributes) => {
		if (
			newAttributes[attributeName]?.preset &&
			inherited?.inheritedValue &&
			Array.isArray(inherited.inheritedValue)
		) {
			if (!newAttributes[attributeName]?.layers) {
				newAttributes[attributeName].layers = [];
			}
			const newLayers = inherited.inheritedValue.map((layer, index) => {
				if (newAttributes[attributeName]?.layers?.[index]) {
					return { ...layer, ...newAttributes[attributeName]?.layers?.[index] };
				}
				return layer;
			});
			newAttributes[attributeName].layers = newLayers;
			delete newAttributes[attributeName]?.preset;
		}
		setAttributes(newAttributes);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = parseInt(active.id);
			const newIndex = parseInt(over.id);
			const newLayers = arrayMove(inherited.inheritedValue, oldIndex, newIndex);
			if (attributes[attributeName]?.preset) {
				delete attributes[attributeName]?.preset;
			}
			const newAttributes = JSON.parse(
				JSON.stringify({
					...attributes[attributeName],
					layers: newLayers,
				})
			);
			setAttributes({
				[attributeName]: newAttributes,
			});
		}
	};
	const itemOrder = useMemo(() => {
		return inherited?.inheritedValue ? inherited.inheritedValue.map((_, index) => index) : [0];
	}, [inherited?.inheritedValue]);

	const classes = clsx('components-base-control kbs-control kbs-box-shadow-control', {
		'kbs-box-shadow-control-enabled': attributes[attributeName]?.layers?.length > 0,
	});
	return (
		<div className={classes}>
			{!forPresetControl && (
				<ShadowPresetControl
					label={
						type == 'boxShadow'
							? __('Box Shadow Presets', 'kadence-blocks')
							: __('Text Shadow Presets', 'kadence-blocks')
					}
					type={type}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={metaData}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
					forStyleBook={forStyleBook}
				/>
			)}
			<>
				<LayerTitleBar
					label={
						type == 'boxShadow' ? __('Box Shadow', 'kadence-blocks') : __('Text Shadow', 'kadence-blocks')
					}
					reset={true}
					onReset={onLayerReset}
					onTogglePlus={onTogglePlus}
					hasPresetIcon={attributes[attributeName]?.preset && inherited.inheritedSource === 'preset'}
					presetLabel={presetLabel}
				/>
				<DndContext
					sensors={sensors}
					modifiers={[restrictToVerticalAxis]}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={itemOrder} strategy={verticalListSortingStrategy}>
						<div className="kbs-shadow-layers-wrapper">
							{inherited?.inheritedValue?.length > 0 ? (
								inherited.inheritedValue.map((layer, index) => (
									<SortableShadowLayer
										key={index + type}
										layer={layer}
										index={index}
										attributes={attributes}
										totalLayers={inherited.inheritedValue.length}
										setAttributes={onSetAttributes}
										attributeName={attributeName}
										meta={metaData}
										previewDevice={previewDevice}
										globalStylesIds={globalStylesIds}
										globalStylesCss={globalStylesCss}
										isInherited={inherited.inheritedSource !== 'direct'}
										inherited={inherited}
										type={type}
									/>
								))
							) : (
								<SortableShadowLayer
									key={0 + type}
									layer={{}}
									index={0}
									attributes={attributes}
									totalLayers={1}
									setAttributes={onSetAttributes}
									attributeName={attributeName}
									meta={metaData}
									previewDevice={previewDevice}
									globalStylesIds={globalStylesIds}
									globalStylesCss={globalStylesCss}
									isInherited={inherited.inheritedSource !== 'direct'}
									inherited={inherited}
									type={type}
								/>
								// <Button
								// 	variant="secondary"
								// 	className="kbs-shadow-layer-add-button"
								// 	onClick={AddNewEmptyLayer}
								// >
								// 	{__('Enable Shadow', 'kadence-blocks')}
								// </Button>
							)}
						</div>
					</SortableContext>
				</DndContext>
			</>
		</div>
	);
}
