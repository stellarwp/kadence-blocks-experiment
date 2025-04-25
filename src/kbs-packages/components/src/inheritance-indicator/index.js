/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, info } from '@wordpress/icons';
import { useState, useCallback } from '@wordpress/element';
import { Popover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Inheritance Indicator component
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Inheritance indicator component.
 */
export default function InheritanceIndicator({ inheritedSource, inheritedType }) {
	const [isHovering, setIsHovering] = useState(false);
	const [detailedData, setDetailedData] = useState(null);
	const [anchorRef, setAnchorRef] = useState(null);
	
	if (!inheritedSource || inheritedType === 'none') {
		return null;
	}

	// Determine icon color based on the inheritance source
	let iconColor = 'rgba(0, 0, 0, 0.6)';
	
	if (inheritedType === 'preset') {
		iconColor = 'rgba(8, 115, 230, 1)';
	} else if (inheritedType === 'none') {
		iconColor = 'rgba(0, 0, 0, 1)';
	}

	const fetchdData = useCallback(() => {
		return {
			type: inheritedType,
			source: inheritedSource,
		};
	}, [inheritedType, inheritedSource]);

	const handleMouseEnter = () => {
		setIsHovering(true);
		
		if (!detailedData) {
			setDetailedData(fetchdData());
		}
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
	};

	return (
		<div className="kbs-inheritance-indicator">
			<div 
				className="kbs-inheritance-icon"
				ref={setAnchorRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					marginRight: '5px',
					cursor: 'pointer'
				}}
			>
				<Icon 
					icon={info} 
					size={16} 
					style={{ 
						fill: iconColor,
						color: iconColor
					}} 
				/>
				
				{isHovering && detailedData && (
					<Popover
						position="top center"
						focusOnMount={false}
						noArrow={false}
						anchor={anchorRef}
						className="kbs-inheritance-popover"
					>
						<div className="kbs-inheritance-popover-content">
							<h4>{__('Inheritance Details', 'kadence-blocks')}</h4>
							<div className="kbs-inheritance-popover-item">
								<strong>{__('Source:', 'kadence-blocks')}</strong> {detailedData.source}
							</div>
							<div className="kbs-inheritance-popover-item">
								<strong>{__('Type:', 'kadence-blocks')}</strong> {detailedData.type}
							</div>
						</div>
					</Popover>
				)}
			</div>
			<span className="kbs-inheritance-source">
				{inheritedSource}
			</span>
		</div>
	);
} 