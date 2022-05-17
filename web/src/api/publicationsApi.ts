import { infiniteEndpoint, infiniteMainSearchEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';
import { SolrParams } from 'utils/SolrTypes';

import { getEASMockReadings } from './faker';
import { TPublication } from './models';

export const useSearchPublicationsOld = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));

export const useSearchPublications = infiniteMainSearchEndpoint<
	[json: SolrParams]
>(['search-publication'], (api, json) => api.post('search', { json }));

export const useSearchPublications2 = (json: EASParams) =>
	getEASMockReadings(json.size ?? 15, json.offset ?? 0);
