import { useKeycloak } from '@react-keycloak/web';
import { FC } from 'react';
import _ from 'lodash';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import Paper from 'components/styled/Paper';
import { Box, Flex } from 'components/styled';
import Text, { H1 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';

const UserAccountModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	const { keycloak } = useKeycloak();
	const { t } = useTranslation('user');
	const parsedToken = keycloak.tokenParsed;
	if (!parsedToken) {
		return <Paper>Unable to parse token</Paper>;
	}
	const name =
		_.get(parsedToken, 'name') ?? _.get(parsedToken, 'preferred_username');
	const email = _.get(parsedToken, 'email');
	const roles = parsedToken.realm_access?.roles.join(', ');
	return (
		<Paper>
			<Flex alignItems="center" justifyContent="space-between">
				<H1>{t('user-info-dialog.title')}</H1>
				<IconButton color="primary" onClick={closeModal}>
					<MdClose size={32} />
				</IconButton>
			</Flex>
			<Box my={3}>
				{name && (
					<Flex mb={2}>
						{t('user-info-dialog.name')}:{' '}
						<Text as="span" fontWeight="bold" ml={2}>
							{' '}
							{name}
						</Text>
					</Flex>
				)}
				{email && (
					<Flex mb={2}>
						{t('user-info-dialog.email')}:{' '}
						<Text as="span" fontWeight="bold" ml={2}>
							{' '}
							{email}
						</Text>
					</Flex>
				)}
				{roles && (
					<Flex mb={2}>
						{t('user-info-dialog.roles')}:{' '}
						<Text as="span" fontWeight="bold" ml={2}>
							{' '}
							{roles}
						</Text>
					</Flex>
				)}
			</Box>
		</Paper>
	);
};
export default UserAccountModal;
