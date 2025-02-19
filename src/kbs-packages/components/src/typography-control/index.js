/**
 * Typography Control Component
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, RangeControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { getDeviceValue, getDeviceAttributeSlug } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import { FontFamily } from './components/font-family';

import { KadenceRadioButtons } from '../radio-button-control';
import { KadencePanelBody } from '../panel-body';
import { DEFAULT_FONT_SIZES, TEXT_TRANSFORM_OPTIONS, FONT_WEIGHTS } from './const';

import './editor.scss';

export function TypographyControl({
    attributes,
    setAttributes,
    attributeName = 'typography',
    label = __('Typography', 'kadence-blocks'),
    previewDevice = 'Desktop',
    type = 'typography',
    initial = {},
    customOnChange,
}) {
    const desktopValue = getDeviceValue(attributeName, attributes, 'Desktop');
    const tabletValue = getDeviceValue(attributeName, attributes, 'Tablet');
    const mobileValue = getDeviceValue(attributeName, attributes, 'Mobile');

    const initialDesktop = (initial?.desktop ? initial.desktop : {});
    const initialTablet = (initial?.tablet ? initial.tablet : initialDesktop);
    const initialMobile = (initial?.mobile ? initial.mobile : initialTablet);

    const inheritedDesktop = initialDesktop;
    const inheritedTablet = (desktopValue ? desktopValue : initialTablet);
    const inheritedMobile = (tabletValue ? tabletValue : (desktopValue ? desktopValue : initialMobile));

    const getFontSizeStep = (device) => {
        const value = getDeviceValue(attributeName, attributes, device);
        return (value?.sizeType || 'px') === 'px' ? 1 : 0.1;
    };

    const getLetterSpacingStep = (device) => {
        const value = getDeviceValue(attributeName, attributes, device);
        return (value?.letterType || 'px') === 'px' ? 1 : 0.1;
    };

    const getLineHeightStep = (device) => {
        const value = getDeviceValue(attributeName, attributes, device);
        return (value?.lineType || 'px') === 'px' ? 1 : 0.1;
    };

    const onChange = (value, device) => {
        if (customOnChange) {
            customOnChange(value, device);
        } else {
            // Deep clone the attributes object to trigger an update.
            const newAttributes = JSON.parse(JSON.stringify(attributes));
            if ('all' === device) {
                newAttributes[attributeName] = value;
            } else {
                const deviceSlug = getDeviceAttributeSlug(device);
                if (!newAttributes[attributeName]) {
                    newAttributes[attributeName] = {};
                }
                newAttributes[attributeName][deviceSlug] = value;
            }
            setAttributes(newAttributes);
        }
    };

    const getCurrentValue = () => {
        return getDeviceValue(attributeName, attributes, previewDevice) || {};
    };

    const onReset = () => {
        onChange(undefined, 'all');
    };

    return (
        <div className={`components-base-control kbs-control kbs-radio-control kbs-radio-control-${type}`}>
            <TitleBar
                label={label}
                reset={true}
                onReset={onReset}
                hasDeviceControls={true}
            />
            <div className="kbs-control-inner">
                <FontFamily
                    attributes={attributes}
                    setAttributes={setAttributes}
                    attributeName={attributeName}
                    previewDevice={previewDevice}
                    initial={initial}
                    customOnChange={customOnChange}
                />

                <SelectControl
                    label={__('Font Weight', 'kadence-blocks')}
                    value={getCurrentValue().weight}
                    options={FONT_WEIGHTS}
                    onChange={(value) => onChange({ weight: value }, previewDevice)}
                    className="kb-font-weight-select"
                />

                {/*<RangeControl
                    label={__('Font Size', 'kadence-blocks')}
                    value={getCurrentValue().size}
                    onChange={(value) => onChange({ size: value }, previewDevice)}
                    min={(getCurrentValue().sizeType || 'px') === 'px' ? 1 : 0.1}
                    max={(getCurrentValue().sizeType || 'px') === 'px' ? 200 : 12}
                    step={getFontSizeStep(previewDevice)}
                    beforeIcon="editor-textcolor"
                    afterIcon="editor-textcolor"
                    allowReset={true}
                />

                <SelectControl
                    label={__('Font Size Unit', 'kadence-blocks')}
                    value={getCurrentValue().sizeType}
                    options={DEFAULT_FONT_SIZES}
                    onChange={(value) => onChange({ sizeType: value }, previewDevice)}
                />

                <RangeControl
                    label={__('Line Height', 'kadence-blocks')}
                    value={getCurrentValue().lineHeight}
                    onChange={(value) => onChange({ lineHeight: value }, previewDevice)}
                    min={(getCurrentValue().lineType || 'px') === 'px' ? 1 : 0.1}
                    max={(getCurrentValue().lineType || 'px') === 'px' ? 200 : 12}
                    step={getLineHeightStep(previewDevice)}
                    allowReset={true}
                />

                <SelectControl
                    label={__('Line Height Unit', 'kadence-blocks')}
                    value={getCurrentValue().lineType}
                    options={DEFAULT_FONT_SIZES}
                    onChange={(value) => onChange({ lineType: value }, previewDevice)}
                />

                <RangeControl
                    label={__('Letter Spacing', 'kadence-blocks')}
                    value={getCurrentValue().letterSpacing}
                    onChange={(value) => onChange({ letterSpacing: value }, previewDevice)}
                    min={(getCurrentValue().letterType || 'px') === 'px' ? -20 : -2}
                    max={(getCurrentValue().letterType || 'px') === 'px' ? 20 : 2}
                    step={getLetterSpacingStep(previewDevice)}
                    allowReset={true}
                />

                <SelectControl
                    label={__('Letter Spacing Unit', 'kadence-blocks')}
                    value={getCurrentValue().letterType}
                    options={DEFAULT_FONT_SIZES}
                    onChange={(value) => onChange({ letterType: value }, previewDevice)}
                />

                <KadenceRadioButtons
                    label={__('Text Transform', 'kadence-blocks')}
                    value={getCurrentValue().textTransform}
                    options={TEXT_TRANSFORM_OPTIONS}
                    onChange={(value) => onChange({ textTransform: value }, previewDevice)}
                    allowReset={true}
                /> */}
            </div>
        </div>
    );
}
