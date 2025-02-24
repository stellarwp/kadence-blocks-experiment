/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';
import { debounce } from 'lodash';

/**
 * Kadence Components.
 */
import {
	ToolsPanelBody,
	RadioButtonControl,
	PresetSelectControl,
	Typography
} from '@kadence/kbsComponents';
/**
 * Kadence Helpers.
 */
import {
	uniqueIdHelper,
	getPreviewValue,
} from '@kadence/kbsHelpers';
import {
	CopyPasteAttributes,
	KadencePanelBody,
} from '@kadence/components';

/**
 * Kadence Helpers.
 */
import {
	getPreviewSize,
} from '@kadence/helpers';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorGeneral(props) {
	const { attributes, setAttributes, previewDevice, isSelected, clientId, context, className } = props;
	const previewDirection = getPreviewValue( 'direction', attributes, metadata, previewDevice );
	return (
		<>
			<ToolsPanelBody
				title={__('Flex Settings', 'kadence-blocks')}
				panelName={'kbs-container-flex-settings'}
			>
				<PresetSelectControl
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'direction' }
					meta={ metadata?.attributes?.direction }
				/>
				<RadioButtonControl
					label={__('Direction', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'direction' }
					previewDevice={ previewDevice }
					meta={ metadata?.attributes?.direction }
				/>
				<RadioButtonControl
					label={__('Justify Content', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'justify' }
					meta={ metadata?.attributes?.justify }
					previewDevice={ previewDevice }
					previewDirection={ previewDirection }
				/>
				<RadioButtonControl
					label={__('Alignment', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'alignItems' }
					meta={ metadata?.attributes?.alignItems }
					previewDevice={ previewDevice }
					previewDirection={ previewDirection }
				/>
				<RadioButtonControl
					label={__('Wrap', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'wrap' }
					meta={ metadata?.attributes?.wrap }
					previewDevice={ previewDevice }
					previewDirection={ previewDirection }
				/>
			</ToolsPanelBody>

			<ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'kb-container-typography'}
			>
				<Typography
					label={__('Typography', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					meta={ metadata?.attributes?.typography }
					previewDevice={ previewDevice }
					attributeName={ 'typography' }
				/>
			</ToolsPanelBody>
		</>
	);
}
