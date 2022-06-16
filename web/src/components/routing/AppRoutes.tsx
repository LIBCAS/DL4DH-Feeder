import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'modules/loader';
import TestTable from 'modules/tests/table/testtable';

// const Home = React.lazy(() => import('./pages/Home'));
// const About = React.lazy(() => import('./pages/About'));

const NotFound = React.lazy(() => import('modules/notFound'));
//const Authorize = React.lazy(() => import('modules/public/auth'));

// Public
const Homepage = React.lazy(() => import('modules/public/homepage'));
const MainSearch = React.lazy(() => import('modules/public/mainSearch'));
const PublicationView = React.lazy(() => import('modules/publication/detail'));
const Periodical = React.lazy(() => import('modules/publication/periodical'));
const Browse = React.lazy(() => import('modules/browse'));
const About = React.lazy(() => import('modules/about'));
const Collections = React.lazy(() => import('modules/collections'));

const AppRoutes: React.FC = () => {
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
						<TestTable />
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
						<MainSearch />
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
