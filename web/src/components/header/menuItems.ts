import { LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';

import {
	VsdUser,
	isAdminUser,
	isCustomerUser,
	isEmployeeUser,
} from 'auth/token';

import { isIntern } from 'utils/FEVersion';

export type UserBadgeItem = {
	title: string;
	icon?: ReactNode;
	to: string;
};

export type HeaderItem = {
	title: string;
	to: LinkProps<unknown>['to'];
	variant: 'primary' | 'outlined' | 'text';
	target?: LinkProps<unknown>['target'];
	external?: boolean;
	href?: string;
	oidc?: boolean;
};

export type HeaderProps = {
	user?: VsdUser;
	items: HeaderItem[];
	userBadges: UserBadgeItem[];
};

export const PUBLIC_ITEMS: HeaderItem[] = isIntern()
	? [
			{
				title: 'Prihlásiť sa',
				to: '',
				variant: 'primary',
				oidc: true,
			},
	  ]
	: [
			{
				title: 'Prihlásiť sa',
				to: '',
				variant: 'primary',
				oidc: true,
			},
			{
				title: 'Zaregistrovať sa',
				to: '',
				variant: 'outlined',
				target: '_blank',
				external: true,
				href: 'https://www.vsds.sk/edso/registracia',
			},
	  ];

export const ADMIN_ITEMS: HeaderItem[] = [
	{
		title: 'Prehľad odpočtov',
		to: '/readings-overview',
		variant: 'text',
	},
	{
		title: 'Šablóna newsletter',
		to: '/email-template',
		variant: 'text',
	},
	{
		title: 'Výnimky newsletter',
		to: '/blacklist',
		variant: 'text',
	},
	{
		title: 'Manuálne zasielanie newslettera',
		to: '/send-newsletter',
		variant: 'text',
	},
];
export const EMPLOYEE_ITEMS: HeaderItem[] = [
	{
		title: 'Prehľad odpočtov',
		to: '/readings-overview',
		variant: 'text',
	},
];

export const CUSTOMER_ITEMS: HeaderItem[] = [
	{
		title: 'Nahlásenie odpočtu',
		to: '/publication/new',
		variant: 'text',
	},
	{
		title: 'História odpočtov',
		to: '/readings-overview',
		variant: 'text',
	},
];

// Add new item menu (badge) items here
const CUSTOMER_BADGE_ITEMS: UserBadgeItem[] = [];

const ADMIN_BADGE_ITEMS: UserBadgeItem[] = [];

export const PUBLIC_HEADER_ITEMS = {
	items: PUBLIC_ITEMS,
	userBadges: [],
};

export const CUSTOMER_HEADER_ITEMS = {
	items: CUSTOMER_ITEMS,
	userBadges: CUSTOMER_BADGE_ITEMS,
};

export const ADMIN_HEADER_ITEMS = {
	items: ADMIN_ITEMS,
	userBadges: ADMIN_BADGE_ITEMS,
};

export const EMPLOYEE_HEADER_ITEMS = {
	items: EMPLOYEE_ITEMS,
	userBadges: ADMIN_BADGE_ITEMS,
};

//TODO:
export const getUserHeaderItems = (user?: VsdUser) => {
	if (isAdminUser(user)) {
		return ADMIN_HEADER_ITEMS;
	}
	if (isEmployeeUser(user)) {
		return EMPLOYEE_HEADER_ITEMS;
	}

	if (isCustomerUser(user)) {
		return CUSTOMER_HEADER_ITEMS;
	}

	return PUBLIC_HEADER_ITEMS;
};
