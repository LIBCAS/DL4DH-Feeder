import { theme } from 'theme';

import { Backend } from 'api/endpoints';

import { isIntern } from './FEVersion';

export const DEV_ENV = process.env.NODE_ENV !== 'production';

/**APP CONTEXT */
export const EXTERNAL_CONTEXT = '/TODO';
export const INTERNAL_CONTEXT = '/TODO';
export const APP_CONTEXT = '';

/**TOKENS */
export const ACCESS_TOKEN_CONTEXT = isIntern()
	? 'intern-vsd-access-token'
	: 'public-vsd-access-token';

export const REFRESH_TOKEN_CONTEXT = isIntern()
	? 'intern-vsd-refresh-token'
	: 'public-vsd-refresh-token';

/**ANONYMOUS USER */
export const ANONYMOUS_USER_LOGGED = 'public-vsd-lsiduser-logged-in';
export const ANONYMOUS_USER_ID = 'public-vsd-lsiduser-id';

/**OIDC */
export const OIDC_URL = 'TODO';
export const OIDC_REDIRECT_URI = `${window.location.origin}${APP_CONTEXT}/auth`;
export const OIDC_CLIENT_ID = 'TODO';
export const OIDC_CLIENT_SECRET = 'TODO';
export const OIDC_USER_INFO_URL = 'TODO';

//export const MAX_PHOTO_FILE_SIZE = 1048576;
export const BROWSER_MAX_PHOTO_FILE_SIZE = 30971520;
export const BACKEND_MAX_PHOTO_FILE_SIZE = 20971520;

export const readingStateText: Record<Backend.ReadingState, string> & {
	UNKNOWN: string;
} = {
	SUBMITTED: 'Poslaná',
	VERIFIED: 'Overená',
	NOT_VERIFIED: 'Neoverená',
	DECLINED: 'Zamietnutá',
	PRECREATED: 'TEST',
	UNKNOWN: 'Neznámy',
	DECLINED_SAP: 'Zamietnutá - SAP',
};

export const readingStateTextCustomer: Record<Backend.ReadingState, string> & {
	UNKNOWN: string;
} = {
	SUBMITTED: 'Čakajúci na overenie',
	VERIFIED: 'Akceptovaný',
	NOT_VERIFIED: 'Čakajúci na overenie',
	DECLINED: 'Neakceptovaný',
	PRECREATED: 'Neznámy',
	UNKNOWN: 'Neznámy',
	DECLINED_SAP: 'Neakceptovaný',
};

export const badgeFromStatus: Record<
	Backend.ReadingState,
	{ label: string; color: string }
> = {
	VERIFIED: {
		label: readingStateText['VERIFIED'],
		color: theme.colors.success,
	},
	NOT_VERIFIED: { label: 'Neoverená', color: theme.colors.warning },
	DECLINED: { label: 'Zamietnutá', color: theme.colors.error },
	SUBMITTED: { label: 'Poslaná', color: theme.colors.text },
	PRECREATED: { label: 'TEST', color: theme.colors.text },
	DECLINED_SAP: { label: 'Zamietnutá - SAP', color: theme.colors.error },
};

export const colorFromStatus: Record<Backend.ReadingState, string> = {
	VERIFIED: theme.colors.success,
	NOT_VERIFIED: theme.colors.warning,
	DECLINED: theme.colors.error,
	SUBMITTED: theme.colors.text,
	PRECREATED: theme.colors.text,
	DECLINED_SAP: theme.colors.error,
};

export const RoleText: Record<Backend.Role, string> = {
	ADMIN: 'Administrátor',
	CUSTOMER: 'Zákazník',
	EMPLOYEE: 'Zamestnanec',
};

export const readingStateTuple = [
	'SUBMITTED',
	'VERIFIED',
	'NOT_VERIFIED',
	'DECLINED',
	'DECLINED_SAP',
] as Backend.ReadingState[];

export type CustomerReadingState = Extract<
	Backend.ReadingState,
	'SUBMITTED' | 'VERIFIED' | 'DECLINED'
>;

export const readingStateCustomerTuple: CustomerReadingState[] = [
	'SUBMITTED',
	'VERIFIED',
	'DECLINED',
];

export const expandStateFilter: Record<
	CustomerReadingState,
	Backend.ReadingState[]
> = {
	SUBMITTED: ['SUBMITTED', 'NOT_VERIFIED'],
	VERIFIED: ['VERIFIED'],
	DECLINED: ['DECLINED', 'DECLINED_SAP'],
};
