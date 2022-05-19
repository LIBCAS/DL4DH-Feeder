import { matchPath } from 'react-router-dom';

import { LazyRoute, RouterItem } from 'components/routing/LazyRoute';

import { VsdUser } from 'auth/token';
import Lazy from 'auth/lazyComps';

import { isAdminUser } from './token';

export const PUBLIC_ROUTES: RouterItem[] = [
	{
		type: 'route',
		path: '/',
		element: LazyRoute(Lazy.Homepage),
	},
	{
		type: 'route',
		path: '/search',
		element: LazyRoute(Lazy.MainSearch),
	},
	{
		type: 'route',
		path: '/view/:id',
		element: LazyRoute(Lazy.PublicationView),
	},
	{
		type: 'route',
		path: '/auth',
		element: LazyRoute(Lazy.Authorize),
	},
];

export const LOGGED_ROUTES: RouterItem[] = [
	{
		type: 'route',
		path: '/',
		element: LazyRoute(Lazy.Homepage),
	},
	{
		type: 'route',
		path: '/auth',
		element: LazyRoute(Lazy.Authorize),
	},
];

// Get routes based on user authentication
export const getUserRoutes = (user?: VsdUser) => {
	if (isAdminUser(user)) {
		return LOGGED_ROUTES;
	}

	return [...PUBLIC_ROUTES];
};

export const isAuthPath = (path: string) =>
	[...LOGGED_ROUTES].some(r =>
		r.path === '/' ? false : matchPath(path, r.path),
	);
