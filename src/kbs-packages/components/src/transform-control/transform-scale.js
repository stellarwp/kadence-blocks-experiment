/**
 * Transform Scale Component
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useMemo, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { link, linkOff, undo } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import RadioToggleGroupPopoverInputUI from '../radio-button-control/ui-toggle-group-popover-input';

const BOX_SIZE = 50; // Base size of the scale box

function TransformScale(props) {
	const { 
		onChange, 
		resolvedValues
	} = props;
	
	const [isLinking, setIsLinking] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [dragCorner, setDragCorner] = useState(null);
	const [visualScale, setVisualScale] = useState(null);
	const boxRef = useRef(null);
	const dragStartRef = useRef(null);
	const rafRef = useRef(null);

	const { directValue, inheritedValue, isInherited, appliedValue } = resolvedValues;
	const value = directValue || {};

	const scaleUnits = useMemo(() => [
		{ 
			value: '%', 
			label: '%', 
			a11yLabel: __('Percent (%)', 'kadence-blocks'), 
			step: 1 
		}
	], []);
	
	const scaleValue = useMemo(() => value || { x: '100%', y: '100%' }, [value]);
	const effectiveScaleValue = useMemo(() => appliedValue || { x: '100%', y: '100%' }, [appliedValue]);
	
	const parseScaleValue = useCallback((value) => {
		if (typeof value === 'string' && value.endsWith('%')) {
			return parseFloat(value) / 100;
		}
		return parseFloat(value) || 1;
	}, []);
	
	const handleScaleChange = useCallback((newValue, axis) => {
		const updatedScale = { ...scaleValue };
		
		if (isLinking) {
			updatedScale.x = newValue;
			updatedScale.y = newValue;
		} else {
			updatedScale[axis] = newValue;
		}
		
		onChange(updatedScale);
	}, [scaleValue, onChange, isLinking]);

	const toggleLinking = useCallback(() => {
		if(!isLinking && scaleValue.x !== scaleValue.y) {
			handleScaleChange(scaleValue.x, 'y');
		}
		setIsLinking(!isLinking);
	}, [isLinking, scaleValue, handleScaleChange]);
	
	const handleReset = useCallback(() => {
		onChange('');
	}, [onChange]);
	

	const handleCornerMouseDown = useCallback((e, corner) => {
		e.preventDefault();
		e.stopPropagation();
		
		const box = boxRef.current;
		if (!box) return;
		
		const rect = box.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		
		setIsDragging(true);
		setDragCorner(corner);
		
		const initialScaleX = parseScaleValue(effectiveScaleValue.x);
		const initialScaleY = parseScaleValue(effectiveScaleValue.y);
		
		dragStartRef.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			centerX,
			centerY,
			initialScaleX,
			initialScaleY,
			baseDistX: (rect.width / 2) / initialScaleX,
			baseDistY: (rect.height / 2) / initialScaleY,
			initialRatio: initialScaleX / initialScaleY
		};
	}, [scaleValue, parseScaleValue]);
	
	const handleMouseMove = useCallback((e) => {
		if (!isDragging || !dragStartRef.current || !dragCorner) return;
		
		const { centerX, centerY, baseDistX, baseDistY, initialScaleX, initialScaleY, initialRatio } = dragStartRef.current;
		
		const currentDistX = Math.abs(e.clientX - centerX);
		const currentDistY = Math.abs(e.clientY - centerY);
		
		let newScaleX = currentDistX / baseDistX;
		let newScaleY = currentDistY / baseDistY;
		
		if (dragCorner === 'tm') {
			if (isLinking) {
				newScaleX = newScaleY * initialRatio;
			} else {
				newScaleX = initialScaleX;
			}
		} else if (dragCorner === 'rm') {
			if (isLinking) {
				newScaleY = newScaleX / initialRatio;
			} else {
				newScaleY = initialScaleY;
			}
		}
		
		if (isLinking && (dragCorner === 'tr' || dragCorner === 'bl')) {
			const avgScale = (newScaleX + newScaleY) / 2;
			newScaleX = avgScale;
			newScaleY = avgScale;
		}
		
		setVisualScale({ x: newScaleX, y: newScaleY });
		
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}
		
		rafRef.current = requestAnimationFrame(() => {
			const scaleXPercent = Math.round(newScaleX * 100) + '%';
			const scaleYPercent = Math.round(newScaleY * 100) + '%';
			onChange({ x: scaleXPercent, y: scaleYPercent });
		});
	}, [isDragging, isLinking, onChange, dragCorner]);
	
	const handleMouseUp = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		
		setIsDragging(false);
		setDragCorner(null);
		setVisualScale(null);
		dragStartRef.current = null;
	}, []);
	
	useEffect(() => {
		if (isDragging) {
			document.body.classList.add('is-dragging-scale');
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			
			return () => {
				document.body.classList.remove('is-dragging-scale');
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	return (
		<div className="kadence-transform-scale-content">
			<div className="kadence-transform-title-wrapper">
				<span className="kadence-transform-scale-title">
					{__('Transform Scale', 'kadence-blocks')}
				</span>
				<Button
					className="kadence-transform-reset-button"
					onClick={handleReset}
					icon={undo}
					size="small"
					label={__('Reset scale', 'kadence-blocks')}
					aria-label={__('Reset scale to 100%', 'kadence-blocks')}
				/>
			</div>
			
			<div className="kadence-transform-scale-visual">
				<div className={`kadence-transform-scale-box-inner${isInherited ? ' kbs-inherited' : ''}`} />
				
				<div 
					className={`kadence-transform-scale-box${isInherited ? ' kbs-inherited' : ''}`}
					ref={boxRef}
					style={useMemo(() => ({
						width: visualScale 
							? `${BOX_SIZE * visualScale.x}px`
							: `${BOX_SIZE * parseScaleValue(effectiveScaleValue.x)}px`,
						height: visualScale 
							? `${BOX_SIZE * visualScale.y}px`
							: `${BOX_SIZE * parseScaleValue(effectiveScaleValue.y)}px`
					}), [visualScale, effectiveScaleValue, parseScaleValue])}
				>
					<div 
						className={`kadence-transform-scale-handle kadence-transform-scale-handle-tr ${isDragging && dragCorner === 'tr' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleCornerMouseDown(e, 'tr')}
					/>
					<div 
						className={`kadence-transform-scale-handle kadence-transform-scale-handle-bl ${isDragging && dragCorner === 'bl' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleCornerMouseDown(e, 'bl')}
					/>
					<div 
						className={`kadence-transform-scale-handle kadence-transform-scale-handle-tm ${isDragging && dragCorner === 'tm' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleCornerMouseDown(e, 'tm')}
					/>
					<div 
						className={`kadence-transform-scale-handle kadence-transform-scale-handle-rm ${isDragging && dragCorner === 'rm' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleCornerMouseDown(e, 'rm')}
					/>
				</div>
			</div>
			
			<div className="kadence-transform-scale-controls">
				<div className="kadence-transform-scale-input-wrapper">
					<RadioToggleGroupPopoverInputUI
						label={__('X', 'kadence-blocks')}
						value={scaleValue.x}
						onChange={(newValue) => handleScaleChange(newValue, 'x')}
						inherited={{ inheritedValue: inheritedValue?.x }}
						isCustom={true}
						parentLabel={__('Scale', 'kadence-blocks')}
						units={scaleUnits}
					/>
					
					<div className="kadence-transform-scale-link-wrapper">
						<Button
							className="kadence-transform-scale-link-button"
							onClick={toggleLinking}
							isPressed={isLinking}
							icon={isLinking ? link : linkOff}
							label={isLinking ? __('Unlink values', 'kadence-blocks') : __('Link values', 'kadence-blocks')}
							aria-label={isLinking ? __('Unlink X and Y values', 'kadence-blocks') : __('Link X and Y values', 'kadence-blocks')}
						/>
					</div>
					
					<RadioToggleGroupPopoverInputUI
						label={__('Y', 'kadence-blocks')}
						value={scaleValue.y}
						onChange={(newValue) => handleScaleChange(newValue, 'y')}
						inherited={{ inheritedValue: inheritedValue?.y }}
						isCustom={true}
						parentLabel={__('Scale', 'kadence-blocks')}
						units={scaleUnits}
					/>
				</div>
			</div>
		</div>
	);
}

export default TransformScale;