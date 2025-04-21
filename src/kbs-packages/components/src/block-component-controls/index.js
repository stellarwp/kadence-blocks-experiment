
import { map } from 'lodash';

import { BLOCK_COMPONENTS } from '../constants';

/**
 * Build the component preset
 */
export default function BlockComponentControls(props) {
	//TODO pull the list of components to render from the block meta provided
	const componentsToRender = ['typography'];

	return (
		<div className={'kbs-block-component-controls'}>
			{map(componentsToRender, (componentStr) => {
				const Component = BLOCK_COMPONENTS?.[componentStr].component;
				const label = BLOCK_COMPONENTS?.[componentStr].label;
				
				return ( 
					<Component
						label={label}
						attributeName={ componentStr }
						{...props}
					/> 
				);
			})}
		</div>
	);
}
