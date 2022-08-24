import { useKeycloak } from '@react-keycloak/web';
import { FC } from 'react';

import Button, { NavLinkButton } from 'components/styled/Button';

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

export const DesktopMenu: FC<{ variant: 'desktop' | 'tablet' }> = ({
	variant,
}) => {
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
		</>
	);
};
