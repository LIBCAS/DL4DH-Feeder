import { useQuery } from 'react-query';

import { api } from 'api';
import { PagableParams, PagableResponse } from 'models/solr';

import { FiltersDto } from './models';

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
				.json<PagableResponse<FiltersDto>>(),
		{
			staleTime: 1,
			refetchInterval: 600000,
			refetchOnWindowFocus: true,
			refetchIntervalInBackground: false,
			enabled: !disabled,
		},
	);

export const useSearchHistoryDetail = (id?: string | null) =>
	useQuery(
		['search-history-detail', id],
		() => api().get(`search/history/${id}`).json<FiltersDto>(),
		{ enabled: !!id, retry: 2 },
	);
