import React, { Component } from 'react';

import { Flex } from 'components/styled';
import { NavButton } from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import * as T from './_typing';

//import { isValidBrowser } from 'utils/checkBrowserVersion';
export default class ErrorBoundary extends Component<
	T.ErrorBoundaryProps,
	T.ErrorBoundaryState
> {
	state: T.ErrorBoundaryState = {
		error: undefined,
		eventId: undefined,
		errorInfo: undefined,
		hasError: false,
	};

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error({
			error: JSON.stringify(error, null, 4),
			errorInfo: JSON.stringify(errorInfo, null, 4),
		});
	}

	render() {
		const { hasError, errorInfo, error, eventId } = this.state;

		if (!hasError) {
			return this.props.children;
		}

		const isChunkLoadError = error?.message.match(/^Loading chunk .+ failed$/);

		return (
			<ResponsiveWrapper>
				<Text
					color="text"
					fontSize="xl"
					fontWeight="bold"
					mt={5}
					mb={2}
					as="h2"
				>
					{isChunkLoadError
						? 'Používáte starú verziu webu'
						: 'Na tejto stránke došlo k chybe'}
				</Text>
				{isChunkLoadError && (
					<Text color="textLight">
						Vaša verzia webu nie je aktuálná. Pre vyriešenie tohto problému
						prosím znovu načítajte stránku. Ak problém pretrváva, prosím
						nahláste túto chybu nižšie.
					</Text>
				)}
				<Flex my={3} flexDirection={['column', 'row']}>
					<NavButton
						variant="primary"
						onClick={() => {
							window.location.reload();
						}}
					>
						Znovu načítať stránku
					</NavButton>
					{process.env.NODE_ENV === 'production' && eventId && (
						<NavButton ml={[0, 3]} mt={[3, 0]} variant="primary">
							Nahlásiť chybu
						</NavButton>
					)}
				</Flex>

				{error?.message && (
					<Text fontSize="sm" pb={2}>
						<Text fontWeight="bold" as="span">
							Chyba:{' '}
						</Text>
						{error.message}
					</Text>
				)}

				{errorInfo && (
					<details>
						<summary>Kliknutím zobrazíte podrobnosti o chybe</summary>
						<pre>{errorInfo?.componentStack.toString()}</pre>
					</details>
				)}
			</ResponsiveWrapper>
		);
	}
}
