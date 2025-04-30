/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import UnitControl from '../unit-control'; // Adjusted path
import { getResolvedValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import InheritanceIndicator from '../inheritance-indicator';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveUnitControl( {
        label,
        customOnChange,
        defaultValue,
        attributeName,
        type = 'lineHeight',
        attributes,
        setAttributes,
        reset = true,
        previewDevice,
        meta,
        globalStylesIds,
        step = 1,
        max = 200,
        min = 0,
        units = [],
	} ) {


        const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue, inheritedType } = getResolvedValue(
            attributeName,
            attributes,
            previewDevice,
            meta,
            type,
            globalStylesIds
        );

        const onReset = () => {
            onChange(defaultValue ?? undefined, 'all', type);
        };
    
        const onChange = (value) => {
            handleAttributeChange(
                value,
                previewDevice,
                attributeName,
                attributes,
                setAttributes,
                customOnChange,
                type,
                meta?.attributes?.[attributeName]
            );
        };


        const controlUnits = units.length > 0 ? units : [
            { value: 'px', label: 'px', default: 10 },
            { value: 'rem', label: 'rem', default: 0.5 },
            { value: 'em', label: 'em', default: 0.5 },
        ];
        
        return (
                <div className={ 'components-base-control kb-responsive-unit-control kadence-unit-control' }>
                    {label && <TitleBar label={label} hasDeviceControls={true} reset={reset} onReset={onReset} />}
                    <div className="kb-responsive-border-control-inner">
                        <UnitControl
                            value={ ( directValue ) }
                            appliedValue={ appliedValue }
                            inheritedValue={ inheritedValue }
                            onChange={ ( size ) => onChange( size ) }
                            defaultValue={ '' }
                            units={ units }
                            max={ max }
                            min={ min }
                            unit={ controlUnits }
                        />
                        <InheritanceIndicator inheritedSource={inheritedSource} inheritedType={inheritedType} />
                    </div>
                </div>
        );
} 