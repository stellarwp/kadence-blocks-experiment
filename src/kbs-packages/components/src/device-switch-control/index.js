/**
 * Responsive Device Switch Component
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { mobile, tablet, desktop } from '@wordpress/icons';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import './editor.scss';

const availableIcons = {
	desktop,
	tablet,
	mobile,
};
/**
 * Build the Device Switch control.
 */
export default function DeviceSwitchControl({ compact = false }) {
	const { setPreviewDeviceType } = useDispatch('kadenceblocks/data');
	const deviceType = useSelect((select) => {
		return select('kadenceblocks/data').getPreviewDeviceType();
	}, []);

	const devices = useMemo(() => {
		if (
			kadence_blocks_params.responsive_device_options &&
			kadence_blocks_params.responsive_device_options.length > 0
		) {
			return kadence_blocks_params.responsive_device_options.map((device) => ({
				...device,
				icon:
					typeof device.icon === 'string' && availableIcons[device.icon]
						? availableIcons[device.icon]
						: desktop,
			}));
		}
		return [];
	}, [kadence_blocks_params.responsive_device_options]);
	if (compact) {
		// Get the icon to match the device type
		const currentDeviceIcon = devices.find((device) => device.name === deviceType)?.icon;
		return (
			<DropdownMenu
				className="kbs-device-options-compact kbs-device-button-group"
				icon={currentDeviceIcon}
				label={__('Select Device', 'kadence-blocks')}
			>
				{({ onClose }) => (
					<>
						<MenuGroup>
							{map(devices, ({ name, key, icon, itemClass }) => (
								<MenuItem
									className={`kbs-device-menu-btn ${itemClass}`}
									key={key}
									icon={icon}
									iconPosition="left"
									isSelected={name === deviceType}
									onClick={() => {
										setPreviewDeviceType(capitalizeFirstLetter(name));
										onClose();
									}}
								>
									{capitalizeFirstLetter(name)}
								</MenuItem>
							))}
						</MenuGroup>
					</>
				)}
			</DropdownMenu>
		);
	}
	return (
		<ToggleGroupControl
			className="kbs-device-options kbs-device-button-group"
			hideLabelFromVision={true}
			label={__('Select Device', 'kadence-blocks')}
			onChange={(value) => setPreviewDeviceType(capitalizeFirstLetter(value))}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		>
			{map(devices, ({ name, key, icon, itemClass }) => (
				<ToggleGroupControlOptionIcon
					className={`kbs-device-btn ${itemClass}${name === deviceType ? ' is-active' : ''}`}
					key={key}
					label={capitalizeFirstLetter(name)}
					icon={icon}
					value={name}
				/>
			))}
		</ToggleGroupControl>
	);
}
