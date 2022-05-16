import '@reach/dialog/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactQueryCacheProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import { QueryCacheInstance } from 'api';

import App from './App';
import './index.css';

ReactDOM.render(
	<React.StrictMode>
		<ReactQueryCacheProvider queryCache={QueryCacheInstance}>
			<App />
			<ReactQueryDevtools />
		</ReactQueryCacheProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
