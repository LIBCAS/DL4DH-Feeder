/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

import { Loader } from 'modules/loader';

import { retryPromise } from 'utils';

export type RouteItem = {
	type: 'route';
} & Required<Pick<RouteProps, 'path' | 'element'>>;

export type RouterItem = RouteItem;

// Lazy wrapper with loader
export const LazyRoute =
	(
		component: Parameters<typeof lazy>[0],
		componentProps?: Record<string, unknown>,
		// eslint-disable-next-line react/display-name
	) =>
	() => {
		const Component = lazy(() => retryPromise(component));
		return (
			//TODO: Error boundary
			<React.Suspense fallback={<Loader />}>
				<Component {...componentProps} />
			</React.Suspense>
		);
	};
