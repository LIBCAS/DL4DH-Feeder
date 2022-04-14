import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Lazy from 'auth/lazyComps';

import { LazyRoute, RouterItem } from './LazyRoute';

type Props = {
	routes: RouterItem[];
};

const AppRoutes: React.FC<Props> = ({ routes }) => {
	return (
		<Switch>
			{routes.map(route => {
				if (route.type === 'route') {
					return (
						<Route
							key={`app-route-${route.path}`}
							exact
							path={route.path}
							render={route.render}
						/>
					);
				} else if (route.type === 'redirect') {
					return (
						<Route key={`app-redirect-${route.path}`} exact path={route.path}>
							<Redirect to={route.to} />
						</Route>
					);
				} else {
					throw new Error(`Unhandled route type ${route}`);
				}
			})}

			{/* Not found route */}
			<Route exact render={LazyRoute(Lazy.NotFound)} />
		</Switch>
	);
};

export default AppRoutes;
