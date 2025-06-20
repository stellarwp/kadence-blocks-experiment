/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { createRef, useEffect, useMemo } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
import { cssGenerator } from '@kadence/kbsHelpers';
import BackgroundLayerRender from './layer-render';

function BackgroundPresetCSSStyles(props) {
	const { attributes, previewDevice, preset, uniqueID, meta, attributeMeta } = props;
	const cssOutput = useMemo(() => {
		const selector = `.preset-${uniqueID}-${preset.value}`;
		const css = new cssGenerator(selector);
		const reverseLayers = Array.isArray(attributes?.layers) ? [...attributes.layers].reverse() : [];
		if (reverseLayers.length > 0) {
			reverseLayers.forEach((layer, index) =>
				css.processBackgroundLayer(layer, index, attributeMeta, props, meta)
			);
		}
		let output = css.generate();
		return output;
	}, [attributes?.layers, previewDevice, preset?.value, uniqueID]);
	return <style>{cssOutput}</style>;
}

function BackgroundPresetRenderContent(props) {
	const { className, attributes, meta, attributeMeta, preset, uniqueID, previewDevice } = props;
	const metaClassPrefix = attributeMeta?.classPrefix || 'kbs-bg-style-';
	const layersCount = useMemo(
		() => (Array.isArray(attributes?.layers) ? attributes?.layers.length : 0),
		[attributes?.layers]
	);
	const reverseLayers = useMemo(
		() => (Array.isArray(attributes?.layers) ? [...attributes?.layers].reverse() : []),
		[attributes?.layers]
	);
	return (
		<div className={`kbs-bg-preset-render ${className}`}>
			<BackgroundPresetCSSStyles
				preset={preset}
				attributes={attributes}
				uniqueID={uniqueID}
				attributeMeta={attributeMeta}
				meta={meta}
				previewDevice={previewDevice}
			/>
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
		</div>
	);
}
function BackgroundPresetRender(props) {
	const { previewDevice, meta, preset, attributeName, uniqueID, globalStylesIds = [], globalStyleId = '' } = props;
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		'background',
		'presets.' + preset?.value
	);
	const { styleBookComponent } = useSelect(
		(select) => {
			return {
				styleBookComponent: select('kadenceblocks/global-styles').getStyleBookComponentPresetByStyleId(
					globalStyleId,
					attributeName,
					preset?.value
				),
			};
		},
		[globalStyleId, attributeName, preset?.value]
	);
	const attributes = globalStyleId ? styleBookComponent?.attributes : rawPresetData?.attributes;
	// Return a div for each layer
	const classes = clsx(props.className, `preset-${uniqueID}-${preset.value}`, {
		'has-no-background': !attributes?.layers?.length,
	});
	return (
		<BackgroundPresetRenderContent
			className={classes}
			attributes={attributes}
			meta={meta}
			attributeMeta={meta?.attributes?.[attributeName]}
			preset={preset}
			uniqueID={uniqueID}
			previewDevice={previewDevice}
		/>
	);
}

export default BackgroundPresetRender;
