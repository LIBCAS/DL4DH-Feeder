import { FC } from 'react';
import { MdOpenInNew } from 'react-icons/md';
import { matchPath, useLocation } from 'react-router';

import { NavHrefButton, NavLinkButton } from 'components/styled/Button';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { OIDCLoginButton } from 'modules/public/auth';

import { VsdUser } from 'auth/token';

import { HeaderItem, UserBadgeItem } from './menuItems';
import UserBadge from './UserBadge';

type Props = {
	user?: VsdUser;
	items: HeaderItem[];
	userBadges: UserBadgeItem[];
};

const DesktopMenu: FC<Props> = ({ user, items, userBadges }) => {
	const { pathname } = useLocation();
	return (
		<Flex
			p={0}
			justifyContent="space-between"
			alignItems="center"
			flexDirection="row"
			width="100%"
		>
			{user ? (
				<Flex>
					{items.map((b, i) => (
						<NavLinkButton
							variant={b.variant}
							key={i}
							to={b.to}
							fontWeight={
								matchPath(pathname, { path: b.to.toString(), strict: false })
									? 'bold'
									: 'normal'
							}
						>
							{b.title}
						</NavLinkButton>
					))}
				</Flex>
			) : (
				<Flex flexGrow={1} />
			)}

			<Flex alignItems="center" flexShrink={0}>
				{user ? (
					<UserBadge user={user} badgeItems={userBadges} />
				) : (
					<>
						{items.map((b, i) =>
							// eslint-disable-next-line no-nested-ternary
							b.external ? (
								<NavHrefButton
									variant={b.variant}
									href={b.href}
									target={b.target}
									key={i}
								>
									<Text as="span" mr={2}>
										{b.title}
									</Text>
									<MdOpenInNew />
								</NavHrefButton>
							) : b.oidc ? (
								<Flex mr={2} p={2}>
									<OIDCLoginButton />
								</Flex>
							) : (
								<NavLinkButton
									variant={b.variant}
									key={i}
									to={b.to}
									mr={2}
									p={2}
									target={b.target}
								>
									{b.title}
								</NavLinkButton>
							),
						)}
					</>
				)}
			</Flex>
		</Flex>
	);
};

export default DesktopMenu;
