/**
 * WordPress dependencies
 */
import { RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store';

const ToneSelectionStep = () => {
	const { updateAIContextField } = useDispatch( STORE_NAME );
	const tone = useSelect( 
		select => select( STORE_NAME ).getAIContextField( 'tone' ), 
		[] 
	);

	const toneOptions = [
		{
			label: __( 'Professional', 'kadence-blocks' ),
			value: 'professional',
			description: __( 'Formal, authoritative, and business-oriented', 'kadence-blocks' ),
		},
		{
			label: __( 'Friendly', 'kadence-blocks' ),
			value: 'friendly',
			description: __( 'Warm, approachable, and conversational', 'kadence-blocks' ),
		},
		{
			label: __( 'Casual', 'kadence-blocks' ),
			value: 'casual',
			description: __( 'Relaxed, informal, and easy-going', 'kadence-blocks' ),
		},
		{
			label: __( 'Inspirational', 'kadence-blocks' ),
			value: 'inspirational',
			description: __( 'Motivating, uplifting, and encouraging', 'kadence-blocks' ),
		},
		{
			label: __( 'Playful', 'kadence-blocks' ),
			value: 'playful',
			description: __( 'Fun, creative, and lighthearted', 'kadence-blocks' ),
		},
	];

	return (
		<div className="kadence-ai-wizard-tone-selection">
			<p>{ __( 'Select the tone that best matches your brand voice:', 'kadence-blocks' ) }</p>
			
			<RadioControl
				selected={ tone || 'professional' }
				options={ toneOptions.map( option => ({
					label: (
						<div>
							<strong>{ option.label }</strong>
							<br />
							<small>{ option.description }</small>
						</div>
					),
					value: option.value,
				}) ) }
				onChange={ ( value ) => updateAIContextField( 'tone', value ) }
			/>
		</div>
	);
};

export default ToneSelectionStep;