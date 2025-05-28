/**
 * External libraries
 */
import { isEqual } from 'lodash';
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
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import PresetControl from './preset-control';
import ColorControl from '../color-control';
import BackgroundImageControl from '../background-image-control';
import BackgroundLayer from './background-layer';
import LayerTitleBar from './layer-title-bar';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useSortable } from '@dnd-kit/react/sortable';
import './editor.scss';
import clsx from 'clsx';

function SortableBackgroundLayer({ layer, index, ...props }) {
	const {
		attributes: sortableAttributes,
		listeners,
		ref,
		handleRef,
		isDragging,
	} = useSortable({
		id: JSON.stringify(layer),
		index,
	});
	const style = {
		opacity: isDragging ? 0.8 : 1,
		zIndex: isDragging ? 1 : 0,
	};

	return (
		<div
			className={clsx('kbs-background-layer-wrapper', {
				'is-dragging': isDragging,
			})}
			ref={ref}
			style={style}
		>
			<div className="kbs-background-layer-handle" ref={handleRef} {...listeners} {...sortableAttributes}>
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

	const handleDragEnd = (event) => {
		const initialLayers = JSON.parse(JSON.stringify(inherited.inheritedValue));
		console.log('initialLayers', initialLayers);
		const newLayers = move(initialLayers, event);
		console.log('newLayers', newLayers);
		if (isEqual(initialLayers, newLayers)) {
			return;
		}
		console.log('newLayers', newLayers);

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
	};
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
					<DragDropProvider onDragEnd={handleDragEnd}>
						<div className="kbs-background-layers-wrapper">
							{inherited?.inheritedValue?.length > 0 ? (
								inherited.inheritedValue.map((layer, index) => (
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
								))
							) : (
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
							)}
						</div>
					</DragDropProvider>
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
