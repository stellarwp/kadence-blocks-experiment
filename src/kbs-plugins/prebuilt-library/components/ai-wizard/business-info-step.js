/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store';

const BusinessInfoStep = () => {
	const { updateAIContextField } = useDispatch(STORE_NAME);
	const aiContext = useSelect((select) => select(STORE_NAME).getAIContext(), []);

	return (
		<div className="kadence-ai-wizard-business-info">
			<TextControl
				label={__('Business Name', 'kadence-blocks')}
				value={aiContext.businessName || ''}
				onChange={(value) => updateAIContextField('businessName', value)}
				placeholder={__('Enter your business name', 'kadence-blocks')}
			/>

			<TextControl
				label={__('Business Type', 'kadence-blocks')}
				value={aiContext.businessType || ''}
				onChange={(value) => updateAIContextField('businessType', value)}
				placeholder={__('e.g., Restaurant, Law Firm, Fitness Studio', 'kadence-blocks')}
			/>

			<TextareaControl
				label={__('Business Description', 'kadence-blocks')}
				value={aiContext.businessDescription || ''}
				onChange={(value) => updateAIContextField('businessDescription', value)}
				placeholder={__('Briefly describe what your business does…', 'kadence-blocks')}
				rows={4}
			/>

			<TextControl
				label={__('Keywords', 'kadence-blocks')}
				value={aiContext.keywords || ''}
				onChange={(value) => updateAIContextField('keywords', value)}
				placeholder={__('Enter keywords separated by commas', 'kadence-blocks')}
				help={__('Keywords help generate more relevant content', 'kadence-blocks')}
			/>

			<TextControl
				label={__('Location', 'kadence-blocks')}
				value={aiContext.location || ''}
				onChange={(value) => updateAIContextField('location', value)}
				placeholder={__('City, State/Country', 'kadence-blocks')}
			/>
		</div>
	);
};

export default BusinessInfoStep;
