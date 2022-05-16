import { v4 as uuid } from 'uuid';

import Store from 'utils/Store';
import { isIntern } from 'utils/FEVersion';

const FAKE_USER_CONTEXT = isIntern()
	? 'intern-vsd-fake-user'
	: 'public-vsd-fake-user';

export const getIdFromLS = () => {
	const id = Store.get('VSD_USER');
	console.log('External user? ', id);
	return id;
};

export const loginLSID = () => {
	let id = Store.get('VSD_EXTERNAL_USER');
	if (!id) {
		id = uuid();
		Store.set('VSD_EXTERNAL_USER', id);
	}
	return id as string;
};

export const useLSIDUser = () => Store.get(FAKE_USER_CONTEXT) as string;

export type TFakeUserRoles =
	| 'ADMIN'
	| 'CUSTOMER'
	| 'EMPLOYEE'
	| 'CUSTOMER-LSID';

export const loginFakeUser = (user: TFakeUserRoles) => {
	Store.set(FAKE_USER_CONTEXT, user);
};

export const logoutFakeUser = () => {
	Store.remove(FAKE_USER_CONTEXT);
};

export const getFakeUser = () => Store.get(FAKE_USER_CONTEXT) as TFakeUserRoles;
