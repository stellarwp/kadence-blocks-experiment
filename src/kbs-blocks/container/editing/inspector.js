/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { InspectorControlTabs } from '@kadence/components';

import metadata from '../block.json';
import InspectorGeneral from './inspector-general';
import InspectorAdvanced from './inspector-advanced';
/**
 * Import WordPress
 */
import { useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';

const PANEL_NAME = metadata.name;

/**
 * Build the section Inspector edit.
 */
export default function Inspector(props) {
	const [activeTab, setActiveTab] = useState('general');

	return (
		<InspectorControls>
			<InspectorControlTabs panelName={PANEL_NAME} setActiveTab={setActiveTab} activeTab={activeTab} />
			{activeTab === 'general' && <InspectorGeneral { ...props }/>}
			{activeTab === 'advanced' && <InspectorAdvanced { ...props }/>}
		</InspectorControls>
	);
}
