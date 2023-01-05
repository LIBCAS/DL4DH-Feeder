import { useQuery } from 'react-query';

import { api } from 'api';

//TODO: typing
export const useSearchHistory = (disabled?: boolean) =>
	useQuery('search-history', () => api().get('search/history').json(), {
		staleTime: 600000,
		refetchInterval: 600000,
		refetchOnWindowFocus: false,
		refetchIntervalInBackground: false,
		enabled: !disabled,
	});
