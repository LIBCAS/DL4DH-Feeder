/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import {
	RouteComponentProps,
	RouteProps,
	RedirectProps,
} from 'react-router-dom';

import { Loader } from 'modules/loader';

import { retryPromise } from 'utils';

export type RouteItem = {
	type: 'route';
} & Required<Pick<RouteProps, 'path' | 'render'>>;
export type RedirectItem = {
	type: 'redirect';
	path: RouteProps['path'];
} & Required<Pick<RedirectProps, 'to'>>;

export type RouterItem = RouteItem | RedirectItem;

// Lazy wrapper with loader
export const LazyRoute =
	(
		component: Parameters<typeof lazy>[0],
		componentProps?: Record<string, unknown>,
		// eslint-disable-next-line react/display-name
	) =>
	(routeProps: RouteComponentProps) => {
		const Component = lazy(() => retryPromise(component));
		return (
			//TODO: Error boundary
			<React.Suspense fallback={<Loader />}>
				<Component {...routeProps} {...componentProps} />
			</React.Suspense>
		);
	};
