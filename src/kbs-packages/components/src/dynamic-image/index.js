/**
 * External Dependencies
 */
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useRef, useCallback } from '@wordpress/element';
import { Button, Popover, ExternalLink, withFilters, Dropdown } from '@wordpress/components';
/**
 * Internal Dependencies
 */
import { dynamicIcon } from '../constants/icons';
/**
 * Build the Dynamic Background controls
 */
const DynamicMediaControl = (props) => {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const presetButtonRef = useRef(undefined);
	const attributeName = props?.attributeName || '';
	const component = props?.meta?.attributes?.[attributeName]?.component || '';

	return (
		<Dropdown
			ref={presetButtonRef}
			popoverProps={popoverProps}
			className="kbs-dynamic-control__dropdown"
			contentClassName={'kbs-dynamic-control__dropdown_content'}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					className="kb-dynamic-image-sidebar"
					variant="secondary"
					icon={dynamicIcon}
					onClick={onToggle}
					isPressed={isOpen}
					aria-haspopup="true"
					aria-expanded={isOpen}
					label={
						component === 'background'
							? __('Dynamic Background Image', 'kadence-blocks')
							: __('Dynamic Image', 'kadence-blocks')
					}
					showTooltip={true}
				/>
			)}
			renderContent={() => (
				<div className="kb-dynamic-popover-inner-wrap">
					<div className="kb-pro-notice">
						<h2>
							{component === 'background'
								? __('Dynamic Background Image', 'kadence-blocks')
								: __('Dynamic Image', 'kadence-blocks')}{' '}
						</h2>
						<p>
							{__(
								'Create dynamic sites by populating images from various sources.',
								'kadence-blocks'
							)}{' '}
						</p>
						<ExternalLink
							href={
								'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dynamic-content'
							}
						>
							{__('Upgrade to Pro', 'kadence-blocks')}
						</ExternalLink>
					</div>
				</div>
			)}
		/>
	);
};
export const DynamicBackgroundControl = withFilters('kadence.BackgroundDynamicControl')(DynamicMediaControl);
export const DynamicControl = withFilters('kadence.ImageDynamicControl')(DynamicMediaControl);

export default function DynamicImageControl(props) {
	const attributeName = props?.attributeName || '';
	const component = props?.meta?.attributes?.[attributeName]?.component || '';

	if (component === 'background') {
		return <DynamicBackgroundControl {...props} />;
	}
	return <DynamicControl {...props} />;
}
