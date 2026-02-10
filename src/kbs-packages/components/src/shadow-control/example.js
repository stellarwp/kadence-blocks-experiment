/**
 * Example usage of the ShadowControl component
 */

import ShadowControl from './layered-shadow-control';

// Example usage in a block or component
function ExampleShadowControl() {
	const [attributes, setAttributes] = useState({
		boxShadow: {
			color: '#000000',
			x: '2px',
			y: '2px',
			blur: '4px',
			spread: '0px',
			inset: false,
		},
		textShadow: {
			color: '#333333',
			x: '1px',
			y: '1px',
			blur: '2px',
		},
	});

	return (
		<div>
			{/* Box Shadow Control */}
			<ShadowControl
				title={__('Box Shadow', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName="boxShadow"
				previewDevice="Desktop"
				type="boxShadow"
			/>

			{/* Text Shadow Control */}
			<ShadowControl
				title={__('Text Shadow', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName="textShadow"
				previewDevice="Desktop"
				type="textShadow"
			/>
		</div>
	);
}

export default ExampleShadowControl;
