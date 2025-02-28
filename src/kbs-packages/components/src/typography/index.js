import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';

export default function Typography({ label, attributes, setAttributes, meta, previewDevice, attributeName, globalStylesJson }) {

    return (
        <div>
            <SelectControl
                label={__('Font Family', 'kadence-blocks')}
                attributes={attributes}
                setAttributes={setAttributes}
                attributeName={ attributeName }
                meta={meta}
                previewDevice={previewDevice}
                type="fontFamily"
                globalStylesJson={globalStylesJson}
            />

            {/* <SelectControl
                label={__('Font Weight', 'kadence-blocks')}
                attributes={attributes}
                setAttributes={setAttributes}
                attributeName={ attributeName }
                meta={meta}
                previewDevice={previewDevice}
                type="fontWeight"
            /> */}

            {/* Font Variant */}

            {/* Font Size */}

            {/* Line Height */}

            {/* Letter Spacing */}
        </div>
    );
}
