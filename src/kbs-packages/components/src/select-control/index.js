/**
 * ResponsiveSelect Control
 */

/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * External dependencies
 */
import Select from 'react-select';

// RTL configuration is determined once at module load
const IS_RTL = isRTL();

/**
 * Internal dependencies
 */
import {
	getDeviceValue,
	getResolvedValue,
	handleAttributeChange,
	GlobalStylesContext
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import { DOT_STYLES } from './constants';
import { getPlaceholderLabel, useSelectOptions } from './helpers';
import './editor.scss';

/**
 * Custom styles for the Select component
 */
const getCustomStyles = (isInherited) => ({
	placeholder: (styles) => ({
		...styles,
		...(isInherited && DOT_STYLES),
		color: `var(--kb-text-color-opacity, rgba(0, 0, 0, ${isInherited ? 0.6 : 1.0}))`,
	}),
});

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectControl({
	label,
	customOnChange,
	defaultValue,
	attributeName,
	type = 'fontFamily',
	attributes,
	setAttributes,
	reset = true,
	previewDevice,
	meta,
	mergedGlobalStyle,
	forStyleBook,
	hasDeviceControls = true
}) {
	const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue } = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type,
		mergedGlobalStyle
	);

	const customStyles = useMemo(() => getCustomStyles(isInherited), [isInherited]);
	const attributeMeta = meta?.attributes?.[attributeName];

	const { options, isLoadingOptions, loadingMessage } = useSelectOptions({
		type,
		attributes,
		attributeName,
		previewDevice,
		attributeMeta,
		appliedValue,
		mergedGlobalStyle,
		forStyleBook
	});

	const inheritedPlaceholderLabel = getPlaceholderLabel(directValue, inheritedValue, type, options);

	const onReset = () => {
		onChange(defaultValue ?? undefined, ( type === 'preset' ? 'none' : 'all'), type);
	};

	const onChange = (value, device, type) => {
		let updatedAttributes = value;

		switch (type) {
			case 'fontFamily': {
				if (value === undefined) {
					updatedAttributes = {
						[type]: undefined,
						['fontSource']: undefined,
						['fontWeight']: undefined,
					};
					break;
				}

				// Set the font source too
				const selectedOption = options.flatMap((group) => group.options).find((option) => option.value === value);
				updatedAttributes = {
					[type]: value,
					['fontSource']: selectedOption.source,
				};

				break;
			}
			default:
				break;
		}

		handleAttributeChange(
			updatedAttributes,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			attributeMeta
		);
	};

	return (
		<div className={`components-base-control kbs-${type}-select-control`}>
			{label && <TitleBar label={label} hasDeviceControls={hasDeviceControls} reset={reset} onReset={onReset} />}
			<div className="kbs-select-control-inner">
				<Select
					key={previewDevice + appliedValue}
					isClearable={!isInherited}
					value={
						directValue
							? options.flatMap((opt) => opt.options || []).find((opt) => opt.value === directValue)
							: null
					}
					options={options}
					onChange={(selectedOption) => onChange(selectedOption?.value, previewDevice, type)}
					className="kb-select-control"
					styles={customStyles}
					placeholder={inheritedPlaceholderLabel}
					isSearchable={true}
					isLoading={isLoadingOptions}
					loadingMessage={() => loadingMessage}
					noOptionsMessage={() => __('No results', 'kadence-blocks')}
					isRtl={IS_RTL}
				/>
				<div className="kbs-select-control-inherited-source">
					<em>Source: {inheritedSource}</em>
				</div>
			</div>
		</div>
	);
}
