import { FC } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';

import { Box } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

const ProtectedRoute: FC = ({ children }) => {
	const { keycloak } = useKeycloak();
	const { t } = useTranslation();
	if (!keycloak.authenticated) {
		return (
			<Wrapper
				height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`}
				alignItems="flex-start"
				p={[4, 0]}
				width={1}
				bg="paper"
			>
				<Paper color="#444444!important" width="90%">
					<Box mt={3}>
						<H1
							my={3}
							textAlign="left"
							color="#444444!important"
							fontWeight="normal"
						>
							{t('navbar:login_request')}
						</H1>
						<Button
							variant="primary"
							onClick={() => {
								keycloak.login();
							}}
						>
							{t('navbar:login')}
						</Button>
					</Box>
				</Paper>
			</Wrapper>
		);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
