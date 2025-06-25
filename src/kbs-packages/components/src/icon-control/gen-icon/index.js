import PropTypes from 'prop-types';

import { createElement } from '@wordpress/element';

export default function GenIcon( props ) {
	const {
		style,
		className,
		icon,
		name,
		htmltag: HtmlTagOut = 'div',
		size: size = 24,
		strokeWidth: strokeWidth = 2,
		ariaHidden,
		title,
		xmlns = 'http://www.w3.org/2000/svg',
	} = props;

	const isLineIcon = name.startsWith( 'fe' );

	const svgProps = {
		'aria-hidden': ariaHidden ? 'true' : undefined,
		'stroke-width': isLineIcon ? strokeWidth : undefined,
		'stroke-linecap': isLineIcon ? 'round' : undefined,
		'stroke-linejoin': isLineIcon ? 'round' : undefined,
		display: 'inline-block',
		verticalAlign: 'middle',
	};

	const typeL = name.substring( 0, 3 );
	const viewBoxParts = icon?.vB?.split( ' ' );
	const hasOffsetViewBox = viewBoxParts && ( viewBoxParts[0] !== '0' || viewBoxParts[1] !== '0' );

	if ( !['fas', 'fe_', 'ic_'].includes( typeL ) && hasOffsetViewBox ) {
		svgProps.preserveAspectRatio = 'xMinYMin meet';
	}

	return (
		<HtmlTagOut
			style={ { display: 'inline-flex', justifyContent: 'center', alignItems: 'center', ...style } }
			className={ `${className || ''} ${size === 0 ? 'kb-icon-transparent' : ''}`.trim() }
		>
			<svg
				style={ svgProps }
				viewBox={ icon?.vB || '0 0 24 24' }
				height={ size === 0 ? '24' : size }
				width={ size === 0 ? '24' : size }
				fill={ isLineIcon ? 'none' : 'currentColor' }
				stroke={ isLineIcon ? 'currentColor' : undefined }
				xmlns={ xmlns }
			>
				{ title && <title>{ title }</title> }
				{ icon && walkChildren( icon.cD ) }
			</svg>
		</HtmlTagOut>
	);
};

const walkChildren = ( children ) => {
	return children.map( ( child, idx ) => {
		const { nE: nodeName, aBs: attributes, children: grandChildren = null } = child;

		const newAttributes = Object.keys( attributes )
			.filter( key => key !== 'fill' && key !== 'stroke' && attributes[ key ] !== 'none' )
			.reduce( ( partial, key ) => {
				partial[ key ] = attributes[ key ];
				return partial;
			}, {} );

		// Special case for icons that have both fill and stroke properties.
		let merge = {};
		if ( attributes.fill === 'none' && attributes.stroke ) {
			merge = { fill: 'none', stroke: 'currentColor' };
		}
		return createElement(
			nodeName,
			{ key: idx, ...newAttributes, ...merge },
			grandChildren ? walkChildren( grandChildren ) : null
		);
	} );
};