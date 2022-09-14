import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { isEqual, omit } from 'lodash';

import { Loader } from 'modules/loader';
import RouteUuid from 'modules/uuidRouting/RouteUuid';

import useSanitizeSearchQuery from 'hooks/useSanitizeSearchQuery';
import { useSearchContext } from 'hooks/useSearchContext';

import Store from 'utils/Store';

const NotFound = React.lazy(() => import('modules/notFound'));
//const Authorize = React.lazy(() => import('modules/public/auth'));

// Public
const Homepage = React.lazy(() => import('modules/public/homepage'));
const Dashboard = React.lazy(() => import('modules/public/homepage/dashboard'));
const PublicationView = React.lazy(() => import('modules/publication/detail'));
const MultiView = React.lazy(
	() => import('modules/publication/detail/MultiView'),
);
const Periodical = React.lazy(() => import('modules/publication/periodical'));
const Browse = React.lazy(() => import('modules/browse'));
const About = React.lazy(() => import('modules/about'));
const Collections = React.lazy(() => import('modules/browse/collections'));
const ExportsDashboard = React.lazy(
	() => import('modules/export/ExportsDashboard'),
);

const AppRoutes: React.FC = () => {
	const { search, pathname } = useLocation();

	const parsed = useSanitizeSearchQuery(search);
	const { state, dispatch } = useSearchContext();

	if (pathname === '/search') {
		Store.set(Store.keys.PreviousSearchQuery, search);
	}
	useEffect(() => {
		if (
			!isEqual(
				omit(parsed, 'nameTagFacet'),
				omit(state.searchQuery, 'nameTagFacet'),
			)
		) {
			console.log('not equal .. dispatching');
			dispatch?.({
				type: 'setSearchQuery',
				searchQuery: {
					...parsed,
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parsed]);
	return (
		<Routes>
			<Route
				path="/"
				element={
					<React.Suspense fallback={<Loader />}>
						<Homepage />
					</React.Suspense>
				}
			/>
			<Route
				path="/test"
				element={
					<React.Suspense fallback={<Loader />}>
						<>Empty test</>
					</React.Suspense>
				}
			/>
			<Route
				path="/collections"
				element={
					<React.Suspense fallback={<Loader />}>
						<Collections />
					</React.Suspense>
				}
			/>
			<Route
				path="/browse"
				element={
					<React.Suspense fallback={<Loader />}>
						<Browse />
					</React.Suspense>
				}
			/>
			<Route
				path="/about"
				element={
					<React.Suspense fallback={<Loader />}>
						<About />
					</React.Suspense>
				}
			/>
			<Route
				path="/search"
				element={
					<React.Suspense fallback={<Loader />}>
						<Dashboard />
					</React.Suspense>
				}
			/>
			<Route
				path="/exports"
				element={
					<React.Suspense fallback={<Loader />}>
						<ExportsDashboard />
					</React.Suspense>
				}
			/>
			<Route
				path="/periodical/:id"
				element={
					<React.Suspense fallback={<Loader />}>
						<Periodical />
					</React.Suspense>
				}
			/>
			<Route
				path="/view/:id"
				element={
					<React.Suspense fallback={<Loader />}>
						<PublicationView />
					</React.Suspense>
				}
			/>
			<Route
				path="/multiview/:id1/:id2"
				element={
					<React.Suspense fallback={<Loader />}>
						<MultiView />
					</React.Suspense>
				}
			/>
			<Route
				path="/uuid/:id"
				element={
					<React.Suspense fallback={<Loader />}>
						<RouteUuid />
					</React.Suspense>
				}
			/>
			{/* Not found route */}
			<Route
				path="*"
				element={
					<React.Suspense fallback={<Loader />}>
						<NotFound />
					</React.Suspense>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
