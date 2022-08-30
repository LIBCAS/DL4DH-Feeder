/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useKeycloak } from '@react-keycloak/web';
import { FC, useState } from 'react';
import Dialog from '@reach/dialog';
import { MdMenu } from 'react-icons/md';

import Divider from 'components/styled/Divider';
import Button, { NavLinkButton } from 'components/styled/Button';
import { Flex } from 'components/styled';

import { useMobileView } from 'hooks/useViewport';

import UserBadge from './UserBadge';

type MenuItem = {
	to?: string;
	label: string;
	component?: React.ReactNode;
	newTab?: boolean;
	order: number;
	private?: boolean;
};

const menuItems: MenuItem[] = [
	{
		to: '/collections',
		label: 'Sbírky',
		order: 0,
	},
	{
		to: '/browse',
		label: 'Procházet',
		order: 1,
	},
	{
		to: '/about',
		label: 'Informace',
		order: 2,
	},
	{
		label: 'English',
		component: Button,
		order: 3,
	},
	{
		to: '/exports',
		label: 'Exporty',
		order: 4,
		private: true,
	},

	{
		to: 'https://kramerius5.nkp.cz/',
		label: 'Přejít do Kraméria',
		newTab: true,
		order: 5,
	},
];

export const HeaderMenu: FC = () => {
	const { isTablet } = useMobileView();
	const [sideMenuExpanded, setSideMenuExpanded] = useState(false);
	return (
		<Flex ml={1} flexShrink={0} color="headerColor">
			{isTablet ? (
				<>
					<Button
						variant="primary"
						px={0}
						mx={0}
						minWidth={50}
						onClick={() => setSideMenuExpanded(true)}
					>
						<MdMenu size={22} />
					</Button>
					<Dialog
						isOpen={sideMenuExpanded}
						onDismiss={() => setSideMenuExpanded(false)}
						aria-label="Bočné menu"
						css={css`
							position: fixed;
							top: 0;
							right: 0;
							bottom: 0;
							background-color: white;
							padding: 0 !important;
							margin: 0 !important;
							width: auto;
							max-width: 400px;
							min-width: 300px;
							display: flex;
							flex-direction: column;
							overflow-y: auto;
						`}
					>
						<Flex
							flexDirection="column"
							fontSize="xl"
							alignItems="flex-start"
							pl={2}
						>
							<MenuButtons variant="tablet" />
						</Flex>
					</Dialog>
				</>
			) : (
				<Flex alignItems="center">
					<MenuButtons variant="desktop" />
				</Flex>
			)}
		</Flex>
	);
};

const MenuButtons: FC<{ variant: 'desktop' | 'tablet' }> = ({ variant }) => {
	const { keycloak } = useKeycloak();
	const items = (
		keycloak.authenticated ? menuItems : menuItems.filter(item => !item.private)
	).sort((a, b) => a.order - b.order);
	return (
		<>
			{items.map((item, i) => (
				<>
					{variant === 'desktop' ? (
						<NavLinkButton
							key={`${item.label}-${i}`}
							to={item.to ?? '#'}
							color="white"
							variant="primary"
							minWidth={50}
							px={1}
							mx={1}
						>
							{item.label}
						</NavLinkButton>
					) : (
						<NavLinkButton
							key={`${item.label}-${i}`}
							to={item.to ?? '#'}
							color="primary"
							variant="text"
							minWidth={50}
							px={1}
							my={2}
							fontSize="inherit"
						>
							{item.label}
						</NavLinkButton>
					)}
				</>
			))}
			{variant === 'tablet' && <Divider mr={2} my={2} />}
			<UserBadge variant={variant} />
		</>
	);
};
