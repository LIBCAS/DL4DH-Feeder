/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useKeycloak } from '@react-keycloak/web';
import { FC, useState } from 'react';
import Dialog from '@reach/dialog';
import { MdMenu } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Divider from 'components/styled/Divider';
import Button, { NavHrefButton, NavLinkButton } from 'components/styled/Button';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { useInfoApi } from 'api/infoApi';

import { useMobileView } from 'hooks/useViewport';

import i18n from 'utils/localization';

import UserBadge from './UserBadge';
import LangSwitch from './LangSwitch';

type MenuItem = {
	to?: string;
	href?: string | 'HOOK';
	external?: boolean;
	label: string;
	jsx?: (variant: string) => JSX.Element;
	newTab?: boolean;
	order: number;
	private?: boolean;
	onClick?: () => void;
};

const menuItems: MenuItem[] = [
	{
		to: '/browse?category=collections',
		label: 'collections',
		order: 0,
	},
	{
		to: '/browse',
		label: 'browse',
		order: 1,
	},
	{
		to: '/about',
		label: 'about',
		order: 2,
	},
	{
		label: i18n.language === 'cz' ? 'English' : 'Cz',
		// eslint-disable-next-line react/display-name
		jsx: (variant: string) => <LangSwitch variant={variant} />,
		order: 3,
		onClick: () => {
			i18n.changeLanguage('en');
		},
	},
	{
		to: '/exports',
		label: 'exports',
		order: 4,
		private: true,
	},

	{
		href: 'HOOK',
		label: 'go_to_kramerius',
		newTab: true,
		external: true,
		order: 5,
	},
];

export const HeaderMenu: FC = () => {
	const { isTablet } = useMobileView();
	const [sideMenuExpanded, setSideMenuExpanded] = useState(false);
	return (
		<Flex ml={1} flexShrink={0} color="headerColor" minHeight={50}>
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
	const { t } = useTranslation('navbar');
	const location = useLocation();
	const info = useInfoApi(item.external && item.href === 'HOOK');
	const newOrigin = info.data?.kramerius.url ?? undefined;
	// eslint-disable-next-line no-nested-ternary
	const href = newOrigin
		? location.pathname.includes('multiview')
			? newOrigin
			: newOrigin + location.pathname + location.search
		: undefined;
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
					onClick={item.onClick}
				>
					{t(item.label)}
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
					onClick={item.onClick}
				>
					{t(item.label)}
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
			{items.map((item, i) => {
				if (item.jsx) {
					return item.jsx(variant);
				} else {
					return (
						<MenuButton
							item={item}
							variant={variant}
							key={`${item.label}-${i}`}
						/>
					);
				}
			})}
			{variant === 'tablet' && <Divider mr={2} my={2} />}
			<UserBadge variant={variant} />
		</>
	);
};
