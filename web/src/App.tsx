import { BrowserRouter as Router } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';

import ErrorBoundary from 'components/ErrorBoundary';
import AppRoutes from 'components/routing/AppRoutes';
import { Flex } from 'components/styled';

import Header from 'modules/header';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';

import { GlobalStyles, ThemeProvider } from 'theme';

import { useSearchContextProvider } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';

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
					<Router basename={APP_CONTEXT}>
						<PubDetailCtxProvider>
							<SearchContextProvider value={[state, dispatch]}>
								<GlobalStyles />
								<ToastifyStyles />
								<Header />
								<AppRoutes />
								<ToastContainer
									position="top-center"
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
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
