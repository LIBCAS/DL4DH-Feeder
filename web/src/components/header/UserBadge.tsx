/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import '@reach/menu-button/styles.css';
import React, { FC, Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuLink } from '@reach/menu-button';
import { MdArrowDropDown, MdLogout } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { NavLink } from 'components/styled/Link';

import { ProfileIcon } from 'assets';
import { useTheme } from 'theme';

import { VsdUser } from 'auth/token';

import useLogout from 'hooks/useLogout';

import { MenuAvatar, StyledMenuList } from './styled';
import { UserBadgeItem } from './menuItems';

type Props = {
	user: VsdUser;
	badgeItems: UserBadgeItem[];
};

const UserBadge: FC<Props> = ({ user, badgeItems }) => {
	// Logout
	const handleLogOut = useLogout(user);

	const theme = useTheme();

	return (
		<Fragment>
			<Menu>
				{({ isOpen }) => (
					<Fragment>
						<MenuAvatar
							as={MenuButton}
							aria-label="Uživatelské menu"
							isOpen={isOpen}
						>
							<ProfileIcon size={32} />
						</MenuAvatar>

						<StyledMenuList>
							{badgeItems.map(({ title, icon, to }, index) => (
								<MenuLink key={`user-badge-item-${index}`} as={NavLink} to={to}>
									<Flex justifyContent="space-between" alignItems="center">
										<Text mx={3} my={2}>
											{title}
										</Text>
										<Box width={12}>{icon}</Box>
									</Flex>
								</MenuLink>
							))}

							<MenuItem onSelect={handleLogOut}>
								<Flex justifyContent="space-between" alignItems="center">
									<Text as="span" mx={3} my={2}>
										Odhlásiť sa
									</Text>
									<MdLogout />
								</Flex>
							</MenuItem>
						</StyledMenuList>

						{user.name && (
							<Flex
								as={MenuButton}
								alignItems="center"
								css={css`
									border: 0px;
									background: none;
									max-width: 150px;

									@media (max-width: ${theme.breakpoints[0]}) {
										display: none;
									}
								`}
							>
								<Text ml={1} p={0} textAlign="right" fontSize="md">
									{user.name}
								</Text>
								<MdArrowDropDown size={25} />
							</Flex>
						)}
					</Fragment>
				)}
			</Menu>
		</Fragment>
	);
};

export default UserBadge;
