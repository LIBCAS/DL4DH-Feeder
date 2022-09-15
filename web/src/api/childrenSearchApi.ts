import { useQuery } from 'react-query';

import { api } from 'api';

import { ChildSearchResult } from './models';

export const useChildrenSearch = (
	uuid: string,
	query: string,
	enabled?: boolean,
) =>
	useQuery(
		['children-search', uuid, query],
		() =>
			api()
				.get(`item/${uuid}/children/search?q=${query}`)
				.json<ChildSearchResult>(),
		{ enabled },
	);

export const useChildrenSearchHints = (
	uuid: string,
	query: string,
	enabled?: boolean,
) =>
	useQuery(
		['children-search-hint', uuid, query],
		() =>
			api()
				.get(`item/${uuid}/children/search/hint?q=${query}`)
				.json<ChildSearchResult>(),
		{ enabled },
	);
