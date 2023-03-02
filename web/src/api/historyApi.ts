import { useQuery } from 'react-query';

import { api } from 'api';

import { PagableParams, PageFilter } from './models';

//TODO: typing
export const useSearchHistory = (
	{ sort, size, page }: PagableParams,
	disabled?: boolean,
) =>
	useQuery(
		['search-history-list', { sort, size, page }],
		() =>
			api()
				.get(
					`search/history?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
				)
				.json<PageFilter>(),
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
//`search/history?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
