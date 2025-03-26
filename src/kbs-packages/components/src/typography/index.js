import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import FontWeight from './font-weight';
export default function Typography({
	label,
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesJson,
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
				type="fontFamily"
				globalStylesJson={globalStylesJson}
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
				globalStylesJson={globalStylesJson}
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
