/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdPerson } from 'react-icons/md';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { useKeycloak } from '@react-keycloak/web';

import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

import '@reach/menu-button/styles.css';
import { api } from 'api';

import Store from 'utils/Store';

const UserBadge = () => {
	const { keycloak } = useKeycloak();

	return keycloak.authenticated ? (
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
				{keycloak.authenticated && (
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
				)}
			</MenuList>
		</Menu>
	) : (
		<Button
			onClick={() => keycloak.login()}
			minWidth={50}
			variant="primary"
			mx={1}
		>
			<Text>Přihlásit</Text>
		</Button>
	);
};

export default UserBadge;
