import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NavButton } from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

//TODO:
const NotFound: React.FC = () => {
	// Page title
	//usePageTitle('Stránka nenalezena');

	const nav = useNavigate();
	const { pathname } = useLocation();

	return (
		<ResponsiveWrapper alignItems="flex-start">
			<Text color="text" fontSize="xl" fontWeight="bold" mt={5} mb={4} as="h2">
				Stránka nebyla nalezena (404)
			</Text>
			<Text>
				Stránka{' '}
				<Text as="span" fontWeight="bold">
					{pathname}
				</Text>{' '}
				nebyla nalezena.
			</Text>
			<Flex alignItems="center">
				<NavButton variant="primary" mt={3} onClick={() => nav('/')}>
					Přejděte na úvodní stránku
				</NavButton>
			</Flex>
		</ResponsiveWrapper>
	);
};

export default NotFound;
