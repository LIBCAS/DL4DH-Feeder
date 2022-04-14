/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import '@reach/dialog/styles.css';
import React, { FC, Fragment, useCallback, useState } from 'react';
import Dialog from '@reach/dialog';
import { MdClose, MdLogout, MdOpenInNew } from 'react-icons/md';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Button, { resetButtonStyle } from 'components/styled/Button';
import { HrefLink, NavLink } from 'components/styled/Link';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';

import { Theme, useTheme } from 'theme';
import { MobileMenuIcon } from 'assets';

import { VsdUser } from 'auth/token';

import useLogout from 'hooks/useLogout';

import { HeaderItem, UserBadgeItem } from './menuItems';

const ListItemCss = (theme: Theme) => css`
	display: flex;
	align-items: center;
	position: relative;
	cursor: pointer;

	&:hover {
		text-decoration: none;
		background-color: ${theme.colors.primaryLight};
		color: white;
	}

	&.active-route {
		font-weight: bold;
		background-color: ${theme.colors.lightGrey};
		color: initial;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			width: 5px;
			height: 100%;
			background-color: ${theme.colors.primary};
		}
	}
`;

type Props = {
	user?: VsdUser;
	items: HeaderItem[];
	userBadges: UserBadgeItem[];
};

const MobileMenu: FC<Props> = ({ user, items, userBadges }) => {
	const [open, setOpen] = useState(false);
	const openMenu = useCallback(() => !open && setOpen(true), [open, setOpen]);
	const closeMenu = useCallback(() => open && setOpen(false), [open, setOpen]);
	const theme = useTheme();

	// Logout
	const handleLogOut = useLogout(user, closeMenu);

	return (
		<Fragment>
			<IconButton onClick={openMenu} color="primary">
				<MobileMenuIcon size={26} />
			</IconButton>

			<Dialog
				isOpen={open}
				onDismiss={closeMenu}
				aria-label="Bočné menu"
				css={css`
					position: fixed;
					top: 0;
					left: 0;
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
					pl={4}
					pr={3}
					alignItems="center"
					height={82}
					flexShrink={0}
					justifyContent="space-between"
				>
					{user && <Text>{user.name}</Text>}
					<Flex
						as="button"
						alignItems="center"
						justifyContent="flex-end"
						onClick={closeMenu}
						//size={28}
						css={css`
							${ListItemCss(theme)}
							${resetButtonStyle}
						`}
					>
						<MdClose size={28} />
					</Flex>
				</Flex>
				<Divider mx={4} my={2} color="border" />
				{items.map(item =>
					item.external ? (
						<HrefLink
							href={item.href}
							target={item.target}
							key={item.title}
							css={css`
								${ListItemCss(theme)}
								${resetButtonStyle}
							`}
						>
							<Flex justifyContent="center" alignItems="center">
								<Text pl={5} py={3} flexGrow={1} mr={3}>
									{item.title}
								</Text>{' '}
								<MdOpenInNew />
							</Flex>
						</HrefLink>
					) : (
						<NavLink
							key={item.title}
							to={item.to}
							onClick={closeMenu}
							css={css`
								${ListItemCss(theme)}
								${resetButtonStyle}
							`}
						>
							<Text pl={4} py={3} flexGrow={1}>
								{item.title}
							</Text>
							<hr style={{ color: ' #f8f8f8' }} />
						</NavLink>
					),
				)}
				<Divider mx={4} my={2} color="border" />
				{user &&
					userBadges.map(item => (
						<NavLink
							key={item.title}
							to={item.to}
							onClick={closeMenu}
							css={css`
								${ListItemCss(theme)}
								${resetButtonStyle}
							`}
						>
							<Text pl={4} py={3} flexGrow={1}>
								{item.title}
							</Text>
							<hr style={{ color: ' #f8f8f8' }} />
						</NavLink>
					))}

				{user && (
					<Button
						variant="text"
						onClick={handleLogOut}
						css={css`
							${ListItemCss(theme)}
							${resetButtonStyle}
	                        padding: initial;
							font-size: initial;
							text-align: initial;
						`}
					>
						<Flex
							pl={4}
							py={3}
							flexGrow={1}
							alignItems="center"
							justifyContent="flex-start"
						>
							<Text mr={3}>Odhlásiť sa</Text>

							<MdLogout size={20} />
						</Flex>
					</Button>
				)}
			</Dialog>
		</Fragment>
	);
};
export default MobileMenu;
