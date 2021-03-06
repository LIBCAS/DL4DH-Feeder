import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'modules/loader';

const NotFound = React.lazy(() => import('modules/notFound'));
//const Authorize = React.lazy(() => import('modules/public/auth'));

// Public
const Homepage = React.lazy(() => import('modules/public/homepage'));
const Dashboard = React.lazy(() => import('modules/public/homepage/dashboard'));
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
