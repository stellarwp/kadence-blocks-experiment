/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';

const TemplatePreview = ({ template, onClose, onSelect }) => {
	// Parse template content to blocks for preview
	const previewBlocks = useMemo(() => {
		return rawHandler({
			HTML: template.content,
		});
	}, [template.content]);

	return (
		<Modal title={template.title} onRequestClose={onClose} className="kadence-template-preview-modal" size="fill">
			<div className="kadence-template-preview-content">
				<BlockPreview blocks={previewBlocks} viewportWidth={1200} />
			</div>

			<div className="kadence-template-preview-actions">
				<Button variant="secondary" onClick={onClose}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button
					variant="primary"
					onClick={() => {
						onSelect(template);
						onClose();
					}}
				>
					{__('Use This Template', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
};

export default TemplatePreview;
