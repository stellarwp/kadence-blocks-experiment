/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BusinessInfoStep from './business-info-step';
import ToneSelectionStep from './tone-selection-step';
import ImageCollectionStep from './image-collection-step';
import { STORE_NAME } from '../../store';

const AIWizard = ({ onComplete, onClose }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const { setAIContext, setImageCollection } = useDispatch(STORE_NAME);
	const aiContext = useSelect((select) => select(STORE_NAME).getAIContext(), []);

	const steps = [
		{
			title: __('Business Information', 'kadence-blocks'),
			component: BusinessInfoStep,
		},
		{
			title: __('Content Tone', 'kadence-blocks'),
			component: ToneSelectionStep,
		},
		{
			title: __('Image Collection', 'kadence-blocks'),
			component: ImageCollectionStep,
		},
	];

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const CurrentStepComponent = steps[currentStep].component;

	return (
		<Modal
			title={__('AI Content Setup', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kadence-ai-wizard-modal"
		>
			<div className="kadence-ai-wizard-header">
				<h2>{steps[currentStep].title}</h2>
				<p>
					{__('Step', 'kadence-blocks')} {currentStep + 1} {__('of', 'kadence-blocks')} {steps.length}
				</p>
			</div>

			<div className="kadence-ai-wizard-content">
				<CurrentStepComponent />
			</div>

			<div className="kadence-ai-wizard-actions">
				{currentStep > 0 && (
					<Button variant="secondary" onClick={handlePrevious}>
						{__('Previous', 'kadence-blocks')}
					</Button>
				)}

				<Button variant="primary" onClick={handleNext}>
					{currentStep === steps.length - 1
						? __('Complete Setup', 'kadence-blocks')
						: __('Next', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
};

export default AIWizard;
