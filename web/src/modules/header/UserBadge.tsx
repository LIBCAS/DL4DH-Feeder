/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdArrowDropDown, MdPerson } from 'react-icons/md';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { useKeycloak } from '@react-keycloak/web';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ModalDialog from 'components/modal';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';
import { Flex } from 'components/styled';

import { api } from 'api';

import Store from 'utils/Store';

import '@reach/menu-button/styles.css';
import UserAccountModal from './UserAccountModal';

const UserBadge: FC<{ variant: 'tablet' | 'desktop' }> = ({ variant }) => {
	const { keycloak } = useKeycloak();
	const { t } = useTranslation('navbar');
	const nav = useNavigate();

	if (!keycloak.authenticated) {
		return (
			<Flex alignItems="center">
				<Button
					onClick={() => keycloak.login()}
					variant={variant === 'tablet' ? 'text' : 'primary'}
					color={variant === 'tablet' ? 'primary' : 'white'}
					minWidth={50}
					fontSize={variant === 'tablet' ? 'inherit' : '12px'}
					px={1}
					mx={1}
				>
					<Text my={0}>{t('login')}</Text>
				</Button>
			</Flex>
		);
	}

	return variant === 'tablet' ? (
		<>
			<Button
				onClick={() => nav('/exports')}
				variant="text"
				color="primary"
				minWidth={50}
				px={1}
				my={2}
				fontSize="inherit"
				mr={4}
			>
				<Text>{t('exports')}</Text>
			</Button>
			<Button
				onClick={() => nav('/search-history')}
				variant="text"
				color="primary"
				minWidth={50}
				px={1}
				my={2}
				fontSize="inherit"
				mr={4}
			>
				<Text>{t('history')}</Text>
			</Button>

			<ModalDialog
				label={t('account')}
				control={openModal => (
					<Button
						onClick={openModal}
						variant="text"
						color="primary"
						minWidth={50}
						px={1}
						my={2}
						fontSize="inherit"
						mr={4}
					>
						<Text>{t('account')}</Text>
					</Button>
				)}
			>
				{closeModal => <UserAccountModal closeModal={closeModal} />}
			</ModalDialog>

			<Flex alignItems="center" justifyContent="space-between" width={1} px={2}>
				<Flex alignItems="center">
					<MdPerson size={22} />
					<Text ml={2}>
						{keycloak?.idTokenParsed?.preferred_username ?? 'neznamy'}
					</Text>
				</Flex>
				<Button
					onClick={async () => {
						api().get('user/logout');
						keycloak.logout();
						keycloak.clearToken();
						Store.remove(Store.keys.Token);
					}}
					variant="text"
					color="primary"
					minWidth={50}
					px={1}
					my={2}
					fontSize="inherit"
					mr={4}
				>
					<Text>{t('logout')}</Text>
				</Button>
			</Flex>
		</>
	) : (
		<Menu>
			<MenuButton
				css={css`
					background-color: transparent;
					padding: 0;
					margin: 0;
					border: none;
				`}
			>
				<Button minWidth={20} variant="primary" px={1} height={32} mr={1}>
					<MdPerson size={18} />
					<Text ml={2}>
						{keycloak?.idTokenParsed?.preferred_username ?? 'neznamy'}
					</Text>
					<MdArrowDropDown size={18} />
				</Button>
			</MenuButton>
			<MenuList>
				<MenuItem onSelect={() => nav('/exports')}>{t('exports')}</MenuItem>
				<MenuItem onSelect={() => nav('/search-history')}>
					{t('history')}
				</MenuItem>

				<ModalDialog
					label={t('account')}
					control={openModal => (
						<MenuItem onSelect={openModal}>{t('account')}</MenuItem>
					)}
				>
					{closeModal => <UserAccountModal closeModal={closeModal} />}
				</ModalDialog>

				<MenuItem
					onSelect={async () => {
						api().get('user/logout');
						keycloak.logout();
						keycloak.clearToken();
						Store.remove(Store.keys.Token);
					}}
				>
					{t('logout')}
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default UserBadge;
