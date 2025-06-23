import isEqual from 'lodash/isEqual';
/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect, useReducer } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockPopoverCover from './block-popover';

function SpacingVisualizer({
	clientId,
	blockElementRef,
	value,
	computeStyle,
	forceShow,
	type = 'padding',
	initialStyle,
}) {
	const blockElement = blockElementRef?.current;
	const [style, updateStyle] = useReducer(() => computeStyle(blockElement), initialStyle);

	// It's not sufficient to read the block’s computed style when `value` changes because
	// the effect would run before the block’s style has updated. Thus observing mutations
	// to the block’s attributes is used to trigger updates to the visualizer’s styles.
	useEffect(() => {
		if (!blockElement) {
			return;
		}

		const observer = new window.MutationObserver(updateStyle);
		observer.observe(blockElement, {
			attributes: true,
			attributeFilter: ['style', 'class'],
		});
		return () => {
			observer.disconnect();
		};
	}, [blockElement]);

	const previousValueRef = useRef(value);
	const previousForceShowRef = useRef(forceShow);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (isEqual(value, previousValueRef.current)) {
			return;
		}
		updateStyle();
		previousValueRef.current = value;
		previousForceShowRef.current = forceShow;
	}, [value, forceShow]);

	useEffect(() => {
		if (isEqual(value, previousValueRef.current) || forceShow) {
			return;
		}

		setIsActive(true);
		previousValueRef.current = value;

		const timeout = setTimeout(() => {
			setIsActive(false);
		}, 400);

		return () => {
			setIsActive(false);
			clearTimeout(timeout);
		};
	}, [value, forceShow]);

	if (!isActive && !forceShow) {
		return null;
	}
	return (
		<BlockPopoverCover clientId={clientId} selectedElement={blockElement} __unstablePopoverSlot="block-toolbar">
			<div
				className={`block-editor__spacing-visualizer kbs-spacing-visualizer block-editor__spacing-visualizer-type-${type}`}
				style={style}
			/>
		</BlockPopoverCover>
	);
}

function getComputedCSS(element, property) {
	return element.ownerDocument.defaultView.getComputedStyle(element).getPropertyValue(property);
}

export function MarginVisualizer({ clientId, blockElementRef, value, forceShow }) {
	return (
		<SpacingVisualizer
			clientId={clientId}
			blockElementRef={blockElementRef}
			value={value}
			computeStyle={(blockElement) => {
				const top = getComputedCSS(blockElement, 'margin-top');
				const right = getComputedCSS(blockElement, 'margin-right');
				const bottom = getComputedCSS(blockElement, 'margin-bottom');
				const left = getComputedCSS(blockElement, 'margin-left');
				return {
					borderTopWidth: top,
					borderRightWidth: right,
					borderBottomWidth: bottom,
					borderLeftWidth: left,
					top: top ? `-${top}` : 0,
					right: right ? `-${right}` : 0,
					bottom: bottom ? `-${bottom}` : 0,
					left: left ? `-${left}` : 0,
				};
			}}
			forceShow={forceShow}
			type="margin"
		/>
	);
}

export function PaddingVisualizer({ clientId, blockElementRef, value, forceShow }) {
	return (
		<SpacingVisualizer
			clientId={clientId}
			blockElementRef={blockElementRef}
			value={value}
			computeStyle={(blockElement) => {
				return {
					borderTopWidth: getComputedCSS(blockElement, 'padding-top'),
					borderRightWidth: getComputedCSS(blockElement, 'padding-right'),
					borderBottomWidth: getComputedCSS(blockElement, 'padding-bottom'),
					borderLeftWidth: getComputedCSS(blockElement, 'padding-left'),
				};
			}}
			initialStyle={{
				borderTopWidth: getComputedCSS(blockElementRef.current, 'padding-top'),
				borderRightWidth: getComputedCSS(blockElementRef.current, 'padding-right'),
				borderBottomWidth: getComputedCSS(blockElementRef.current, 'padding-bottom'),
				borderLeftWidth: getComputedCSS(blockElementRef.current, 'padding-left'),
			}}
			forceShow={forceShow}
		/>
	);
}
