/**
 * Sticky Control (KBS)
 * - Toggle for enabling sticky positioning
 * - Range for top offset when enabled
 */
import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import { getResolvedValue } from '@kadence/kbsHelpers';

export default function StickyControl({
    attributes,
    setAttributes,
    metaData,
    previewDevice,
    globalStylesIds,
    initialOpen = false,
}) {
    const { appliedValue: position } = getResolvedValue(
        'sticky',
        attributes,
        previewDevice,
        metaData,
        'position',
        globalStylesIds
    );
    return (
        <ToolsPanelBody
            title={__('Sticky', 'kadence-blocks')}
            panelName={'kbs-sticky-settings'}
            componentName={'sticky-control'}
            setAttributes={setAttributes}
            attributeName={'sticky'}
            initialOpen={initialOpen}
        >
            <RadioButtonControl
                label={__('Make item sticky', 'kadence-blocks')}
                attributes={attributes}
                setAttributes={setAttributes}
                attributeName={'sticky'}
                type={'position'}
                radioType={'stickyEnabled'}
                previewDevice={previewDevice}
                meta={metaData}
            />
            {position === 'top' && (
                <RadioButtonControl
                    label={__('Sticky offset', 'kadence-blocks')}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    attributeName={'sticky'}
                    type={'offset'}
                    radioType={'stickyOffset'}
                    previewDevice={previewDevice}
                    meta={metaData}
                    min={0}
                    max={2000}
                    step={1}
                    units={[
                        { value: 'px', label: 'px' },
                        { value: 'em', label: 'em' },
                        { value: 'rem', label: 'rem' },
                        { value: 'vh', label: 'vh' },
                    ]}
                />
            )}
        </ToolsPanelBody>
    );
}
