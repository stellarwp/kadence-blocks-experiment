/**
 * WordPress dependencies
 */
import { __experimentalGrid as Grid, Card, CardBody, CardMedia, Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useTemplateData } from '../hooks/use-template-data';
import TemplatePreview from './template-preview';

const TemplateLibrary = ({ searchTerm, onSelect }) => {
	const [selectedType, setSelectedType] = useState('all');
	const [previewTemplate, setPreviewTemplate] = useState(null);

	const { templates, templateTypes, isLoading } = useTemplateData();

	// Filter templates based on search and type
	const filteredTemplates = useMemo(() => {
		return templates.filter((template) => {
			const matchesSearch = !searchTerm || template.title.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesType = selectedType === 'all' || template.type === selectedType;

			return matchesSearch && matchesType;
		});
	}, [templates, searchTerm, selectedType]);

	// Template type options
	const typeOptions = useMemo(() => {
		return [
			{ label: __('All Types', 'kadence-blocks'), value: 'all' },
			...templateTypes.map((type) => ({
				label: type.label,
				value: type.slug,
			})),
		];
	}, [templateTypes]);

	return (
		<div className="kadence-template-library">
			<div className="kadence-template-library-controls">
				<SelectControl
					label={__('Template Type', 'kadence-blocks')}
					value={selectedType}
					options={typeOptions}
					onChange={setSelectedType}
				/>
			</div>

			<Grid columns={3} gap={4} className="kadence-template-library-grid">
				{filteredTemplates.map((template) => (
					<Card key={template.id} className="kadence-template-library-item" isElevated>
						<CardMedia onClick={() => setPreviewTemplate(template)}>
							<img src={template.thumbnail} alt={template.title} loading="lazy" />
						</CardMedia>
						<CardBody>
							<h3>{template.title}</h3>
							<p>{template.description}</p>
							<div className="kadence-template-library-item-actions">
								<Button variant="secondary" onClick={() => setPreviewTemplate(template)}>
									{__('Preview', 'kadence-blocks')}
								</Button>
								<Button variant="primary" onClick={() => onSelect(template)}>
									{__('Use Template', 'kadence-blocks')}
								</Button>
							</div>
						</CardBody>
					</Card>
				))}
			</Grid>

			{previewTemplate && (
				<TemplatePreview
					template={previewTemplate}
					onClose={() => setPreviewTemplate(null)}
					onSelect={onSelect}
				/>
			)}
		</div>
	);
};

export default TemplateLibrary;
