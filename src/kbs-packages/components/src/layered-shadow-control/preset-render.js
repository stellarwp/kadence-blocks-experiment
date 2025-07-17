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

function ShadowPresetCSSStyles(props) {
	const { attributes, previewDevice, preset, uniqueID, meta, attributeMeta, attributeName } = props;
	const cssOutput = useMemo(() => {
		const selector = `.preset-${uniqueID}-${preset.value}`;
		const css = new cssGenerator(selector);
		css.addComponent(attributeName, attributeMeta, props, meta);
		let output = css.generate();
		return output;
	}, [attributes?.layers, previewDevice, preset?.value, uniqueID]);
	return <style>{cssOutput}</style>;
}

function ShadowPresetRender(props) {
	const {
		previewDevice,
		meta,
		preset,
		attributeName,
		uniqueID,
		globalStylesIds = [],
		globalStyleId = '',
		className,
	} = props;
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		'boxShadow',
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
	const attributes = globalStyleId
		? { [attributeName]: styleBookComponent?.attributes } || {}
		: { [attributeName]: rawPresetData?.attributes } || {};
	// Return a div for each layer
	const classes = clsx(className, 'kbs-shadow-preset-render', `preset-${uniqueID}-${preset.value}`, {
		'has-no-shadow': !attributes?.[attributeName]?.layers?.length,
	});
	return (
		<div className={classes}>
			<ShadowPresetCSSStyles
				preset={preset}
				attributes={attributes}
				uniqueID={uniqueID}
				attributeMeta={meta?.attributes?.[attributeName]}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
			/>
		</div>
	);
}

export default ShadowPresetRender;
