import React from 'react';

import LoaderBounce from 'components/loaders/LoaderBounce';
import { Wrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

type LoaderProps = {
	width?: string;
	bg?: string;
	color?: string;
};

export const Loader: React.FC<LoaderProps> = ({
	bg,
	color = 'primary',
	width = 'auto',
}) => (
	<Wrapper justifyContent="center">
		<Flex
			p={3}
			justifyContent="center"
			alignItems="center"
			backgroundColor={bg}
			color={color}
			width={width}
		>
			<LoaderBounce color={color} />
		</Flex>
	</Wrapper>
);
