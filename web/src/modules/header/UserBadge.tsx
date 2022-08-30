/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdPerson } from 'react-icons/md';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { useKeycloak } from '@react-keycloak/web';
import { FC } from 'react';

import Button from 'components/styled/Button';
import Text from 'components/styled/Text';
import { Flex } from 'components/styled';

import { api } from 'api';

import Store from 'utils/Store';
import '@reach/menu-button/styles.css';

const UserBadge: FC<{ variant: 'tablet' | 'desktop' }> = ({ variant }) => {
	const { keycloak } = useKeycloak();

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
					<Text my={0}>Přihlásit</Text>
				</Button>
			</Flex>
		);
	}

	return variant === 'tablet' ? (
		<>
			<Flex alignItems="center" justifyContent="space-between" width={1} px={2}>
				<Flex alignItems="center">
					<MdPerson size={22} />
					<Text ml={2}>
						{keycloak?.idTokenParsed?.preferred_username ?? 'neznamy'}
					</Text>
				</Flex>
				<Button
					onClick={async () => {
						await api().get('user/logout');
						keycloak.logout();
						keycloak.clearToken();
						Store.remove(Store.keys.Token);
					}}
					variant={variant === 'tablet' ? 'text' : 'primary'}
					color={variant === 'tablet' ? 'primary' : 'white'}
					minWidth={50}
					px={1}
					my={2}
					fontSize="inherit"
					mr={4}
				>
					<Text>Odhlásit</Text>
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
				<Button minWidth={25} variant="primary">
					<MdPerson size={22} />
					<Text ml={2}>
						{keycloak?.idTokenParsed?.preferred_username ?? 'neznamy'}
					</Text>
				</Button>
			</MenuButton>
			<MenuList>
				<MenuItem
					onSelect={async () => {
						await api().get('user/logout');
						keycloak.logout();
						keycloak.clearToken();
						Store.remove(Store.keys.Token);
					}}
				>
					Odhlásit
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default UserBadge;
