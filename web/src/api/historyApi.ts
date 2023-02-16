import { useQuery } from 'react-query';

import { api } from 'api';

import { PageFilter } from './models';

//TODO: typing
export const useSearchHistory = (disabled?: boolean) =>
	useQuery(
		'search-history',
		() => api().get('search/history').json<PageFilter>(),
		{
			staleTime: 600000,
			refetchInterval: 600000,
			refetchOnWindowFocus: false,
			refetchIntervalInBackground: false,
			enabled: !disabled,
		},
	);

// export const useSearchHistory = (disabled?: boolean) =>
// useQuery('search-history', () => api().get('search/history').json<any>(), {
// 	staleTime: 600000,
// 	refetchInterval: 600000,
// 	refetchOnWindowFocus: false,
// 	refetchIntervalInBackground: false,
// 	enabled: !disabled,
// });
