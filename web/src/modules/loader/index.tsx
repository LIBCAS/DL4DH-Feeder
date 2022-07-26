import React from 'react';

import LoaderBounce from 'components/loaders/LoaderBounce';
import { Wrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import LoaderSpin from 'components/loaders/LoaderSpin';

type LoaderProps = {
	width?: string;
	bg?: string;
	color?: string;
	size?: number;
};

export const Loader: React.FC<LoaderProps> = ({
	bg,
	color = 'primary',
	width = 'auto',
	size,
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
			<LoaderSpin size={size} color={color} />
		</Flex>
	</Wrapper>
);
