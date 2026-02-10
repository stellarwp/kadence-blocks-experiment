/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * Import WordPress
 */
import { useState, useMemo, useRef, useEffect } from '@wordpress/element';
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
	const { globalStylesIds, globalStylesCss } = props;
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);
	const classes = clsx('kbs-container-inspector', globalClasses);
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, divRef?.current]);
	return (
		<InspectorControls>
			<div className={classes} ref={divRef}>
				<InspectorControlTabs
					panelName={PANEL_NAME}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
					allowedTabs={['general', 'advanced']}
				/>
				{activeTab === 'general' && <InspectorGeneral globalStylesCss={globalStylesCss} {...props} />}
				{/* {activeTab === 'style' && <InspectorStyles globalStylesCss={globalStylesCss} {...props} />} */}
				{activeTab === 'advanced' && <InspectorAdvanced globalStylesCss={globalStylesCss} {...props} />}
			</div>
		</InspectorControls>
	);
}
