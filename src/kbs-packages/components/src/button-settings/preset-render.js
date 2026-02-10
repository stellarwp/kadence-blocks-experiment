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

function ButtonPresetCSSStyles(props) {
	const { attributes, previewDevice, preset, uniqueID, meta, attributeMeta } = props;
	const cssOutput = useMemo(() => {
		const selector = `.kbs-btn-${uniqueID}`;
		const css = new cssGenerator(selector, props, meta);

		const output = css.generate();
		return output;
	}, [attributes, previewDevice, preset?.value, uniqueID]);
	return <style>{cssOutput}</style>;
}

function ButtonPresetRenderContent(props) {
	const { className, attributes, meta, attributeMeta, preset, uniqueID, previewDevice } = props;
	return (
		<div className={`kbs-button-preset-render ${className}`}>
			<ButtonPresetCSSStyles
				preset={preset}
				attributes={attributes}
				uniqueID={uniqueID}
				attributeMeta={attributeMeta}
				meta={meta}
				previewDevice={previewDevice}
			/>
			<span className={`kbs-button-preset-render kbs-button kbs-btn-${uniqueID}`}>{preset.label}</span>
		</div>
	);
}
function ButtonPresetRender(props) {
	const { previewDevice, meta, preset, attributeName, uniqueID, globalStyleId = '' } = props;
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

	const attributes = styleBookComponent?.attributes ? styleBookComponent.attributes : {};
	// Return a div for each layer
	const classes = clsx(props.className, `preset-wrap-${uniqueID}`);
	return (
		<ButtonPresetRenderContent
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

export default ButtonPresetRender;
