/**
 * Focal Point control.
 */
import { useState, useCallback } from '@wordpress/element';
import { FocalPointPicker as CoreFocalPointPicker } from '@wordpress/components';
import './editor.scss';
/**
 * Focal Point control
 *
 * @param {Object} props Component props.
 * @param {string} props.url The image URL.
 * @param {string} props.value The current focal point value.
 * @param {Function} props.onChange Callback when focal point changes.
 * @returns {JSX.Element} The focal point picker component.
 */
export default function FocalPointPicker(props) {
	const { url, value, onChange, backgroundSize = 'cover', style, ...rest } = props;
	const [position, setPosition] = useState(null);

	const convertPosition = useCallback((position) => {
		if (!position) {
			return { x: 0.5, y: 0.5 };
		}

		let positionX = 0.5;
		let positionY = 0.5;
		const positionArray = position.split(' ');

		if (positionArray?.[0]) {
			switch (positionArray[0]) {
				case 'left':
					positionX = 0;
					break;
				case 'right':
					positionX = 1;
					break;
				case 'center':
					positionX = 0.5;
					break;
				default:
					positionX = parseInt(positionArray[0], 10) / 100;
					break;
			}
		}

		if (positionArray?.[1]) {
			switch (positionArray[1]) {
				case 'top':
					positionY = 0;
					break;
				case 'bottom':
					positionY = 1;
					break;
				case 'center':
					positionY = 0.5;
					break;
				default:
					positionY = parseInt(positionArray[1], 10) / 100;
					break;
			}
		}

		return { x: positionX, y: positionY };
	}, []);

	const onPositionChange = useCallback(
		(newPosition) => {
			setPosition(newPosition);

			if (newPosition && newPosition.x !== undefined && newPosition.x !== '') {
				const focalPoint = `${newPosition.x * 100}% ${newPosition.y * 100}%`;
				onChange(focalPoint);
			}
		},
		[onChange]
	);

	const imagePosition = position ?? convertPosition(value);

	return (
		<div
			className="kbs-focal-point-picker"
			style={{ '--focal-size': backgroundSize, '--focal-position': value, ...style }}
		>
			<CoreFocalPointPicker url={url} value={imagePosition} onChange={onPositionChange} {...rest} />
		</div>
	);
}
