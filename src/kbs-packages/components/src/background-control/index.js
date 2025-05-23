/**
 * External libraries
 */
/**
 * WordPress libraries
 */
import { useState, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';
/**
 * Internal libraries
 */
import {
	getPreviewValue,
	getInheritedDeviceValue,
	getInheritedValue,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import PresetControl from './preset-control';
import ColorControl from '../color-control';
import BackgroundImageControl from '../background-image-control';
import BackgroundLayer from './background-layer';
import LayerTitleBar from './layer-title-bar';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import './editor.scss';
import clsx from 'clsx';

function SortableBackgroundLayer({ layer, index, ...props }) {
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

	return (
		<div
			className={clsx('kbs-background-layer-wrapper', {
				'is-dragging': isDragging,
			})}
			ref={setNodeRef}
			style={style}
		>
			<div className="kbs-background-layer-handle" {...listeners} {...sortableAttributes}>
				<Icon className="kbs-layer-handle-icon" icon={dragHandle} size={24} />
			</div>
			<BackgroundLayer layer={layer} layerKey={index} {...props} />
		</div>
	);
}

export default function BackgroundControl({
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
}) {
	const [currentView, setCurrentView] = useState('normal');
	const onSelectView = (view) => {
		setCurrentView(view);
	};
	const selector = metaData?.attributes?.[attributeName]?.selector || 'background';
	const inherited = getInheritedValue(attributeName, attributes, 'none', metaData, 'layers', globalStylesIds);
	const hasLayers = metaData?.attributes?.[attributeName]?.hasLayers;
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
		console.log('onTogglePlus');
		// setAttributes({
		// 	[attributeName]: [...(attributes[attributeName] || []), {}],
		// });
	};
	// useEffect(() => {
	// 	console.log('inherited');
	// 	console.log(inherited);
	// }, [inherited]);
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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

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
	return (
		<ToolsPanelBody
			title={title || __('Background', 'kadence-blocks')}
			panelName={selector + 'background-settings'}
			componentName={'background-control'}
			setAttributes={setAttributes}
			attributeName={attributeName}
			onSelectView={onSelectView}
			currentView={currentView}
			hasViewControls={true}
		>
			<PresetControl
				label={__('Background Presets', 'kadence-blocks')}
				type={'background'}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={metaData}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				forStyleBook={forStyleBook}
			/>
			{hasLayers && (
				<>
					<LayerTitleBar
						label={__('Background', 'kadence-blocks')}
						reset={true}
						onReset={onLayerReset}
						onTogglePlus={onTogglePlus}
					/>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						modifiers={[restrictToVerticalAxis]}
					>
						<SortableContext items={itemOrder} strategy={verticalListSortingStrategy}>
							{inherited?.inheritedValue?.length > 0 ? (
								<div className="kbs-background-layers-wrapper">
									{inherited.inheritedValue.map((layer, index) => (
										<SortableBackgroundLayer
											key={index}
											layer={layer}
											index={index}
											attributes={attributes}
											type={'backgroundColor'}
											setAttributes={onSetAttributes}
											attributeName={attributeName}
											meta={metaData}
											previewDevice={previewDevice}
											globalStylesIds={globalStylesIds}
											isInherited={inherited.inheritedSource !== 'direct'}
										/>
									))}
								</div>
							) : (
								<div className="kbs-background-layers-wrapper">
									<SortableBackgroundLayer
										key={0}
										layer={{}}
										index={0}
										attributes={attributes}
										type={'backgroundColor'}
										setAttributes={onSetAttributes}
										attributeName={attributeName}
										meta={metaData}
										previewDevice={previewDevice}
										globalStylesIds={globalStylesIds}
									/>
								</div>
							)}
						</SortableContext>
					</DndContext>
				</>
			)}
			{/* <ColorControl
					label={__('Background Color', 'kadence-blocks')}
					attributes={attributes}
					type={'backgroundcolor'}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={metaData}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
				/>
			<BackgroundImageControl
				label={__('Background Image', 'kadence-blocks')}
				attributes={attributes}
				type={'image'}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={metaData}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				dynamicAttribute={attributeName + ':image'}
			/> */}
		</ToolsPanelBody>
	);
}
