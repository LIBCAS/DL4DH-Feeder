import { BrowserRouter as Router } from 'react-router-dom';
import { useMemo } from 'react';

import { Flex } from 'components/styled';
import AppRoutes from 'components/routing/AppRoutes';
import ErrorScreen from 'components/error/ErrorScreen';
import ErrorBoundary from 'components/ErrorBoundary';

import { Loader } from 'modules/loader';
import Header from 'modules/header';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';

import { useLoggedInUserProvider } from 'api';
import { GlobalStyles, ThemeProvider } from 'theme';

import { getUserRoutes } from 'auth/routes';

import { useSearchContextProvider } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';

const App = () => {
	const { userResponse, UserContextProvider } = useLoggedInUserProvider();
	const {
		state,
		dispatch,
		Provider: SearchContextProvider,
	} = useSearchContextProvider();
	const user = useMemo(
		() => (userResponse.data ? userResponse.data : undefined),
		[userResponse],
	);

	//	const routes = useMemo(() => getUserRoutes(user), [user]);

	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Flex as="main" flexDirection="column" minHeight="100vh">
					<Router basename={APP_CONTEXT}>
						<UserContextProvider value={user}>
							<PubDetailCtxProvider>
								<SearchContextProvider value={[state, dispatch]}>
									<GlobalStyles />

									<Header />
									{userResponse.isLoading && <Loader />}
									{userResponse.isError && <ErrorScreen {...userResponse} />}

									{userResponse.isSuccess && (
										<AppRoutes /* routes={routes} */ />
									)}
								</SearchContextProvider>
							</PubDetailCtxProvider>
						</UserContextProvider>
					</Router>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
