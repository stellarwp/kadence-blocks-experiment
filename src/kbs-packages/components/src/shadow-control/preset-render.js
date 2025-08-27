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
	const { attributes, previewDevice, preset, uniqueID, meta, attributeMeta, attributeName, type } = props;
	const cssOutput = useMemo(() => {
		const selector = `.preset-${uniqueID}-${preset.value}` + (type === 'textShadow' ? ' span' : '');
		const css = new cssGenerator(selector);
		css.addComponent(attributeName, attributeMeta, props, meta);
		const output = css.generate();
		return output;
	}, [attributes?.layers, previewDevice, preset?.value, uniqueID, type]);
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
		type = 'boxShadow',
	} = props;
	const rawPresetData = select('kadenceblocks/global-styles').getResolvedStyleData(
		globalStylesIds,
		type,
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
	const shadowStyles = useMemo(() => {
		return (
			<ShadowPresetCSSStyles
				preset={preset}
				attributes={attributes}
				uniqueID={uniqueID}
				attributeMeta={meta?.attributes?.[attributeName]}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
				type={type}
			/>
		);
	}, [attributes, previewDevice, preset, uniqueID, meta, attributeName]);
	return (
		<>
			<div className={classes}>
				{shadowStyles}
				{type === 'textShadow' && <span>{__('Abc', 'kadence-blocks')}</span>}
			</div>
		</>
	);
}

export default ShadowPresetRender;
