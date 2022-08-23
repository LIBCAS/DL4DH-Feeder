import { BrowserRouter as Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import ErrorBoundary from 'components/ErrorBoundary';
import AppRoutes from 'components/routing/AppRoutes';
import { Flex } from 'components/styled';

import Header from 'modules/header';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';
import { Loader } from 'modules/loader';

import { GlobalStyles, ThemeProvider } from 'theme';

import keycloak from 'auth/KeycloakService';

import { useSearchContextProvider } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';
import Store from 'utils/Store';

import ToastifyStyles from 'theme/ToastifyStyles';

const App = () => {
	const {
		state,
		dispatch,
		Provider: SearchContextProvider,
	} = useSearchContextProvider();

	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Flex as="main" flexDirection="column" minHeight="100vh">
					<ReactKeycloakProvider
						authClient={keycloak}
						LoadingComponent={<Loader />}
						onTokens={tokens => {
							Store.set('feeder-token', tokens.token ?? '');
							console.log('KEYCLOAK LOG:');
							console.log({ tokens });
						}}
						onEvent={event => console.log({ event })}
					>
						<Router basename={APP_CONTEXT}>
							<PubDetailCtxProvider>
								<SearchContextProvider value={[state, dispatch]}>
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
