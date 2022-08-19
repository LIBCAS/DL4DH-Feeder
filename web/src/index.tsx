import '@reach/dialog/styles.css';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import keycloak from 'auth/KeycloakService';

import Store from 'utils/Store';

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
		<ReactKeycloakProvider
			authClient={keycloak}
			onTokens={tokens => {
				Store.set('feeder-token', tokens.token ?? '');
				console.log('KEYCLOAK LOG:');
				console.log({ tokens });
			}}
		>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</ReactKeycloakProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
