import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { Typography, BLOCK_COMPONENTS, ToolsPanelBody, ToggleControl, SpacingControl } from '@kadence/kbsComponents';
import { getGlobalStylesCSSOutput, getPresetOptions } from '@kadence/kbsHelpers';

import './editor.scss';

/**
 * Build the component preset
 */
export default function ComponentPresetBundledControl(props) {
	const { globalStyleId, preset, property } = props;

	const componentId = property;
	const presetId = preset;

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);
	const { styleBookComponent } = useSelect(
		(select) => {
			return {
				styleBookComponent: select('kadenceblocks/global-styles').getStyleBookComponentPresetByStyleId(
					globalStyleId,
					componentId,
					presetId
				),
			};
		},
		[globalStyleId, componentId, presetId]
	);

	const { setStyleBookComponentBundledPresetAttributesByStyleId } = useDispatch('kadenceblocks/global-styles');

	const styleBookLocalPreset = styleBookComponent?.attributes ? styleBookComponent.attributes : {};
	const setStyleBookLocalPreset = (presetAttrs) => {
		setStyleBookComponentBundledPresetAttributesByStyleId(globalStyleId, componentId, presetId, presetAttrs);
	};
	const bundledComponents = useMemo(() => {
		switch (componentId) {
			case 'buttonVariant':
				return ['button', 'typography', 'icon', 'spacing', 'transform', 'transition'];
			default:
				return null;
		}
	}, [componentId]);
	const fakeMeta = useMemo(() => {
		switch (componentId) {
			case 'buttonVariant':
				return {
					attributes: {
						typography: {
							component: 'typography',
							renderCSS: true,
							selector: '--kbs-button-preview-',
							initial: {},
							type: 'object',
						},
						color: {
							component: 'color',
							renderCSS: true,
							selector: '--kbs-button-preview-',
							type: 'object',
						},
						backgroundColor: {
							component: 'color',
							renderCSS: true,
							selector: '--kbs-button-preview-',
							type: 'object',
						},
					},
				};
			default:
				return null;
		}
	}, [componentId]);

	const globalStylesCss = getGlobalStylesCSSOutput([globalStyleId]);

	const bundledControls = bundledComponents.map((subProperty, index) => {
		switch (subProperty) {
			case 'button':
				const ButtonComponent = BLOCK_COMPONENTS?.[subProperty].component;
				const buttonTitle = BLOCK_COMPONENTS?.[subProperty]?.label || subProperty;
				return (
					<ButtonComponent
						key={index}
						title={buttonTitle}
						attributeName={subProperty}
						attributes={styleBookLocalPreset}
						globalStylesCss={globalStylesCss}
						setAttributes={(updates) => setStyleBookLocalPreset(updates)}
						globalStylesIds={[globalStyleId]}
						previewDevice={previewDevice}
						forStyleBook={false}
						meta={fakeMeta}
					/>
				);
				break;
			case 'typography':
				const TypographyComponent = BLOCK_COMPONENTS?.[subProperty].component;
				const typographyTitle = BLOCK_COMPONENTS?.[subProperty]?.label || subProperty;
				return (
					<ToolsPanelBody
						key={index}
						title={__('Typography Settings', 'kadence-blocks')}
						panelName={'text-typography'}
						componentName={'typography-control'}
						initialOpen={false}
					>
						<TypographyComponent
							title={typographyTitle}
							attributeName={subProperty}
							attributes={styleBookLocalPreset}
							globalStylesCss={globalStylesCss}
							setAttributes={(updates) => setStyleBookLocalPreset(updates)}
							globalStylesIds={[globalStyleId]}
							previewDevice={previewDevice}
							forStyleBook={false}
							meta={fakeMeta}
						/>
					</ToolsPanelBody>
				);
				break;
			case 'icon':
				const IconComponent = BLOCK_COMPONENTS?.[subProperty].component;
				const iconTitle = BLOCK_COMPONENTS?.[subProperty]?.label || subProperty;
				return (
					<ToolsPanelBody
						key={index}
						title={iconTitle}
						panelName={'icon-settings'}
						componentName={'icon-control'}
						initialOpen={false}
					>
						<IconComponent
							label={__('Icon', 'kadence-blocks')}
							attributes={styleBookLocalPreset}
							setAttributes={(updates) => setStyleBookLocalPreset(updates)}
							meta={fakeMeta}
							previewDevice={previewDevice}
							attributeName={'icon'}
							hasTooltip={true}
							hasPlacement={true}
							hasAlignment={true}
							hasSpacing={true}
							hasRotation={true}
						/>
						<ToggleControl
							label={__('Reveal Icon on Hover', 'kadence-blocks')}
							titleBar={false}
							attributeName={'iconReveal'}
							attributes={styleBookLocalPreset}
							setAttributes={(updates) => setStyleBookLocalPreset(updates)}
							meta={fakeMeta}
							type={'iconReveal'}
						/>
					</ToolsPanelBody>
				);
				break;
			case 'spacing':
			case 'transform':
			default:
				const Component = BLOCK_COMPONENTS?.[subProperty].component;
				return (
					<Component
						title={BLOCK_COMPONENTS?.[subProperty]?.label || subProperty}
						key={subProperty}
						property={subProperty}
						attributeName={subProperty}
						attributes={styleBookLocalPreset}
						globalStylesCss={globalStylesCss}
						setAttributes={(updates) => setStyleBookLocalPreset(updates)}
						globalStylesIds={[globalStyleId]}
						previewDevice={previewDevice}
						forStyleBook={true}
						meta={fakeMeta}
						hasHoverControls={true}
						initialOpen={false}
					/>
				);
				break;
		}
	});
	return <>{bundledControls}</>;
}
