import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { NavButton } from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

const NotFound: React.FC = () => {
	const nav = useNavigate();
	const { pathname } = useLocation();
	const { t } = useTranslation('page_not_found');
	return (
		<ResponsiveWrapper alignItems="flex-start">
			<Text color="text" fontSize="xl" fontWeight="bold" mt={5} mb={4} as="h2">
				{t('title')}
			</Text>
			<Text>
				{t('page')}
				<Text as="span" fontWeight="bold">
					{pathname}
				</Text>{' '}
				{t('not_found')}
			</Text>
			<Flex alignItems="center">
				<NavButton variant="primary" mt={3} onClick={() => nav('/')}>
					{t('go')} {t('home')}
				</NavButton>
			</Flex>
		</ResponsiveWrapper>
	);
};

export default NotFound;
