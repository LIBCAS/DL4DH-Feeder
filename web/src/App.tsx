import { BrowserRouter as Router } from 'react-router-dom';

import { Flex } from 'components/styled';
import AppRoutes from 'components/routing/AppRoutes';
import ErrorBoundary from 'components/ErrorBoundary';

import Header from 'modules/header';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';

import { GlobalStyles, ThemeProvider } from 'theme';

import { useSearchContextProvider } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';

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
					<Router basename={APP_CONTEXT}>
						<PubDetailCtxProvider>
							<SearchContextProvider value={[state, dispatch]}>
								<GlobalStyles />

								<Header />

								<AppRoutes /* routes={routes} */ />
							</SearchContextProvider>
						</PubDetailCtxProvider>
					</Router>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
