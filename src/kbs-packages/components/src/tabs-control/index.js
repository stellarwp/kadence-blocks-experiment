import { ButtonGroup, Button } from '@wordpress/components';
import './editor.scss';

export default function TabsControl({ tabs, onSelect, selected, children }) {
	return (
		<div className="kbs-tabs-control">
			<ButtonGroup className="kbs-tabs-control-buttons">
				{tabs.map((tab) => (
					<Button
						key={tab.name}
						isPressed={selected === tab.name}
						onClick={() => onSelect(tab.name)}
					>
						{tab.title}
					</Button>
				))}
			</ButtonGroup>
			<div className="kbs-tabs-control-content">
				{ children }
			</div>
		</div>
	);
}
