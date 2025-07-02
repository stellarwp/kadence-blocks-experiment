/**
 * Transform Skew Component
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

function TransformSkew(props) {
	const { 
		onChange, 
		resolvedValues
	} = props;
	
	const [isLinking, setIsLinking] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [dragAxis, setDragAxis] = useState(null);
	const [visualSkew, setVisualSkew] = useState(null);
	const boxRef = useRef(null);
	const containerRef = useRef(null);
	const dragStartRef = useRef(null);
	const rafRef = useRef(null);

	const { directValue, inheritedValue, isInherited, appliedValue } = resolvedValues;
	const value = directValue || {};

	const skewValue = useMemo(() => value || { x: '0deg', y: '0deg' }, [value]);
	const effectiveSkewValue = useMemo(() => appliedValue || { x: '0deg', y: '0deg' }, [appliedValue]);
	
	const skewUnits = useMemo(() => [
		{ value: 'deg', label: 'deg', a11yLabel: __('Degrees', 'kadence-blocks'), step: 1 }
	], []);
	
	const parseSkewValue = useCallback((value) => {
		if (!value) return 0;
		if (typeof value === 'string' && value.endsWith('deg')) {
			return parseFloat(value) || 0;
		}
		return parseFloat(value) || 0;
	}, []);
	
	const handleSkewChange = useCallback((newValue, axis) => {
		const updatedSkew = { ...skewValue };
		
		if (isLinking) {
			updatedSkew.x = newValue;
			updatedSkew.y = newValue;
		} else {
			updatedSkew[axis] = newValue;
		}
		
		onChange(updatedSkew);
	}, [skewValue, onChange, isLinking]);

	const handleReset = useCallback(() => {
		onChange('');
	}, [onChange]);

	const toggleLinking = useCallback(() => {
		if(!isLinking && skewValue.x !== skewValue.y) {
			handleSkewChange(skewValue.x, 'y');
		}
		setIsLinking(!isLinking);
	}, [isLinking, skewValue, handleSkewChange]);

	const handleMouseDown = useCallback((e, axis) => {
		e.preventDefault();
		e.stopPropagation();
		
		const container = containerRef.current;
		if (!container) return;
		
		const rect = container.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		
		setIsDragging(true);
		setDragAxis(axis);
		
		dragStartRef.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			centerX,
			centerY,
			initialSkew: parseSkewValue(effectiveSkewValue[axis])
		};
	}, [skewValue, parseSkewValue]);

	const handleMouseMove = useCallback((e) => {
		if (!isDragging || !dragStartRef.current || !dragAxis) return;
		
		const { mouseX, mouseY, centerX, centerY, initialSkew } = dragStartRef.current;
		
		let delta;
		if (dragAxis === 'x') {
			delta = (e.clientX - mouseX) / 2;
		} else {
			delta = -(e.clientY - mouseY) / 2;
		}
		
		const newSkew = initialSkew + delta;
		
		const clampedSkew = Math.max(-85, Math.min(85, newSkew));
		
		if (isLinking) {
			setVisualSkew({ x: clampedSkew, y: clampedSkew });
		} else {
			setVisualSkew({ 
				x: dragAxis === 'x' ? clampedSkew : parseSkewValue(skewValue.x),
				y: dragAxis === 'y' ? clampedSkew : parseSkewValue(skewValue.y)
			});
		}
		
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}
		
		rafRef.current = requestAnimationFrame(() => {
			if (isLinking) {
				onChange({ 
					x: Math.round(clampedSkew) + 'deg',
					y: Math.round(clampedSkew) + 'deg'
				});
			} else {
				onChange({ 
					...skewValue,
					[dragAxis]: Math.round(clampedSkew) + 'deg'
				});
			}
		});
	}, [isDragging, dragAxis, skewValue, onChange, isLinking]);

	const handleMouseUp = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		
		setIsDragging(false);
		setDragAxis(null);
		setVisualSkew(null);
		dragStartRef.current = null;
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.body.classList.add('is-dragging-skew');
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			
			return () => {
				document.body.classList.remove('is-dragging-skew');
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const transformStyle = useMemo(() => {
		const skewX = visualSkew ? parseSkewValue(visualSkew.x) : parseSkewValue(effectiveSkewValue.x);
		const skewY = visualSkew ? parseSkewValue(visualSkew.y) : parseSkewValue(effectiveSkewValue.y);
		return {
			transform: `skew(${skewX}deg, ${skewY}deg)`
		};
	}, [visualSkew, effectiveSkewValue, parseSkewValue]);

	return (
		<div className="kadence-transform-skew-content">
			<div className="kadence-transform-title-wrapper">
				<span className="kadence-transform-skew-title">
					{__('Transform Skew', 'kadence-blocks')}
				</span>
				<Button
					className="kadence-transform-reset-button"
					icon={undo}
					size="small"
					onClick={handleReset}
					label={__('Reset skew', 'kadence-blocks')}
					aria-label={__('Reset skew to default values', 'kadence-blocks')}
				/>
			</div>
			
			<div className="kadence-transform-skew-visual" ref={containerRef}>
				<div className={`kadence-transform-skew-box-reference${isInherited ? ' kbs-inherited' : ''}`} />
				
				<div className={`kadence-transform-skew-wrapper${isInherited ? ' kbs-inherited' : ''}`} style={transformStyle}>
					<div 
						className="kadence-transform-skew-box"
						ref={boxRef}
					/>
					
					<div 
						className={`kadence-transform-skew-arrow kadence-transform-skew-arrow-y ${isDragging && dragAxis === 'y' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleMouseDown(e, 'y')}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M7 14L12 19L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
					</div>
					
					<div 
						className={`kadence-transform-skew-arrow kadence-transform-skew-arrow-x ${isDragging && dragAxis === 'x' ? 'is-dragging' : ''}`}
						onMouseDown={(e) => handleMouseDown(e, 'x')}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M10 7L5 12L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M14 7L19 12L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
					</div>
				</div>
			</div>
			
			<div className="kadence-transform-skew-controls">
				<div className="kadence-transform-skew-input-wrapper">
					<RadioToggleGroupPopoverInputUI
						label={__('X', 'kadence-blocks')}
						value={skewValue.x}
						onChange={(newValue) => handleSkewChange(newValue, 'x')}
						inherited={{ inheritedValue: inheritedValue?.x }}
						isCustom={true}
						parentLabel={__('Skew', 'kadence-blocks')}
						units={skewUnits}
					/>
					
					<div className="kadence-transform-skew-link-wrapper">
						<Button
							className="kadence-transform-skew-link-button"
							onClick={toggleLinking}
							isPressed={isLinking}
							icon={isLinking ? link : linkOff}
							label={isLinking ? __('Unlink values', 'kadence-blocks') : __('Link values', 'kadence-blocks')}
							aria-label={isLinking ? __('Unlink X and Y values', 'kadence-blocks') : __('Link X and Y values', 'kadence-blocks')}
						/>
					</div>
					
					<RadioToggleGroupPopoverInputUI
						label={__('Y', 'kadence-blocks')}
						value={skewValue.y}
						onChange={(newValue) => handleSkewChange(newValue, 'y')}
						inherited={{ inheritedValue: inheritedValue?.y }}
						isCustom={true}
						parentLabel={__('Skew', 'kadence-blocks')}
						units={skewUnits}
					/>
				</div>
			</div>
		</div>
	);
}

export default TransformSkew;