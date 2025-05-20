/**
 * External dependencies
 */
import { debounce } from 'lodash';
import classnames from 'classnames';
import { keyboardReturn, cancelCircleFilled, edit, chevronDown, globe } from '@wordpress/icons';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createRef, useState } from '@wordpress/element';
import { safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { applyFilters } from '@wordpress/hooks';
import { UP, DOWN, ENTER, TAB } from '@wordpress/keycodes';
import { BaseControl, Button, Spinner, ExternalLink } from '@wordpress/components';
import DynamicLinkControl from '../dynamic-link-control';
import TextHighlight from '../text-highlight';
import fetchSearchResults from '../get-post-search-results';

export default function InputSearch(props) {
	const {
		onChange,
		additionalControls = true,
		allowClear = true,
		dynamicAttribute = '',
		placeholder = __('Paste URL or type to search', 'kadence-blocks'),
		className,
		instanceId,
		url = '',
		attributes,
		isSettingsExpanded,
		advancedOptions,
		onExpandSettings,
		context,
	} = props;

	const [search, setSearch] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedSuggestion, setSelectedSuggestion] = useState(null);
	const [suggestionsListboxId, setSuggestionsListboxId] = useState(
		`block-editor-url-input-suggestions-${instanceId}`
	);
	const [suggestionOptionIdPrefix, setSuggestionOptionIdPrefix] = useState(
		`block-editor-url-input-suggestion-${instanceId}`
	);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const autocompleteRef = props.autocompleteRef || createRef();
	const inputRef = createRef();

	const updateSuggestions = (value = '') => {
		setSelectedSuggestion(null);
		setLoading(true);

		const request = fetchSearchResults(value);
		request
			.then((suggestions) => {
				// A fetch Promise doesn't have an abort option. It's mimicked by
				// comparing the request reference in on the instance, which is
				// reset or deleted on subsequent requests or unmounting.
				if (suggestionsRequest !== request) {
					return;
				}
				setSuggestions(suggestions);
				setLoading(false);
				setShowSuggestions(!!suggestions.length);
			})
			.catch(() => {
				if (suggestionsRequest === request) {
					setLoading(false);
				}
			});

		// Note that this assignment is handled *before* the async search request
		// as a Promise always resolves on the next tick of the event loop.
		const suggestionsRequest = request;
	};
	const debouncedUpdateSuggestions = debounce(updateSuggestions, 200);

	const internalOnChange = (event) => {
		const inputValue = event.target.value;
		setSearch(inputValue);
		debouncedUpdateSuggestions(inputValue.trim());
	};

	const onFocus = () => {
		// When opening the link editor, if there's a value present, we want to load the suggestions pane with the results for this input search value
		// Don't re-run the suggestions on focus if there are already suggestions present (prevents searching again when tabbing between the input and buttons)
		if (search && !loading && !(suggestions && suggestions.length)) {
			// Ensure the suggestions are updated with the current input value
			debouncedUpdateSuggestions(search.trim());
		}
	};

	const onKeyDown = (event) => {
		// If the suggestions are not shown or loading, we shouldn't handle the arrow keys
		// We shouldn't preventDefault to allow block arrow keys navigation
		if (!showSuggestions || !suggestions.length || loading) {
			// In the Windows version of Firefox the up and down arrows don't move the caret
			// within an input field like they do for Mac Firefox/Chrome/Safari. This causes
			// a form of focus trapping that is disruptive to the user experience. This disruption
			// only happens if the caret is not in the first or last position in the text input.
			// See: https://github.com/WordPress/gutenberg/issues/5693#issuecomment-436684747
			switch (event.keyCode) {
				// When UP is pressed, if the caret is at the start of the text, move it to the 0
				// position.
				case UP: {
					if (0 !== event.target.selectionStart) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to position 0
						event.target.setSelectionRange(0, 0);
					}
					break;
				}
				// When DOWN is pressed, if the caret is not at the end of the text, move it to the
				// last position.
				case DOWN: {
					if (search.length !== event.target.selectionStart) {
						event.stopPropagation();
						event.preventDefault();

						// Set the input caret to the last position
						event.target.setSelectionRange(search.length, search.length);
					}
					break;
				}
			}

			return;
		}

		const suggestion = suggestions[selectedSuggestion];

		switch (event.keyCode) {
			case UP: {
				event.stopPropagation();
				event.preventDefault();
				const previousIndex = !selectedSuggestion ? suggestions.length - 1 : selectedSuggestion - 1;
				setSelectedSuggestion(previousIndex);
				break;
			}
			case DOWN: {
				event.stopPropagation();
				event.preventDefault();
				const nextIndex =
					selectedSuggestion === null || selectedSuggestion === suggestions.length - 1
						? 0
						: selectedSuggestion + 1;
				setSelectedSuggestion(nextIndex);
				break;
			}
			case TAB: {
				if (selectedSuggestion !== null) {
					selectPost(suggestion);
					// Announce a link has been selected when tabbing away from the input field.
					props.speak(__('Link selected.'));
				}
				break;
			}
			case ENTER: {
				if (selectedSuggestion !== null) {
					event.stopPropagation();
					selectPost(suggestion);
				}
				break;
			}
		}
	};

	const selectPost = (suggestion) => {
		onChange(suggestion.url, suggestion);
		setIsEditing(false);
		setSelectedSuggestion(null);
		setShowSuggestions(false);
	};

	const handleOnClick = (suggestion) => {
		selectPost(suggestion);
	};

	const renderSettings = () => {
		return (
			<>
				{additionalControls && isSettingsExpanded && (
					<div className="kb-link-control-additional-controls">{advancedOptions}</div>
				)}
			</>
		);
	};
	const renderControl = () => {
		const controlProps = {
			id: `url-input-control-${instanceId}`,
			className: 'kb-search-selection-name',
		};

		const inputProps = {
			value: search || url,
			required: true,
			className: 'kb-search-selection-input',
			type: 'text',
			onChange: internalOnChange,
			onFocus: onFocus,
			placeholder,
			onKeyDown: onKeyDown,
			role: 'combobox',
			'aria-label': __('URL Input or Search', 'kadence-blocks'),
			'aria-expanded': showSuggestions,
			'aria-autocomplete': 'list',
			'aria-owns': suggestionsListboxId,
			'aria-activedescendant':
				selectedSuggestion !== null ? `${suggestionOptionIdPrefix}-${selectedSuggestion}` : undefined,
			ref: inputRef,
		};
		return (
			<>
				<div className="kb-side-link-control-inner-row">
					{url && !isEditing && (
						<div className={'kb-search-selection-name'}>
							{applyFilters(
								'kadence.linkDisplay',
								<>
									<div
										className={
											'block-editor-url-popover__link-viewer block-editor-format-toolbar__link-container-content'
										}
									>
										{!url ? (
											<span></span>
										) : (
											<ExternalLink href={url}>
												{filterURLForDisplay(safeDecodeURI(url))}
											</ExternalLink>
										)}
										<Button
											icon={edit}
											label={__('Edit', 'kadence-blocks')}
											onClick={() => {
												if (search) {
													debouncedUpdateSuggestions(search);
												}
												setIsEditing(true);
											}}
										/>
									</div>
								</>,
								attributes,
								dynamicAttribute,
								undefined,
								context
							)}
						</div>
					)}
					{(!url || isEditing) && (
						<BaseControl {...controlProps}>
							<div className="kb-search-url-input">
								<input {...inputProps} />
							</div>
							{loading && <Spinner />}
							{allowClear && !search && url && (
								<Button
									className="kb-search-url-clear"
									icon={cancelCircleFilled}
									label={__('Clear', 'kadence-blocks')}
									onClick={() => {
										onChange('', '');
										setIsEditing(false);
										setSelectedSuggestion(null);
										setShowSuggestions(false);
									}}
								/>
							)}
							<Button
								className="kb-search-url-submit"
								icon={keyboardReturn}
								label={__('Submit', 'kadence-blocks')}
								onClick={() => {
									onChange(search || url, '');
									setIsEditing(false);
									setSelectedSuggestion(null);
									setShowSuggestions(false);
								}}
							/>
						</BaseControl>
					)}
					{dynamicAttribute && window?.kbs_params?.dynamic_enabled && <DynamicLinkControl {...props} />}
					{additionalControls && (
						<Button
							className="kb-link-settings-toggle"
							icon={chevronDown}
							label={__('Link settings', 'kadence-blocks')}
							onClick={onExpandSettings}
							aria-expanded={isSettingsExpanded}
						/>
					)}
				</div>
			</>
		);
	};

	const renderSuggestions = () => {
		const suggestionsListProps = {
			id: suggestionsListboxId,
			ref: autocompleteRef,
			role: 'listbox',
		};
		const directLinkEntryTypes = ['url', 'mailto', 'tel', 'internal'];
		const buildSuggestionItemProps = (suggestion, index) => {
			return {
				role: 'option',
				tabIndex: '-1',
				id: `${suggestionOptionIdPrefix}-${index}`,
				'aria-selected': index === selectedSuggestion,
			};
		};
		if (showSuggestions && !!suggestions.length) {
			return (
				<div className="kb-search-selection-list">
					<div
						{...suggestionsListProps}
						className={classnames('kb-search-selection-suggestions', `${className}__suggestions`)}
					>
						{suggestions.map((suggestion, index) => (
							<Button
								{...buildSuggestionItemProps(suggestion, index)}
								key={suggestion.id}
								className={classnames('kb-search-selection-suggestion', {
									'is-selected': index === selectedSuggestion,
								})}
								onClick={() => handleOnClick(suggestion)}
							>
								{directLinkEntryTypes.includes(suggestion.type.toLowerCase()) && (
									<Icon className="block-editor-link-control__search-item-icon" icon={globe} />
								)}
								<span className="kb-search-selection-search-item-header">
									<span className="kb-search-selection-search-item-title">
										<TextHighlight text={suggestion.title} highlight={search} />
									</span>
									<span
										aria-hidden={!directLinkEntryTypes.includes(suggestion.type.toLowerCase())}
										className="kb-search-selection-search-item-info"
									>
										{!directLinkEntryTypes.includes(suggestion.type.toLowerCase()) &&
											(filterURLForDisplay(safeDecodeURI(suggestion.url)) || '')}
										{directLinkEntryTypes.includes(suggestion.type.toLowerCase()) &&
											__('Press ENTER to add this link')}
									</span>
								</span>
								<span className="kb-search-selection-search-item-type">
									{suggestion.type === 'post_tag' ? 'tag' : suggestion.type}
								</span>
							</Button>
						))}
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<>
			{renderControl()}
			{renderSuggestions()}
			{renderSettings()}
		</>
	);
}
