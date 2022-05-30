import { useQuery } from 'react-query';

import { api, infiniteEndpoint, infiniteMainSearchEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';
import { SolrParams } from 'utils/SolrTypes';

import { getEASMockReadings } from './faker';
import { PublicationChild, TPublication } from './models';

export const useSearchPublicationsOld = infiniteEndpoint<
	TPublication,
	[json: EASParams]
>(['search-publication'], (api, json) => api.post('search/list', { json }));

export const useSearchPublications = infiniteMainSearchEndpoint<
	[json: SolrParams]
>(['search-publication'], (api, json) => api.post('search', { json }));

export const useSearchPublications2 = (json: EASParams) =>
	getEASMockReadings(json.size ?? 15, json.offset ?? 0);

export const getPublicationDetail = async (uuid: string) => {
	const r = await api().get('item/' + uuid);
	return r;
};

export const usePublicationChildren = (uuid: string) =>
	useQuery(['children', uuid], () =>
		api()
			.get('item/' + uuid + '/children')
			.json<PublicationChild[]>(),
	);

//TODO: TODELETE?
export const usePublicationThumbnails = (uuid: string) =>
	useQuery(['thumbnails', uuid], async () => {
		const children = await api()
			.get('item/' + uuid + '/children')
			.json<PublicationChild[]>();

		return (children ?? []).map(async ch => {
			return await api()
				.get('item/' + ch.pid + '/thumb', {
					headers: { accept: 'image/jpeg' },
				})
				.json<string>();
		}) as unknown as string[];
	});

export const useThumbnail = (uuid: string) =>
	useQuery(['thumb', uuid], () =>
		api()
			.get('item/' + uuid + '/thumb', { headers: { accept: 'image/jpeg' } })
			.json<string>(),
	);
