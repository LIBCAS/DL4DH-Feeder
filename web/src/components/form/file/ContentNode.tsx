import React from 'react';

import Text from 'components/styled/Text';

import IconBubble from './IconBubble';
import { ContentNodeProps } from './_typing';

const ContentNode: React.FC<ContentNodeProps> = ({
	header,
	icon,
	title,
	subtitle,
	button,
	variant,
}) => (
	<React.Fragment>
		{header}
		{icon && <IconBubble variant={variant}>{icon}</IconBubble>}
		<Text>{title}</Text>
		<Text my={0} fontSize="sm" color="text">
			{subtitle}
		</Text>
		{button}
	</React.Fragment>
);

export default ContentNode;
