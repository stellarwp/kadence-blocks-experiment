/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import ToolbarLibrary from './components/toolbar-library';

/**
 * Register the Prebuilt Library plugin
 * Following WordPress core pattern for plugin registration
 */
registerPlugin('kbs-prebuilt-library', {
	render: ToolbarLibrary,
});
