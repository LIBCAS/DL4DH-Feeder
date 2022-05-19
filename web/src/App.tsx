import { BrowserRouter as Router } from 'react-router-dom';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

import { Flex } from 'components/styled';
import AppRoutes from 'components/routing/AppRoutes';
import ErrorScreen from 'components/error/ErrorScreen';
import ErrorBoundary from 'components/ErrorBoundary';

import { Loader } from 'modules/loader';
import Header from 'modules/header';

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

	const routes = useMemo(() => getUserRoutes(user), [user]);

	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Flex as="main" flexDirection="column" minHeight="100vh">
					<Router basename={APP_CONTEXT}>
						<UserContextProvider value={user}>
							<SearchContextProvider value={[state, dispatch]}>
								<GlobalStyles />
								<Toaster />
								<Header />
								{userResponse.isLoading && <Loader />}
								{userResponse.isError && <ErrorScreen {...userResponse} />}

								{userResponse.isSuccess && <AppRoutes /* routes={routes} */ />}
							</SearchContextProvider>
						</UserContextProvider>
					</Router>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
