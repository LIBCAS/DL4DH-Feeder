/** @jsxImportSource @emotion/react */
import { FC } from 'react';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';

const Homepage: FC = () => {
	return (
		<ResponsiveWrapper bg="primaryLight" px={1} mx={0}>
			<Flex alignItems="center" justifyContent="center" height="100vh">
				<NavLinkButton to="/search" variant="primary">
					Prejit do Feederu
				</NavLinkButton>
			</Flex>
		</ResponsiveWrapper>
	);
};

export default Homepage;
