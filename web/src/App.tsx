import { BrowserRouter as Router } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { ToastContainer, Slide } from 'react-toastify';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import AppRoutes from 'components/routing/AppRoutes';
import ErrorBoundary from 'components/ErrorBoundary';

import Header from 'modules/header';
import { PubDetailCtxProvider } from 'modules/publication/ctx/pub-ctx';
import { Loader } from 'modules/loader';

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

	const { initialized } = useKeycloak();

	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Flex as="main" flexDirection="column" minHeight="100vh">
					<Router basename={APP_CONTEXT}>
						{initialized ? (
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
						) : (
							<>
								<Text>keycloack loading</Text>
								<Loader />
							</>
						)}
					</Router>
				</Flex>
			</ErrorBoundary>
		</ThemeProvider>
	);
};

export default App;
