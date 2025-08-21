import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import FontWeight from './font-weight';

export default function FamilyAppearance({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
}) {
	return (
		<div className="components-base-control">
			<SelectControl
				label={__('Font Family', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
				previewDevice={previewDevice}
				type={'fontFamily'}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>
			<FontWeight
				label={__('Appearance', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>
		</div>
	);
}
