/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useKeycloak } from '@react-keycloak/web';
import { FC, useState } from 'react';
import Dialog from '@reach/dialog';
import { MdMenu } from 'react-icons/md';

import Divider from 'components/styled/Divider';
import Button, { NavHrefButton, NavLinkButton } from 'components/styled/Button';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { useInfoApi } from 'api/infoApi';

import { useMobileView } from 'hooks/useViewport';

import UserBadge from './UserBadge';

type MenuItem = {
	to?: string;
	href?: string | 'HOOK';
	external?: boolean;
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
		href: 'HOOK',
		label: 'Přejít do Kraméria',
		newTab: true,
		external: true,
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

const MenuButton: FC<{ item: MenuItem; variant: 'desktop' | 'tablet' }> = ({
	item,
	variant,
}) => {
	const ButtonComponent = item.href ? NavHrefButton : NavLinkButton;
	const info = useInfoApi(item.external && item.href === 'HOOK');
	const href = info.data?.kramerius.url ?? undefined;
	if (info.isLoading) {
		return <Loader />;
	}

	return (
		<>
			{variant === 'desktop' ? (
				<ButtonComponent
					to={item.to ?? '#'}
					href={href ?? '#'}
					color="white"
					variant="primary"
					minWidth={30}
					px={1}
					mr={1}
				>
					{item.label}
				</ButtonComponent>
			) : (
				<ButtonComponent
					to={item.to ?? '#'}
					color="primary"
					variant="text"
					minWidth={30}
					px={1}
					my={2}
					fontSize="inherit"
				>
					{item.label}
				</ButtonComponent>
			)}
		</>
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
				<MenuButton item={item} variant={variant} key={`${item.label}-${i}`} />
			))}
			{variant === 'tablet' && <Divider mr={2} my={2} />}
			<UserBadge variant={variant} />
		</>
	);
};
