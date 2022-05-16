import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { NavButton } from 'components/styled/Button';
import Text from 'components/styled/Text';

import { useLoggedInUser } from 'api';

import { isAuthPath } from 'auth/routes';

//TODO:
const NotFound: React.FC<RouteComponentProps> = ({
	location: { pathname },
	history: { goBack, push },
}) => {
	// Page title
	//	usePageTitle('Stránka nenalezena');

	const token = useLoggedInUser();

	useEffect(() => {
		if (!token && isAuthPath(pathname)) {
			toast.error('Pre prístup k tejto podstránke je potrebné sa prihlásiť.', {
				duration: 10000,
			});
			push({ pathname: '/', state: { redirect: pathname } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ResponsiveWrapper alignItems="flex-start">
			<Text color="text" fontSize="xl" fontWeight="bold" mt={5} mb={4} as="h2">
				Stránka nenájdená (404)
			</Text>
			<Text>
				Stránka{' '}
				<Text as="span" fontWeight="bold">
					{pathname}
				</Text>{' '}
				nebola nájdená.
			</Text>

			<NavButton mt={3} onClick={goBack}>
				Naspäť
			</NavButton>
		</ResponsiveWrapper>
	);
};

export default NotFound;
