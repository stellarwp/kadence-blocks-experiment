import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import FontWeight from './font-weight';
export default function Typography({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	mergedGlobalStyle,
	customOnChange,
	forStyleBook,
}) {
	return (
		<div>
			<SelectControl
				label={__('Font Family', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
				previewDevice={previewDevice}
				type={'fontFamily'}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<FontWeight
				label={__('Font Weight', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			{/* Font Variant */}

			{/* Font Size */}

			{/* Line Height */}

			{/* Letter Spacing */}
		</div>
	);
}
