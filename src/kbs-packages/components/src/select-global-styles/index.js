/**
 * ResponsiveSelect Control
 */

/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';

/**
 * External dependencies
 */
import Select, { components } from 'react-select';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrowRight } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

// RTL configuration is determined once at module load
const IS_RTL = isRTL();

/**
 * Internal dependencies
 */
import { useSelectOptions } from './helpers';
import { useGlobalStylesIds } from '@kadence/kbsHelpers';
import { useMemo } from '@wordpress/element';
import SelectStyled from '../select-styled';
import './editor.scss';

function DraggableMultiValue(props) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.data.value });

	const style = {
		...props.getStyles('multiValue', props),
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: 'grab',
		backgroundColor: 'var(--wp-components-color-background-inverted, #1e1e1e)',
		margin: 0,
	};

	/* prevent simple clicks on a chip from re-opening the menu while still
	   allowing keyboard focus */
	const onMouseDown = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<div
			className="kbs-global-style-select-control-draggable-multi-value"
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onMouseDown={onMouseDown}
		>
			<components.MultiValue {...props} />
		</div>
	);
}

export const SortableMultiSelect = ({ value, onChange, ...rest }) => {
	/* dnd-kit sensors */
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	/* `id`s fed to <SortableContext> must reflect the current order */
	const ids = useMemo(() => value.map((v) => v.value), [value]);

	/* When the drag ends, swap the chips in the array */
	const handleDragEnd = ({ active, over }) => {
		if (!over || active.id === over.id) {
			return;
		}
		const oldIndex = ids.indexOf(active.id);
		const newIndex = ids.indexOf(over.id);
		onChange(arrayMove(value, oldIndex, newIndex));
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={ids} strategy={verticalListSortingStrategy}>
				<SelectStyled
					isMulti /* keeps the chips */
					closeMenuOnSelect={false}
					components={{ MultiValue: DraggableMultiValue }}
					value={value}
					onChange={(next) => onChange(next)}
					{...rest}
				/>
			</SortableContext>
		</DndContext>
	);
};
/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectGlobalStyles({
	attributes,
	setAttributes,
	isMulti = true,
	forStyleBook = false,
	isSortable = true,
}) {
	const { options, isLoadingOptions } = useSelectOptions({ forStyleBook });
	const globalStylesIds = useGlobalStylesIds();
	const inheritGlobalStyles = useMemo(() => {
		// Get current style IDs (always an array)
		const currentStyleIdsArray = attributes.globalStyleIds || [];

		// If no current styles, return all inherited styles
		if (currentStyleIdsArray.length === 0) {
			return globalStylesIds;
		}

		// Check if the current styles appear at the end of globalStylesIds and in the same order
		const globalStylesIdsLength = globalStylesIds.length;
		const currentStylesLength = currentStyleIdsArray.length;

		// If current styles are longer than all styles, they can't be at the end
		if (currentStylesLength > globalStylesIdsLength) {
			return globalStylesIds;
		}

		// Check if the last elements of globalStylesIds match currentStyleIdsArray
		let matchesAtEnd = true;
		for (let i = 0; i < currentStylesLength; i++) {
			const globalStylesIndex = globalStylesIdsLength - currentStylesLength + i;
			// Convert to string for comparison since IDs might be numbers or strings
			if (globalStylesIds[globalStylesIndex]?.toString() !== currentStyleIdsArray[i].toString()) {
				matchesAtEnd = false;
				break;
			}
		}

		// If they match at the end, remove them from the inherited styles
		if (matchesAtEnd) {
			return globalStylesIds.slice(0, globalStylesIdsLength - currentStylesLength);
		}

		// Otherwise return all global styles
		return globalStylesIds;
	}, [attributes.globalStyleIds, globalStylesIds]);

	// Find selected options based on the IDs
	const selectedOptions =
		(attributes.globalStyleIds || []).length > 0
			? isSortable
				? attributes.globalStyleIds.map((id) => options.find((option) => option.value === id)).filter(Boolean)
				: options.filter((option) => attributes.globalStyleIds.includes(option.value))
			: [];
	// Find inherited style options
	const inheritedStyleOptions = inheritGlobalStyles.map((id) => {
		const idStr = id.toString();
		return (
			options.find((opt) => opt.value === idStr) || { value: idStr, label: __('Unknown Style', 'kadence-blocks') }
		);
	});

	return (
		<div className="components-base-control kbs-global-style-select-control">
			<div className="kbs-global-style-select-control-inner">
				{isMulti && isSortable ? (
					<SortableMultiSelect
						value={selectedOptions}
						options={options}
						onChange={(selectedOption) => {
							if (Array.isArray(selectedOption)) {
								// Need to maintain the order of the selected options.
								setAttributes({ globalStyleIds: selectedOption.map((option) => option.value) });
							} else if (selectedOption) {
								setAttributes({ globalStyleIds: [selectedOption.value] });
							} else {
								setAttributes({ globalStyleIds: [] });
							}
						}}
						className="kb-select-control"
						placeholder={__('Select Global Style', 'kadence-blocks')}
						isSearchable={true}
						isLoading={isLoadingOptions}
						noOptionsMessage={() => __('No results', 'kadence-blocks')}
						isRtl={IS_RTL}
					/>
				) : (
					<SelectStyled
						value={selectedOptions}
						options={options}
						onChange={(selectedOption) => {
							if (Array.isArray(selectedOption)) {
								setAttributes({ globalStyleIds: selectedOption.map((option) => option.value) });
							} else if (selectedOption) {
								setAttributes({ globalStyleIds: [selectedOption.value] });
							} else {
								setAttributes({ globalStyleIds: [] });
							}
						}}
						className="kb-select-control"
						placeholder={__('Select Global Style', 'kadence-blocks')}
						isSearchable={true}
						isLoading={isLoadingOptions}
						noOptionsMessage={() => __('No results', 'kadence-blocks')}
						isRtl={IS_RTL}
						isMulti={isMulti}
					/>
				)}
			</div>

			{inheritedStyleOptions.length > 0 && (
				<div className="kbs-global-style-inherited-section">
					<h3 className="kbs-global-style-inherited-heading">
						{__('Inherited Global Styles', 'kadence-blocks')}
					</h3>
					<div className="kbs-global-style-inherited-list">
						{inheritedStyleOptions.map((option) => (
							<div key={option.value} className="kbs-global-style-inherited-item">
								<span className="kbs-global-style-inherited-icon">
									<Icon icon={arrowRight} size={16} />
								</span>
								<span className="kbs-global-style-inherited-label">{option.label}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
