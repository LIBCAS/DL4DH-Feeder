import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'modules/loader';

// const Home = React.lazy(() => import('./pages/Home'));
// const About = React.lazy(() => import('./pages/About'));

const NotFound = React.lazy(() => import('modules/notFound'));
const Authorize = React.lazy(() => import('modules/public/auth'));

// Public
const Homepage = React.lazy(() => import('modules/public/homepage'));
const MainSearch = React.lazy(() => import('modules/public/mainSearch'));
const PublicationView = React.lazy(() => import('modules/publication/detail'));

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
						<>test page</>
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
