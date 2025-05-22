// import {
// 	HsvaColor,
// 	hsvaToRgbaString,
// 	color as handleColor,
// 	validHex,
// 	hexToHsva,
// 	hsvaToHex,
// 	hsvaToHexa,
// } from '@uiw/color-convert';

import { Chrome } from '@uiw/react-color';

const ColorPicker = ({ color, onChange }) => {
	return (
		<Chrome
			color={color ? color : '#ffffff'}
			className="kbs-color-picker"
			style={{
				width: '100%',
				border: '0px',
				boxShadow: 'none',
				'--github-border': '0px',
				'--github-background-color': 'transparent',
				'--github-box-shadow': 'none',
				'--github-arrow-border-color': 'transparent',
				'--chrome-arrow-fill': 'var(--wp-components-color-foreground, #1e1e1e)',
				'--chrome-arrow-background-color': 'transparent',
			}}
			inputType="hexa"
			showEditableInput={true}
			showEyeDropper={true}
			showColorPreview={true}
			onChange={(color) => {
				if (color?.rgba?.a === 1) {
					onChange(color.hex);
				} else {
					onChange(color.hexa);
				}
			}}
		/>
	);
};
export default ColorPicker;
