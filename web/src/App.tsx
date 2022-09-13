import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter as Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { useState } from 'react';

import ErrorBoundary from 'components/ErrorBoundary';
import AppRoutes from 'components/routing/AppRoutes';
import { Flex } from 'components/styled';
import TooltipRender from 'components/tooltip/Tooltip';

import Header from 'modules/header';
import { Loader } from 'modules/loader';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';

import { GlobalStyles, ThemeProvider } from 'theme';

import keycloak from 'auth/KeycloakService';

import { SearchContextProvider } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';
import Store from 'utils/Store';

import ToastifyStyles from 'theme/ToastifyStyles';

const App = () => {
	const [kcError, setKcError] = useState('');
	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Flex as="main" flexDirection="column" minHeight="100vh">
					<ReactKeycloakProvider
						authClient={keycloak}
						LoadingComponent={
							kcError === 'onInitError' ? undefined : <Loader />
						}
						onTokens={tokens => {
							Store.set(Store.keys.Token, tokens.token ?? '');
						}}
						onEvent={event => {
							if (event === 'onInitError') {
								setKcError(event);
							}
						}}
					>
						<Router basename={APP_CONTEXT}>
							<PubDetailCtxProvider>
								<SearchContextProvider>
									<GlobalStyles />
									<ToastifyStyles />
									<Header />
									<AppRoutes />
									<ToastContainer
										position="bottom-center"
										newestOnTop={false}
										closeOnClick
										draggable
										pauseOnHover
										transition={Slide}
										autoClose={5000}
									/>
									<TooltipRender />
								</SearchContextProvider>
							</PubDetailCtxProvider>
						</Router>
					</ReactKeycloakProvider>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
