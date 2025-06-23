import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { useMergeRefs } from '@wordpress/compose';
import { Popover } from '@wordpress/components';
import { useEffect, useState, forwardRef, useMemo, useReducer, useLayoutEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import usePopoverScroll from './use-popover-scroll';
import { rectUnion, getElementBounds } from './utils';
const MAX_POPOVER_RECOMPUTE_COUNTER = Number.MAX_SAFE_INTEGER;

function BlockPopover(
	{
		clientId,
		bottomClientId,
		selectedElement,
		children,
		__unstablePopoverSlot,
		__unstableContentRef,
		shift = true,
		...props
	},
	ref
) {
	const lastSelectedElement = selectedElement;
	const mergedRefs = useMergeRefs([ref, usePopoverScroll(__unstableContentRef)]);

	const [popoverDimensionsRecomputeCounter, forceRecomputePopoverDimensions] = useReducer(
		// Module is there to make sure that the counter doesn't overflow.
		(s) => (s + 1) % MAX_POPOVER_RECOMPUTE_COUNTER,
		0
	);

	// When blocks are moved up/down, they are animated to their new position by
	// updating the `transform` property manually (i.e. without using CSS
	// transitions or animations). The animation, which can also scroll the block
	// editor, can sometimes cause the position of the Popover to get out of sync.
	// A MutationObserver is therefore used to make sure that changes to the
	// selectedElement's attribute (i.e. `transform`) can be tracked and used to
	// trigger the Popover to rerender.
	useLayoutEffect(() => {
		if (!selectedElement) {
			return;
		}

		const observer = new window.MutationObserver(forceRecomputePopoverDimensions);
		observer.observe(selectedElement, { attributes: true });

		return () => {
			observer.disconnect();
		};
	}, [selectedElement]);

	const popoverAnchor = useMemo(() => {
		if (
			// popoverDimensionsRecomputeCounter is by definition always equal or greater
			// than 0. This check is only there to satisfy the correctness of the
			// exhaustive-deps rule for the `useMemo` hook.
			popoverDimensionsRecomputeCounter < 0 ||
			!selectedElement ||
			(bottomClientId && !lastSelectedElement)
		) {
			return undefined;
		}

		return {
			getBoundingClientRect() {
				return lastSelectedElement
					? rectUnion(getElementBounds(selectedElement), getElementBounds(lastSelectedElement))
					: getElementBounds(selectedElement);
			},
			contextElement: selectedElement,
		};
	}, [popoverDimensionsRecomputeCounter, selectedElement, bottomClientId, lastSelectedElement]);

	if (!selectedElement || (bottomClientId && !lastSelectedElement)) {
		return null;
	}

	return (
		<Popover
			ref={mergedRefs}
			animate={false}
			focusOnMount={false}
			anchor={popoverAnchor}
			// Render in the old slot if needed for backward compatibility,
			// otherwise render in place (not in the default popover slot).
			__unstableSlotName={__unstablePopoverSlot}
			inline={!__unstablePopoverSlot}
			placement="top-start"
			resize={false}
			flip={false}
			shift={shift}
			{...props}
			className={clsx('block-editor-block-popover', props.className)}
			variant="unstyled"
		>
			{children}
		</Popover>
	);
}

export const PrivateBlockPopover = forwardRef(BlockPopover);

function BlockPopoverCover(
	{ clientId, bottomClientId, selectedElement, children, shift = false, additionalStyles, ...props },
	ref
) {
	bottomClientId ??= clientId;
	return (
		<PrivateBlockPopover
			ref={ref}
			clientId={clientId}
			selectedElement={selectedElement}
			bottomClientId={bottomClientId}
			shift={shift}
			{...props}
		>
			{selectedElement && clientId === bottomClientId ? (
				<CoverContainer selectedElement={selectedElement} additionalStyles={additionalStyles}>
					{children}
				</CoverContainer>
			) : (
				children
			)}
		</PrivateBlockPopover>
	);
}

function CoverContainer({ selectedElement, additionalStyles = {}, children }) {
	const [width, setWidth] = useState(selectedElement.offsetWidth);
	const [height, setHeight] = useState(selectedElement.offsetHeight);
	useEffect(() => {
		const observer = new window.ResizeObserver(() => {
			setWidth(selectedElement.offsetWidth);
			setHeight(selectedElement.offsetHeight);
		});
		observer.observe(selectedElement, { box: 'border-box' });
		return () => observer.disconnect();
	}, [selectedElement]);

	const style = useMemo(() => {
		return {
			position: 'absolute',
			width,
			height,
			...additionalStyles,
		};
	}, [width, height, additionalStyles]);

	return <div style={style}>{children}</div>;
}

export default forwardRef(BlockPopoverCover);
