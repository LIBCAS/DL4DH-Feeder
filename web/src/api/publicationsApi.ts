import { infiniteEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';

import { getEASMockReadings } from './faker';
import { TPublication } from './models';

export const useSearchPublications = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));

export const useSearchPublications2 = (json: EASParams) =>
	getEASMockReadings(json.size ?? 15, json.offset ?? 0);
