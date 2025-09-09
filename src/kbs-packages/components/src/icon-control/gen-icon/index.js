import PropTypes from 'prop-types';

import { createElement } from '@wordpress/element';

export default function GenIcon(props) {
	const { className, icon, name, ariaHidden, title } = props;

	const isLineIcon = name.startsWith('fe');

	const svgProps = {
		ariaHidden: ariaHidden ? 'true' : undefined,
		strokeLinecap: isLineIcon ? 'round' : undefined,
		strokeLinejoin: isLineIcon ? 'round' : undefined,
		display: 'inline-block',
		verticalAlign: 'middle',
	};

	const typeL = name.substring(0, 3);
	const viewBoxParts = icon?.vB?.split(' ');
	const hasOffsetViewBox = viewBoxParts && (viewBoxParts[0] !== '0' || viewBoxParts[1] !== '0');

	if (!['fas', 'fe_', 'ic_'].includes(typeL) && hasOffsetViewBox) {
		svgProps.preserveAspectRatio = 'xMinYMin meet';
	}

	return (
		<span
			style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
			className={`${className || ''}`}
		>
			<svg
				style={svgProps}
				viewBox={icon?.vB || '0 0 24 24'}
				fill={isLineIcon ? 'none' : 'currentColor'}
				stroke={isLineIcon ? 'currentColor' : undefined}
				xmlns={'http://www.w3.org/2000/svg'}
			>
				{title && <title>{title}</title>}
				{icon && walkChildren(icon.cD)}
			</svg>
		</span>
	);
}

const walkChildren = (children) => {
	return children.map((child, idx) => {
		const { nE: nodeName, aBs: attributes, children: grandChildren = null } = child;

		const newAttributes = Object.keys(attributes)
			.filter((key) => key !== 'fill' && key !== 'stroke' && attributes[key] !== 'none')
			.reduce((partial, key) => {
				partial[key] = attributes[key];
				return partial;
			}, {});

		// Special case for icons that have both fill and stroke properties.
		let merge = {};
		if (attributes.fill === 'none' && attributes.stroke) {
			merge = { fill: 'none', stroke: 'currentColor' };
		}
		return createElement(
			nodeName,
			{ key: idx, ...newAttributes, ...merge },
			grandChildren ? walkChildren(grandChildren) : null
		);
	});
};
