import SelectControl from '../../select-control';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import RadioButtonControl from '../../radio-button-control';

export default function LinkStyle({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
	forPresetControl,
}) {
	const [currentView, setCurrentView] = useState('normal');
	const onSelectView = (view) => {
		setCurrentView(view);
	};

	return (
		<div>
			{/* {!forPresetControl && (
				<SelectControl
					label={__('Preset', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={meta}
					previewDevice={'none'}
					type={'preset'}
					globalStylesIds={globalStylesIds}
					customOnChange={customOnChange}
					forStyleBook={forStyleBook}
					hasDeviceControls={false}
				/>
			)} */}

			<RadioButtonControl
				label={__('Style', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'textDecoration'}
				previewDevice={previewDevice}
				meta={meta}
				view={currentView}
			/>
		</div>
	);
}
