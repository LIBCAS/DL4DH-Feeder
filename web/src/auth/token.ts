import decodeJWT from 'jwt-decode';
import isBefore from 'date-fns/isBefore';

import { OidcUserInfo } from 'modules/public/auth';

type CommonProps = {
	sub: string;
	id: string;
	iat: number;
	exp: number;
};

export type PersonType = 'ADMIN' | 'CUSTOMER' | 'EMPLOYEE';

export type AdminUser = CommonProps & {
	personType: 'ADMIN';
};

export type EmployeeUser = CommonProps & {
	personType: 'EMPLOYEE';
};

export type CustomerUser = CommonProps & {
	personType: 'CUSTOMER';
};

export type ApiUser = AdminUser | CustomerUser | EmployeeUser;

export type VsdUser = { personType: PersonType } & Partial<OidcUserInfo>;

export const isAdminUser = (
	user?: Pick<VsdUser, 'personType'>,
): user is AdminUser => user?.personType === 'ADMIN';

export const isCustomerUser = (
	user?: Pick<VsdUser, 'personType'>,
): user is CustomerUser => user?.personType === 'CUSTOMER';

export const isEmployeeUser = (
	user?: Pick<VsdUser, 'personType'>,
): user is EmployeeUser => user?.personType === 'EMPLOYEE';

export const decodeToken = (token: string) => {
	let decodedToken;
	// Decode token
	try {
		decodedToken = decodeJWT(token) as ApiUser;
	} catch (error) {
		decodedToken = null;
	}

	return decodedToken;
};

export const validateTokenExp = (user: ApiUser | null) => {
	if (user !== null && typeof user.exp === 'number') {
		// If exp date is before now, its invalid
		return isBefore(new Date(), new Date(user.exp * 1000));
	}
	// If exp date is not a number, its invalid
	return false;
};
