/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SVG, Path } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

import { createRef, useEffect, useMemo } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
import { getInheritedValue, getColorOutput, getDividerOptions, getMaskOptions } from '@kadence/kbsHelpers';
import BackgroundLayerRender from './layer-render';
import './editor.scss';

function BackgroundStyles(props) {
	const { previewDevice, backgroundAttribute, attributes, meta, globalStylesIds } = props;
	const background = getInheritedValue(backgroundAttribute, attributes, 'none', meta, 'layers', globalStylesIds);
	const metaClassPrefix = meta?.attributes?.[backgroundAttribute]?.classPrefix || 'kbs-bg-style-';
	const layersCount = useMemo(
		() => (Array.isArray(background?.inheritedValue) ? background.inheritedValue.length : 0),
		[background?.inheritedValue]
	);
	const reverseLayers = useMemo(
		() => (Array.isArray(background?.inheritedValue) ? [...background.inheritedValue].reverse() : []),
		[background?.inheritedValue]
	);
	// Return a div for each layer
	return (
		<>
			{Array.from({ length: layersCount }).map((_, index) => {
				const layer = reverseLayers[index];
				return (
					<BackgroundLayerRender
						key={index}
						layer={layer}
						index={index}
						previewDevice={previewDevice}
						metaClassPrefix={metaClassPrefix}
					/>
				);
			})}
		</>
	);
}

export default BackgroundStyles;
