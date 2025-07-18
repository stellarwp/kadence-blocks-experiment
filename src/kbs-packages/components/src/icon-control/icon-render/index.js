/**
 * Icon Render Component
 *
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Icon Render Component using Redux store
 *
 * @param {Object} props - The component props.
 * @param {string} props.attributeName - The name of the attribute to render.
 * @param {Object} props.attributes - The attributes of the component.
 * @param {string} props.name - The name of the icon to render.
 *
 * @returns {JSX.Element} The rendered icon component.
 */
function IconRender(props) {
	const { attributeName, attributes, className, ariaHidden } = props;

	const iconName = attributes[attributeName]?.desktop?.icon;
	const iconSize = attributes[attributeName]?.desktop?.iconSize || 24;
	const iconTitle = attributes[attributeName]?.desktop?.title;
	const iconTooltip = attributes[attributeName]?.desktop?.tooltipContent;
	const iconTooltipPlacement = attributes[attributeName]?.desktop?.tooltipPlacement;
	const iconTooltipDash = attributes[attributeName]?.desktop?.tooltipDash;

	const iconClasses = ['kt-svg-icon-wrap'];
	if (className) {
		iconClasses.push(className);
	}
	if (iconName) {
		iconClasses.push(`kt-svg-icon-${iconName}`);
	}
	if (iconSize === 0) {
		iconClasses.push('kb-icon-transparent');
	}

	if (iconTooltipDash) {
		iconClasses.push('kbs-icon-tooltip-dash');
	}
	const iconClassNameString = iconClasses.join(' ');

	const { icons, areIconsLoaded } = useSelect((select) => {
		const rawIcons = select('kadenceblocks/data').getIcons();

		return {
			icons: applyFilters('kadence.icon_options', rawIcons.combinedIcons),
			areIconsLoaded: select('kadenceblocks/data').areIconsLoaded(),
		};
	}, []);

	const { fetchIcons } = useDispatch('kadenceblocks/data');

	// Fetch icons if not loaded
	useEffect(() => {
		if (!areIconsLoaded) {
			fetchIcons();
		}
	}, [areIconsLoaded]);

	if (!iconName) {
		return null;
	}

	if (!areIconsLoaded || !icons || !icons[iconName]) {
		return <Spinner />;
	}

	return (
		<GenIcon
			name={iconName}
			icon={icons[iconName]}
			title={iconTitle}
			className={iconClassNameString}
			ariaHidden={ariaHidden}
		/>
	);
}

export default IconRender;
