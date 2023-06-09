import { useQuery } from 'react-query';

import { api } from 'api';

import { PagableParams, PageFilter } from './models';

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
			staleTime: 1,
			refetchInterval: 600000,
			refetchOnWindowFocus: true,
			refetchIntervalInBackground: false,
			enabled: !disabled,
		},
	);
