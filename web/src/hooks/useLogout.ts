import { useCallback } from 'react';

import { VsdUser } from 'auth/token';

import { ACCESS_TOKEN_CONTEXT, APP_CONTEXT } from 'utils/enumsMap';
import Store from 'utils/Store';

const logoutRealUser = () => {
	Store.remove(ACCESS_TOKEN_CONTEXT);
};

const useLogout = (user?: VsdUser, after?: () => void) => {
	return useCallback(() => {
		logoutRealUser();

		window.location.replace(APP_CONTEXT);
		after?.();
	}, [after]);
};
export default useLogout;
