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
	RadioButtonControl,
} from '@kadence/kbsComponents';
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

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import {
	BlockAlignmentToolbar,
	BlockVerticalAlignmentToolbar,
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToggleControl, SelectControl, ToolbarGroup, ExternalLink } from '@wordpress/components';

/**
 * Build the section edit.
 */
export default function InspectorGeneral(props) {
	const { attributes, setAttributes, previewDevice, isSelected, clientId, context, className } = props;
	return (
		<>
			<KadencePanelBody
				title={__('Flex Settings', 'kadence-blocks')}
				panelName={'kbs-container-flex-settings'}
			>
				<RadioButtonControl
					label={__('Direction', 'kadence-blocks')}
					attributes={ attributes }
					setAttributes={ setAttributes }
					attributeName={ 'direction' }
					type={ metadata.attributes['direction'].property }
					placeholder={  metadata.attributes['direction'].inherit }
					previewDevice={ previewDevice }
				/>
			</KadencePanelBody>
		</>
	);
}
