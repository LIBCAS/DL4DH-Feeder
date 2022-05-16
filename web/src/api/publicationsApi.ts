import { infiniteEndpoint, api, infiniteEndpoint2 } from 'api';

import { EASParams } from 'utils/EASTypes';
import { SolrParams } from 'utils/SolrTypes';

import { getEASMockReadings } from './faker';
import { SearchDto, TPublication } from './models';

export const useSearchPublicationsOld = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));

export const useSearchPublications = infiniteEndpoint2<
	TPublication,
	[json: SolrParams]
>(['search-publication'], (api, json) => api.post('search', { json }));

export const testSearchPublicationsNew = async () => {
	const json = {
		query: 'Sezemský, Karel',
	};
	const response = await api().post('search', { json }).json<SearchDto>();
};

export const useSearchPublications2 = (json: EASParams) =>
	getEASMockReadings(json.size ?? 15, json.offset ?? 0);
