import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';
import Button from 'components/styled/Button';

type Props = Pick<UseQueryResult<unknown, unknown>, 'error' | 'refetch'> & {
	customMessage?: string;
};

const ErrorScreen: FC<Props> = ({ error, refetch, customMessage }) => (
	<ResponsiveWrapper alignItems="flex-start" mt={4}>
		<Text color="text" fontSize="xl" fontWeight="bold" mt={3} mb={4} as="h2">
			Nastala chyba pri získavaní dát.
			{error ? ` (${(error as Error)?.message ?? 'unknown error'})` : ''}
		</Text>
		<Text>{customMessage && customMessage}</Text>

		<Text>Prosím, skúste operáciu znova.</Text>

		<Button mt={3} onClick={() => refetch()}>
			Skúsiť znova.
		</Button>
	</ResponsiveWrapper>
);

export default ErrorScreen;
