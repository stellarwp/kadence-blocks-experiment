/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolsPanelBody from '../tools-panel-body';
import TitleBar from '../title-bar';
import SelectControl from '../select-control';
import RadioButtonControl from '../radio-button-control';

/**
 * Transition Control Component
 *
 * @param {Object} props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string} props.previewDevice - Current preview device
 * @param {Array} props.globalStylesIds - Global styles IDs
 * @param {Object} props.meta - Block metadata
 * @param {string} props.attributeName - Attribute name for transitions
 * @param {boolean} props.hasHoverControls - Whether hover controls are enabled
 * @returns {JSX.Element}
 */
export default function TransitionControl({
	attributes,
	setAttributes,
	meta,
	attributeName = 'transition',
	previewDevice = 'Desktop',
	globalStylesIds = {},
}) {
	// Get current values
	const transitionSettings = attributes[attributeName] || {};
	const duration = transitionSettings.duration || '0.3';

	// Reset function
	const handleReset = () => {
		setAttributes({ [attributeName]: undefined });
	};

	return (
		<ToolsPanelBody
			title={__('Transition', 'kadence-blocks')}
			initialOpen={false}
			resetAll={handleReset}
			className="kbs-transition-control"
			hasDeviceControls={false}
		>
			<RadioButtonControl
				label={__('Duration', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'transitionDuration'}
				meta={meta}
				previewDevice={previewDevice}
				hasCustomControls={false}
				min={0}
				max={2000}
				step={5}
				units={[
					{
						value: 'ms',
						label: 'ms',
						a11yLabel: __('Milliseconds (ms)', 'kadence-blocks'),
						step: 5,
					},
				]}
			/>

			<SelectControl
				label={__('Timing Function', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
				previewDevice={previewDevice}
				type={'transitionTimingFunction'}
				globalStylesIds={globalStylesIds}
			/>
		</ToolsPanelBody>
	);
}
