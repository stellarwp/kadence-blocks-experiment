import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { Button } from '@wordpress/components';

import { BLOCK_COMPONENTS, BackgroundPresetRender } from '@kadence/kbsComponents';
import { getPresetOptions } from '@kadence/kbsHelpers';

/**
 * Build the component preset
 */
export default function PresetTitleBar(props) {
	const { selectedComponent, currentPreset } = props;

	const presets = getPresetOptions(selectedComponent);

	const presetLabel = useMemo(() => {
		const presetData = presets.find((p) => p.value === currentPreset);
		return presetData?.label;
	}, [presets, currentPreset]);
	return (
		<div className="kbs-control kbs-preset-title-bar">
			<div className="kbs-control-inner">
				<div className="kbs-preset-control-title">{presetLabel}</div>
			</div>
		</div>
	);
}
