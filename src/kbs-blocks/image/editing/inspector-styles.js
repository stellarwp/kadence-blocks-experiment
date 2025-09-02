/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import {
	ToolsPanelBody,
	RadioButtonControl,
	PresetSelectControl,
	Typography,
	SelectGlobalStyles,
	BlockComponentControls,
	FlexBoxControl,
	FlexChildControl,
	BackgroundControl,
	LayeredShadowControl,
	BorderControl,
	ImageControl,
	SelectBasicControl,
	ShadowControl,
} from '@kadence/kbsComponents';
/**
 * Kadence Helpers.
 */
import { getResolvedValue } from '@kadence/kbsHelpers';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorStyles(props) {
	const {
		attributes,
		setAttributes,
		previewDevice,
		isSelected,
		clientId,
		context,
		className,
		globalStylesIds,
		globalStylesCss,
	} = props;
	const maskShapeAnyResolvedValue = getResolvedValue('mask', attributes, 'any', metadata, 'shape', globalStylesIds);
	const maskUrlAnyResolvedValue = getResolvedValue('mask', attributes, 'any', metadata, 'url', globalStylesIds);
	return (
		<>
			<ToolsPanelBody
				title={__('Border Controls', 'kadence-blocks')}
				panelName={'border-controls'}
				initialOpen={false}
			>
				<BorderControl
					attributes={attributes}
					attributeName={'border'}
					setAttributes={setAttributes}
					previewDevice={previewDevice}
					meta={metadata}
					globalStylesIds={globalStylesIds}
					labelBorderRadius={__('Border Radius', 'kadence-blocks')}
					label={__('Border', 'kadence-blocks')}
					hasPresetControl={true}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Shadow Controls', 'kadence-blocks')}
				panelName={'shadow-controls'}
				initialOpen={false}
			>
				<LayeredShadowControl
					attributeName={'boxShadow'}
					attributes={attributes}
					setAttributes={setAttributes}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
					type={'boxShadow'}
				/>
				<ShadowControl
					label={__('Drop Shadow', 'kadence-blocks')}
					attributeName={'filter'}
					attributes={attributes}
					setAttributes={setAttributes}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
					type={'dropShadow'}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody title={__('Caption', 'kadence-blocks')} panelName={'caption-controls'} initialOpen={false}>
				<Typography
					label={__('CaptionsTypography', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'captionTypography'}
					hasColor={true}
					hasBackgroundColor={true}
					supportsGradient={true}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
				/>
			</ToolsPanelBody>
			{/* <ToolsPanelBody title={__('Filter', 'kadence-blocks')} panelName={'filter-controls'} initialOpen={false}>
				<SelectBasicControl
					label={__('Filter', 'kadence-blocks')}
					attributeName={'filter'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'simple'}
					options={[
						{
							label: __('None', 'kadence-blocks'),
							value: '',
						},
						{
							label: __('Sepia', 'kadence-blocks'),
							value: 'sepia',
						},
						{
							label: __('Greyscale', 'kadence-blocks'),
							value: 'grayscale',
						},
						{
							label: __('Saturation', 'kadence-blocks'),
							value: 'saturation',
						},
						{
							label: __('Early Bird', 'kadence-blocks'),
							value: 'earlybird',
						},
						{
							label: __('Mayfair', 'kadence-blocks'),
							value: 'mayfair',
						},
						{
							label: __('Toaster', 'kadence-blocks'),
							value: 'toaster',
						},
						{
							label: __('Vintage', 'kadence-blocks'),
							value: 'vintage',
						},
					]}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody title={__('Mask', 'kadence-blocks')} panelName={'mask-controls'} initialOpen={false}>
				<SelectBasicControl
					label={__('Mask Shape', 'kadence-blocks')}
					attributeName={'mask'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'shape'}
					options={[
						{
							label: __('None', 'kadence-blocks'),
							value: '',
						},
						{
							label: __('Circle', 'kadence-blocks'),
							value: 'circle',
						},
						{
							label: __('Diamond', 'kadence-blocks'),
							value: 'diamond',
						},
						{
							label: __('Hexagon', 'kadence-blocks'),
							value: 'hexagon',
						},
						{
							label: __('Rounded', 'kadence-blocks'),
							value: 'rounded',
						},
						{
							label: __('Blob 1', 'kadence-blocks'),
							value: 'blob1',
						},
						{
							label: __('Blob 2', 'kadence-blocks'),
							value: 'blob2',
						},
						{
							label: __('Blob 3', 'kadence-blocks'),
							value: 'blob3',
						},
						{
							label: __('Custom', 'kadence-blocks'),
							value: 'custom',
						},
					]}
				/>
				{maskShapeAnyResolvedValue.appliedValue === 'custom' && (
					<ImageControl
						label={''}
						attributes={attributes}
						attributeName={'mask'}
						type={'image'}
						setAttributes={setAttributes}
						meta={metadata}
						previewDevice={'Desktop'}
						globalStylesIds={globalStylesIds}
						hasSizeControls={false}
						hasClearControls={false}
					/>
				)}
			</ToolsPanelBody> */}
		</>
	);
}
