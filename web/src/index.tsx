import '@reach/dialog/styles.css';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import keycloak from 'auth/KeycloakService';

import App from './App';
import './index.css';
const queryCache = new QueryCache();
const queryClient = new QueryClient({
	queryCache,
	defaultOptions: {
		queries: { staleTime: Infinity, retry: 1, refetchOnWindowFocus: false },
	},
});

ReactDOM.render(
	<React.StrictMode>
		<ReactKeycloakProvider authClient={keycloak}>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</ReactKeycloakProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
