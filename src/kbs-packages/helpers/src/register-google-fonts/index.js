import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useEffect } from '@wordpress/element';

/**
 * Register Google Fonts from block attributes
 * @param {Object} attributes - Block attributes
 * @param {Object} attributesMeta - Block attributes metadata
 */
export default function registerGoogleFonts(props, metadata) {
	const { attributes, clientId } = props;
	const attributesMeta = metadata?.attributes;
	const { addGoogleFont } = useDispatch('kadenceblocks/data');
	// Get the select function once
	const select = useSelect((select) => select, [clientId]);
	// Memoize the functions to prevent unnecessary re-renders
	const { isUniqueGoogleFont } = useMemo(
		() => ({
			isUniqueGoogleFont: (fontFamily, fontData) =>
				select('kadenceblocks/data').isUniqueGoogleFont(fontFamily, fontData),
		}),
		[select, clientId]
	);
	const maybeAddGoogleFont = (fontFamily, fontData) => {
		if (!isUniqueGoogleFont(fontFamily, fontData)) {
			return;
		}
		addGoogleFont(fontFamily, fontData);
	};
	useEffect(() => {
		if (attributes && attributesMeta) {
			// Loop through attributesMeta to find typography properties
			Object.entries(attributesMeta).forEach(([key, meta]) => {
				if (meta.component === 'typography') {
					const typographyValues = attributes[key];

					if (typographyValues) {
						Object.values(typographyValues).forEach((value) => {
							if (value?.fontFamily && value?.fontSource === 'google') {
								if (value.fontVariable) {
									maybeAddGoogleFont(value.fontFamily, {
										weight: value?.fontWeight,
										style: value?.fontStyle,
										variable: value?.fontVariable,
									});
								} else {
									maybeAddGoogleFont(value.fontFamily, {
										weight: value?.fontWeight || '',
										style: value?.fontStyle || '',
										variable: undefined,
									});
								}
							}
						});
					}
				}
			});
		}
	}, [clientId, attributes]);
}
/**
 * Creates or keeps a uniqueId for a block depending on it's status.
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 */
export function uniqueIdHelper(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const { addUniqueID } = useDispatch('kadenceblocks/data');

	// Get the select function once
	const select = useSelect((select) => select, [clientId]);

	// Memoize the functions to prevent unnecessary re-renders
	const { isUniqueID, isUniqueBlock, parentData } = useMemo(
		() => ({
			isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
			isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
			parentData: {
				rootBlock: select('core/block-editor').getBlock(
					select('core/block-editor').getBlockHierarchyRootClientId(clientId)
				),
				postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
				reusableParent: select('core/block-editor').getBlockAttributes(
					select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
				),
				editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
			},
		}),
		[select, clientId]
	);

	const updateUniqueID = (newUniqueID) => {
		if (!isUniqueID(newUniqueID)) {
			// Solves for rare case where the client id matches enough that our unique id is not unique.
			newUniqueID = uniqueId(newUniqueID);
		}
		// Set the unique ID in the attributes and the store. On the attribute variable is important for race conditions.
		attributes.uniqueID = newUniqueID;
		setAttributes({ uniqueID: newUniqueID });
		addUniqueID(newUniqueID, clientId);
	};
	useEffect(() => {
		const { postId, reusableParent, rootBlock, editedPostId } = parentData;
		let blockPostId = getPostOrWidgetId(props, postId, reusableParent, 0);
		if (blockPostId === 0) {
			// Try getting the FSE template slug.
			if (get(rootBlock, 'name') === 'core/template-part' && has(rootBlock, ['attributes', 'slug'])) {
				blockPostId = hashString(rootBlock.attributes.slug) % 1000000;
			} else if (editedPostId) {
				blockPostId = hashString(editedPostId) % 1000000;
			}
		}

		const hasBlockPostIdPrefix = attributes?.uniqueID && attributes?.uniqueID.split('_').length === 2;
		const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
		const newUniqueID = blockPostIdPrefix + clientId.substr(2, 9);

		if (
			!attributes?.uniqueID ||
			(hasBlockPostIdPrefix && attributes?.uniqueID.split('_')[0] !== blockPostId.toString())
		) {
			// New block
			return updateUniqueID(newUniqueID);
		} else if (!isUniqueID(attributes?.uniqueID) && !isUniqueBlock(attributes?.uniqueID, clientId)) {
			// This checks if we are just switching views, client ID the same means we don't need to update but otherwise we assume it's a duplicate block.
			return updateUniqueID(newUniqueID);
		}
		// This just logs the block in the store and it doesn't need to be updated.
		addUniqueID(attributes?.uniqueID, clientId);
	}, [clientId]);
}
