import clsx from 'clsx';

import { ResizableBox } from '@wordpress/components';
import { useState, useReducer, useMemo, useEffect, useRef, useCallback } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { PADDING_RESIZE_MAP, PADDING_RESIZE_CONTROLS } from './constants';
import {
	getInheritedValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	handleMultipleAttributeChange,
} from '@kadence/kbsHelpers';
import BlockPopoverCover from '../space-control/block-popover';
import { globalIcon } from '../constants/icons';
import './editor.scss';

function getComputedCSS(element, editorDocument, property) {
	const cssValue =
		element?.ownerDocument?.defaultView
			?.getComputedStyle(element)
			?.getPropertyValue(property.replace('var(', '').split(',')[0].replace(')', '')) || '0';

	// Convert rem to px if the value contains 'rem'
	if (cssValue.includes('rem')) {
		const remValue = parseFloat(cssValue);
		const fontSize =
			parseFloat(editorDocument?.defaultView?.getComputedStyle(editorDocument.documentElement)?.fontSize) || 16;
		return remValue * fontSize;
	}
	// if the value contains 'px'
	if (cssValue.includes('px')) {
		return parseFloat(cssValue);
	}
	// if the value contains 'em'
	if (cssValue.includes('em')) {
		const emValue = parseFloat(cssValue);
		const fontSize = parseFloat(element?.ownerDocument?.defaultView?.getComputedStyle(element)?.fontSize) || 16;
		return emValue * fontSize;
	}
	// if the value contains 'vw'
	if (cssValue.includes('vw')) {
		const vwValue = parseFloat(cssValue);
		const viewportWidth = parseFloat(element?.ownerDocument?.defaultView?.getComputedStyle(element)?.width) || 100;
		return vwValue * viewportWidth;
	}
	// if the value contains 'vh'
	if (cssValue.includes('vh')) {
		const vhValue = parseFloat(cssValue);
		const viewportHeight =
			parseFloat(element?.ownerDocument?.defaultView?.getComputedStyle(element)?.height) || 100;
		return vhValue * viewportHeight;
	}
	// if the value contains '%'
	if (cssValue.includes('%')) {
		const percentageValue = parseFloat(cssValue);
		const parentElement = element?.parentElement;
		const parentWidth =
			parseFloat(parentElement?.ownerDocument?.defaultView?.getComputedStyle(parentElement)?.width) || 100;
		return percentageValue * parentWidth;
	}

	// Return the value as is if it's already in px or other units
	return parseFloat(cssValue) || 0;
}

// Move computeStyle outside component to prevent recreation
const computeStyle = (blockElement, editorDocument) => {
	const paddingResizeMap = [
		{
			size: 0,
			key: '0',
			label: '0',
		},
		{
			size: 16,
			key: 'xs',
			label: 'XS',
		},
		{
			size: 24,
			key: 'sm',
			label: 'SM',
		},
		{
			size: 32,
			key: 'md',
			label: 'MD',
		},
		{
			size: 48,
			key: 'lg',
			label: 'LG',
		},
		{
			size: 64,
			key: 'xl',
			label: 'XL',
		},
		{
			size: 80,
			key: 'xxl',
			label: 'XXL',
		},
		{
			size: 104,
			key: '3xl',
			label: '3XL',
		},
		{
			size: 128,
			key: '4xl',
			label: '4XL',
		},
		{
			size: 160,
			key: '5xl',
			label: '5XL',
		},
	];
	console.log('computeStyle inline padding resizer');
	return PADDING_RESIZE_CONTROLS.map((control) => {
		const value = getComputedCSS(blockElement, editorDocument, `var(--kbs-spacing-${control.key})`);
		return { size: value, key: control.key, label: control.name };
	});
};

function OutputResizer(props) {
	const {
		uniqueID,
		attributeName,
		attributes,
		previewDevice,
		meta,
		type,
		globalStylesIds,
		paddingResizeMap,
		blockElement,
		toggleSelection,
		clientId,
		editorDocumentRef,
		setAttributes,
		customOnChange,
	} = props;
	// Memoize inherited values to prevent recalculation
	const inheritedTop = useMemo(
		() => getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type + 'Top', globalStylesIds),
		[attributeName, attributes, previewDevice, meta, type, globalStylesIds]
	);
	const isPreset = useMemo(() => attributes?.[attributeName]?.preset, [attributes?.[attributeName]?.preset]);
	const inheritedLeft = useMemo(
		() => getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type + 'Left', globalStylesIds),
		[attributeName, attributes, previewDevice, meta, type, globalStylesIds]
	);
	const inheritedRight = useMemo(
		() => getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type + 'Right', globalStylesIds),
		[attributeName, attributes, previewDevice, meta, type, globalStylesIds]
	);

	const inheritedBottom = useMemo(
		() => getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type + 'Bottom', globalStylesIds),
		[attributeName, attributes, previewDevice, meta, type, globalStylesIds]
	);

	// Memoize helper functions
	const getSpacingSizeFromKey = useCallback(
		(key) => {
			const size = paddingResizeMap.find((control) => control.key === key)?.size || 0;
			return size;
		},
		[paddingResizeMap]
	);

	const getSpacingLabelFromKey = useCallback(
		(key) => {
			const label = paddingResizeMap.find((control) => control.key === key)?.label || '';
			return label;
		},
		[paddingResizeMap]
	);

	const getSpacingKeyFromSize = useCallback(
		(size) => {
			// Find exact match first
			const exactMatch = paddingResizeMap.find((control) => control.size === size);
			if (exactMatch) {
				return exactMatch.key;
			}

			// If no exact match, find the closest item
			let closestItem = paddingResizeMap[0];
			let smallestDifference = Math.abs(size - closestItem.size);

			for (const control of paddingResizeMap) {
				const difference = Math.abs(size - control.size);
				if (difference < smallestDifference) {
					smallestDifference = difference;
					closestItem = control;
				}
			}

			return closestItem.key;
		},
		[paddingResizeMap]
	);

	const getSpacingLabelFromSize = useCallback(
		(size) => {
			const label = paddingResizeMap.find((control) => control.size === size)?.label || '';
			return label;
		},
		[paddingResizeMap]
	);

	// Memoize computed values
	const previewTopPadding = useMemo(
		() => getSpacingSizeFromKey(inheritedTop?.inheritedValue) || 0,
		[inheritedTop?.inheritedValue, getSpacingSizeFromKey]
	);

	const previewBottomPadding = useMemo(
		() => getSpacingSizeFromKey(inheritedBottom?.inheritedValue) || 0,
		[inheritedBottom?.inheritedValue, getSpacingSizeFromKey]
	);

	const previewLeftPadding = useMemo(
		() => getSpacingSizeFromKey(inheritedLeft?.inheritedValue) || 0,
		[inheritedLeft?.inheritedValue, getSpacingSizeFromKey]
	);

	const previewRightPadding = useMemo(
		() => getSpacingSizeFromKey(inheritedRight?.inheritedValue) || 0,
		[inheritedRight?.inheritedValue, getSpacingSizeFromKey]
	);

	const previewPaddingTopLabel = useMemo(
		() => getSpacingLabelFromKey(inheritedTop?.inheritedValue) || 0,
		[inheritedTop?.inheritedValue, getSpacingLabelFromKey]
	);
	const previewPaddingBottomLabel = useMemo(
		() => getSpacingLabelFromKey(inheritedBottom?.inheritedValue) || 0,
		[inheritedBottom?.inheritedValue, getSpacingLabelFromKey]
	);
	const previewPaddingLeftLabel = useMemo(
		() => getSpacingLabelFromKey(inheritedLeft?.inheritedValue) || 0,
		[inheritedLeft?.inheritedValue, getSpacingLabelFromKey]
	);
	const previewPaddingRightLabel = useMemo(
		() => getSpacingLabelFromKey(inheritedRight?.inheritedValue) || 0,
		[inheritedRight?.inheritedValue, getSpacingLabelFromKey]
	);
	const [paddingTopLabel, setPaddingTopLabel] = useState(null);
	const [paddingBottomLabel, setPaddingBottomLabel] = useState(null);
	const [paddingLeftLabel, setPaddingLeftLabel] = useState(null);
	const [paddingRightLabel, setPaddingRightLabel] = useState(null);
	const [liveResizeAmount, setLiveResizeAmount] = useState(null);
	const [isResizingAll, setIsResizingAll] = useState(false);
	const [isResizing, setIsResizing] = useState(false);

	// Memoize event handlers
	const onSetAttributes = useCallback(
		(newAttributes) => {
			console.log('onSetAttributes', newAttributes, inheritedTop, inheritedBottom);
			if (
				newAttributes['padding']?.preset &&
				(inheritedTop?.inheritedType === 'preset' || inheritedBottom?.inheritedType === 'preset')
			) {
				const inherited = getInheritedValue('padding', attributes, 'none', meta, 'desktop', globalStylesIds);
				const inheritedTablet = getInheritedValue(
					'padding',
					attributes,
					'none',
					meta,
					'tablet',
					globalStylesIds
				);
				const inheritedMobile = getInheritedValue(
					'padding',
					attributes,
					'none',
					meta,
					'mobile',
					globalStylesIds
				);

				newAttributes['padding']['desktop'] = inherited?.inheritedValue
					? { ...inherited?.inheritedValue, ...newAttributes['padding']['desktop'] }
					: newAttributes['padding']['desktop'];
				newAttributes['padding']['tablet'] = inheritedTablet?.inheritedValue
					? { ...inheritedTablet?.inheritedValue, ...newAttributes['padding']['tablet'] }
					: newAttributes['padding']['tablet'];
				newAttributes['padding']['mobile'] = inheritedMobile?.inheritedValue;
				delete newAttributes['padding']?.preset;
			}
			setAttributes(newAttributes);
		},
		[getInheritedValue, setAttributes, attributes, meta, globalStylesIds, inheritedTop, inheritedBottom]
	);

	const onChange = useCallback(
		(value, device, type) => {
			console.log('onChange', value, device, type);
			handleMultipleAttributeChange(
				value,
				device,
				attributeName,
				attributes,
				onSetAttributes,
				customOnChange,
				type,
				meta
			);
		},
		[attributeName, attributes, onSetAttributes, customOnChange, meta]
	);

	// Memoize ResizableBox props
	const resizableBoxProps = useMemo(
		() => ({
			minHeight: '0',
			minWidth: '0',
			maxHeight: (paddingResizeMap[paddingResizeMap.length - 1]?.size || 300) + 'px',
			maxWidth: (paddingResizeMap[paddingResizeMap.length - 1]?.size || 300) + 'px',
			handleClasses: {
				top: 'kbs-inline-padding-resizer-handler',
				bottom: 'kbs-inline-padding-resizer-handler',
				left: 'kbs-inline-padding-resizer-handler',
				right: 'kbs-inline-padding-resizer-handler',
			},
			snap: {
				y: paddingResizeMap.map((control) => control.size),
				x: paddingResizeMap.map((control) => control.size),
			},
			snapGap: 16,
			grid: [1, 1],
		}),
		[paddingResizeMap]
	);

	// Memoize event handlers for ResizableBox
	const onResize = useCallback(
		(event, direction, elt, delta) => {
			// Edge is opposite of direction.
			let edge = 'top';
			switch (direction) {
				case 'bottom':
					edge = 'Top';
					break;
				case 'right':
					edge = 'Left';
					break;
				case 'left':
					edge = 'Right';
					break;
				case 'top':
					edge = 'Bottom';
					break;
			}
			//event.preventDefault();
			if (!isResizing) {
				setIsResizing(edge);
			}
			if (event?.shiftKey && !isResizingAll) {
				setIsResizingAll(true);
			}
			let newPixelSize = '';
			if (edge === 'Top' || edge === 'Bottom') {
				newPixelSize = parseInt(elt.clientHeight, 10);
			} else if (edge === 'Right' || edge === 'Left') {
				newPixelSize = parseInt(elt.clientWidth, 10);
			}
			const name = getSpacingLabelFromSize(newPixelSize);
			if (isResizingAll) {
				if (paddingBottomLabel !== name) {
					setPaddingBottomLabel(name);
					setPaddingRightLabel(name);
					setPaddingLeftLabel(name);
					setPaddingTopLabel(name);
				}
			} else {
				if (edge === 'Bottom') {
					if (paddingBottomLabel !== name) {
						setPaddingBottomLabel(name);
					}
				} else if (edge === 'Right') {
					if (paddingRightLabel !== name) {
						setPaddingRightLabel(name);
					}
				} else if (edge === 'Left') {
					if (paddingLeftLabel !== name) {
						setPaddingLeftLabel(name);
					}
				} else if (edge === 'Top') {
					if (paddingTopLabel !== name) {
						setPaddingTopLabel(name);
					}
				}
			}

			// Apply padding directly to block element during resize
			if (blockElement) {
				if (isResizingAll) {
					blockElement.style['paddingTop'] = `${newPixelSize}px`;
					blockElement.style['paddingLeft'] = `${newPixelSize}px`;
					blockElement.style['paddingRight'] = `${newPixelSize}px`;
					blockElement.style['paddingBottom'] = `${newPixelSize}px`;
				} else {
					blockElement.style[`padding${edge}`] = `${newPixelSize}px`;
				}
				setLiveResizeAmount(newPixelSize);
			}
		},
		[
			blockElement,
			getSpacingLabelFromSize,
			isResizing,
			setIsResizing,
			isResizingAll,
			paddingBottomLabel,
			paddingRightLabel,
			paddingLeftLabel,
			paddingTopLabel,
		]
	);

	const onResizeStop = useCallback(
		(event, direction, elt, delta) => {
			let newPixelSize = parseInt(elt.clientHeight, 10);
			if (isResizing === 'Right' || isResizing === 'Left') {
				newPixelSize = parseInt(elt.clientWidth, 10);
			}
			let changedPixelSize = parseInt(delta.height, 10);
			if (isResizing === 'Right' || isResizing === 'Left') {
				changedPixelSize = parseInt(delta.width, 10);
			}
			// finishedResizing(true);
			if (changedPixelSize !== 0) {
				const size = getSpacingKeyFromSize(newPixelSize);
				if (isResizingAll) {
					onChange([size, size, size, size], previewDevice, [
						type + 'Top',
						type + 'Left',
						type + 'Right',
						type + 'Bottom',
					]);
				} else {
					onChange([size], previewDevice, [type + isResizing]);
				}
				const name = getSpacingLabelFromSize(newPixelSize);
				if (isResizingAll) {
					setPaddingTopLabel(name);
					setPaddingLeftLabel(name);
					setPaddingRightLabel(name);
					setPaddingBottomLabel(name);
				} else {
					if (isResizing === 'Top') {
						if (paddingTopLabel !== name) {
							setPaddingTopLabel(name);
						}
					} else if (isResizing === 'Left') {
						if (paddingLeftLabel !== name) {
							setPaddingLeftLabel(name);
						}
					} else if (isResizing === 'Right') {
						if (paddingRightLabel !== name) {
							setPaddingRightLabel(name);
						}
					} else if (isResizing === 'Bottom') {
						if (paddingBottomLabel !== name) {
							setPaddingBottomLabel(name);
						}
					}
				}
			}

			// Clear the inline padding style when done resizing
			if (blockElement) {
				blockElement.style['paddingTop'] = '';
				blockElement.style['paddingLeft'] = '';
				blockElement.style['paddingRight'] = '';
				blockElement.style['paddingBottom'] = '';
			}
			setPaddingBottomLabel(null);
			setPaddingRightLabel(null);
			setPaddingLeftLabel(null);
			setPaddingTopLabel(null);
			setLiveResizeAmount(null);
			setIsResizing(false);
			setIsResizingAll(false);
			toggleSelection(true);
		},
		[
			getSpacingKeyFromSize,
			onChange,
			previewDevice,
			isResizing,
			type,
			toggleSelection,
			blockElement,
			isResizingAll,
			paddingTopLabel,
			paddingLeftLabel,
			paddingRightLabel,
			paddingBottomLabel,
		]
	);
	const onResizeBottom = useCallback(
		(event, direction, elt, delta) => {
			onResize(event, 'top', elt, delta);
		},
		[onResize]
	);
	const onResizeStopBottom = useCallback(
		(event, direction, elt, delta) => {
			onResizeStop(event, 'top', elt, delta);
		},
		[onResizeStop]
	);
	const onResizeStart = useCallback(() => {
		toggleSelection(false);
		// Add resizing class to editor document
		if (editorDocumentRef?.current?.documentElement) {
			editorDocumentRef.current.documentElement.classList.add('kbs-main-doc-padding-is-resizing');
		}
	}, [toggleSelection, editorDocumentRef]);

	// Add useEffect to manage resizing class
	useEffect(() => {
		if (!isResizing) {
			// Remove resizing class when not resizing
			if (editorDocumentRef?.current?.documentElement) {
				editorDocumentRef.current.documentElement.classList.remove('kbs-main-doc-padding-is-resizing');
			}
		}
	}, [isResizing, editorDocumentRef]);

	return (
		<BlockPopoverCover
			clientId={clientId}
			selectedElement={blockElement}
			className={clsx(`kbs-inline-padding-resizer-popover`, {
				'is-resizing-all': isResizingAll,
			})}
			__unstablePopoverSlot={false}
			//__unstablePopoverSlot="__unstable-block-tools-after"
		>
			<ResizableBox
				{...resizableBoxProps}
				onResize={onResize}
				onResizeStop={onResizeStop}
				onResizeStart={onResizeStart}
				className={clsx(`kbs-top-padding-resize kbs-padding-resize-box`, {
					'is-resizing': isResizing === 'Top',
				})}
				size={{
					height:
						(isResizingAll || isResizing === 'Top') && null !== liveResizeAmount
							? liveResizeAmount
							: previewTopPadding,
				}}
				enable={{
					top: false,
					right: false,
					bottom: true,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				maxWidth={undefined}
			>
				{uniqueID && (
					<div className="kbs-inline-padding-resizer">
						<span className="kbs-inline-padding-label">
							{isPreset && !paddingTopLabel && <Icon size={16} icon={globalIcon} />}
							<span id={`kbs-inline-top-${uniqueID}`}>{paddingTopLabel || previewPaddingTopLabel}</span>
						</span>
					</div>
				)}
			</ResizableBox>
			<ResizableBox
				{...resizableBoxProps}
				onResize={onResize}
				onResizeStop={onResizeStop}
				onResizeStart={onResizeStart}
				className={clsx(`kbs-left-padding-resize kbs-padding-resize-box`, {
					'is-resizing': isResizing === 'Left',
				})}
				size={{
					height: 'auto',
					width:
						(isResizingAll || isResizing === 'Left') && null !== liveResizeAmount
							? liveResizeAmount
							: previewLeftPadding,
				}}
				enable={{
					top: false,
					right: true,
					bottom: false,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				maxHeight={undefined}
			>
				{uniqueID && (
					<div className="kbs-inline-padding-resizer">
						<span className="kbs-inline-padding-label">
							{isPreset && !paddingLeftLabel && <Icon size={16} icon={globalIcon} />}
							<span id={`kbs-inline-left-${uniqueID}`}>
								{paddingLeftLabel || previewPaddingLeftLabel}
							</span>
						</span>
					</div>
				)}
			</ResizableBox>
			<ResizableBox
				{...resizableBoxProps}
				onResize={onResize}
				onResizeStop={onResizeStop}
				onResizeStart={onResizeStart}
				className={clsx(`kbs-right-padding-resize kbs-padding-resize-box`, {
					'is-resizing': isResizing === 'Right',
					'is-zero-width': previewRightPadding === 0,
				})}
				size={{
					height: 'auto',
					width:
						(isResizingAll || isResizing === 'Right') && null !== liveResizeAmount
							? liveResizeAmount
							: previewRightPadding,
				}}
				enable={{
					top: false,
					right: false,
					bottom: false,
					left: true,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
				maxHeight={undefined}
			>
				{uniqueID && (
					<div className="kbs-inline-padding-resizer">
						<span className="kbs-inline-padding-label">
							{isPreset && !paddingRightLabel && <Icon size={16} icon={globalIcon} />}
							<span id={`kbs-inline-right-${uniqueID}`}>
								{paddingRightLabel || previewPaddingRightLabel}
							</span>
						</span>
					</div>
				)}
			</ResizableBox>
			<ResizableBox
				{...resizableBoxProps}
				onResize={onResizeBottom}
				onResizeStop={onResizeStopBottom}
				onResizeStart={onResizeStart}
				className={clsx(`kbs-bottom-padding-resize kbs-padding-resize-box`, {
					'is-resizing': isResizing === 'Bottom',
				})}
				size={{
					height:
						(isResizingAll || isResizing === 'Bottom') && null !== liveResizeAmount
							? liveResizeAmount
							: previewBottomPadding,
				}}
				maxWidth={undefined}
				enable={{
					top: false,
					right: false,
					bottom: true,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
			>
				{uniqueID && (
					<div className="kbs-inline-padding-resizer">
						<span className="kbs-inline-padding-label">
							{isPreset && !paddingBottomLabel && <Icon size={16} icon={globalIcon} />}
							<span id={`kbs-inline-bottom-${uniqueID}`}>
								{paddingBottomLabel || previewPaddingBottomLabel}
							</span>
						</span>
					</div>
				)}
			</ResizableBox>
		</BlockPopoverCover>
	);
}

export default function InlinePaddingResizer({
	previewDevice = 'Desktop',
	type = 'padding',
	attributes,
	setAttributes,
	attributeName,
	meta,
	globalStylesIds,
	blockElementRef,
	customOnChange,
	toggleSelection,
	clientId,
	uniqueID,
}) {
	const blockElement = blockElementRef?.current;
	const editorDocumentRef = useRef(
		document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document || document
	);
	const { setSpacingResizeMap } = useDispatch('kadenceblocks/data');
	const spacingResizeMap = useSelect(
		(select) => select('kadenceblocks/data').getSpacingResizeMap(globalStylesIds),
		[globalStylesIds]
	);
	const hasComputedRef = useRef({});
	useEffect(() => {
		const key = JSON.stringify(globalStylesIds || []);
		if (!spacingResizeMap.length && blockElement && editorDocumentRef?.current && !hasComputedRef.current[key]) {
			const computed = computeStyle(blockElement, editorDocumentRef.current);
			setSpacingResizeMap(globalStylesIds, computed);
			hasComputedRef.current[key] = computed;
		}
	}, [spacingResizeMap, blockElement, editorDocumentRef?.current, globalStylesIds, setSpacingResizeMap]);

	return (
		<OutputResizer
			uniqueID={uniqueID}
			attributeName={attributeName}
			attributes={attributes}
			previewDevice={previewDevice}
			meta={meta}
			type={type}
			globalStylesIds={globalStylesIds}
			blockElementRef={blockElementRef}
			customOnChange={customOnChange}
			toggleSelection={toggleSelection}
			clientId={clientId}
			blockElement={blockElement}
			editorDocumentRef={editorDocumentRef}
			setAttributes={setAttributes}
			paddingResizeMap={spacingResizeMap || []}
		/>
	);
}
