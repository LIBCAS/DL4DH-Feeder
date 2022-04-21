import { infiniteEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';

import { getEASMockReadings } from './faker';
import { TPublication } from './models';

type tt = {
	data: TPublication[] | undefined;
	count: number;
	page: number;
	hasMore: boolean;
};

export const useSearchPublications2 = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));

export const useSearchPublications = (json: EASParams) =>
	getEASMockReadings(json.size ?? 15, json.offset ?? 0);
