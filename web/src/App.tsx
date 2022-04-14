import { BrowserRouter as Router } from 'react-router-dom';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

import { Flex } from 'components/styled';
import AppRoutes from 'components/routing/AppRoutes';
import ErrorScreen from 'components/error/ErrorScreen';
import ErrorBoundary from 'components/ErrorBoundary';

import { Loader } from 'modules/loader';

import { useLoggedInUserProvider } from 'api';
import { GlobalStyles, ThemeProvider } from 'theme';

import { getUserRoutes } from 'auth/routes';

import { APP_CONTEXT } from 'utils/enumsMap';

const App = () => {
	const { userResponse, UserContextProvider } = useLoggedInUserProvider();
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
							<GlobalStyles />
							<Toaster />
							{userResponse.isLoading && <Loader />}
							{userResponse.isError && <ErrorScreen {...userResponse} />}
							{userResponse.isSuccess && <AppRoutes routes={routes} />}
						</UserContextProvider>
					</Router>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
