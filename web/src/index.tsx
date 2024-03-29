import '@reach/dialog/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { TooltipContextProvider } from 'components/tooltip/TooltipCtx';

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
		<QueryClientProvider client={queryClient}>
			<TooltipContextProvider>
				<App />
			</TooltipContextProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
