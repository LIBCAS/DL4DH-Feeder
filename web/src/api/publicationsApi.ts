import { infiniteEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';

import { TPublication } from './models';

export const useSearchPublications = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));
