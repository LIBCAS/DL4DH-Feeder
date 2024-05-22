import { useQuery } from 'react-query';

import { PagableParams, PagableResponse } from 'models/solr';
import { api } from 'api';
import { ExportDto } from 'models/exports';

export const useExportList = (
	{ sort, size, page }: PagableParams,
	enabled?: boolean,
) =>
	useQuery(
		['export-list', { sort, size, page }],
		() =>
			api()
				.get(
					`exports?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
				)
				.json<PagableResponse<ExportDto>>(),
		{
			refetchOnMount: 'always',
			refetchOnWindowFocus: 'always',
			refetchInterval: 10000,
			enabled,
		},
	);
