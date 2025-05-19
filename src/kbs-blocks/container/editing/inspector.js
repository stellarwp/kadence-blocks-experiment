/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * Import WordPress
 */
import { useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
/**
 * Kadence Components.
 */
import { InspectorControlTabs } from '@kadence/kbsComponents';

/**
 * Internal dependencies
 */
import metadata from '../block.json';
import InspectorGeneral from './inspector-general';
import InspectorAdvanced from './inspector-advanced';
import InspectorStyles from './inspector-styles';

const PANEL_NAME = metadata.name;

/**
 * Build the section Inspector edit.
 */
export default function Inspector(props) {
	const [activeTab, setActiveTab] = useState('general');
	const { globalStylesIds } = props;

	const classes = clsx('kbs-container-inspector', {
		...(globalStylesIds || []).reduce((acc, styleId) => {
			acc[`kbs-global-style-${styleId}`] = true;
			return acc;
		}, {}),
	});
	return (
		<InspectorControls>
			<div className={classes}>
				<InspectorControlTabs panelName={PANEL_NAME} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && <InspectorGeneral {...props} />}
				{activeTab === 'style' && <InspectorStyles {...props} />}
				{activeTab === 'advanced' && <InspectorAdvanced {...props} />}
			</div>
		</InspectorControls>
	);
}
