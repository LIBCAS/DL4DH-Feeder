import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import { api, infiniteEndpoint, infiniteMainSearchEndpoint } from 'api';

import { EASParams } from 'utils/EASTypes';
import { SolrParams } from 'utils/SolrTypes';

import { getEASMockReadings } from './faker';
import { PublicationChild, PublicationDetail, TPublication } from './models';

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

export const usePublicationDetail = (uuid: string) =>
	useQuery(
		['publication-detail', uuid],
		() =>
			api()
				.get('item/' + uuid)
				.json<PublicationDetail>(),
		{ staleTime: 30000, refetchOnWindowFocus: false },
	);

export const usePublicationChildren = (uuid: string) =>
	useQuery(
		['children', uuid],
		() =>
			api()
				.get('item/' + uuid + '/children')
				.json<PublicationChild[]>(),
		{
			staleTime: 30000,
			refetchOnWindowFocus: false,
		},
	);
/***************************THUMBNAILS***************************** */
//TODO: TODELETE?
export const usePublicationThumbnails = (uuid: string) =>
	useQuery(
		['thumbnails', uuid],
		async () => {
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
		},
		{ staleTime: 30000, refetchOnWindowFocus: false },
	);
//TODO: TODELETE?
export const useThumbnail = (uuid: string) =>
	useQuery(
		['thumb', uuid],
		() =>
			api()
				.get('item/' + uuid + '/thumb', { headers: { accept: 'image/jpeg' } })
				.json<string>(),
		{ staleTime: 30000, refetchOnWindowFocus: false },
	);

const getThumbnail = async (uuid: string) =>
	await api()
		.get('item/' + uuid + '/thumb', { headers: { accept: 'image/jpeg' } })
		.then(async r => await r.blob());

export const useThumbnails = (pages: PublicationChild[]) => {
	const [thumbs, setThumbs] = useState<string[]>([]);

	useEffect(() => {
		//TODO: timeout, to prioritise iiif picture fetch, find better way
		setTimeout(
			() =>
				pages.forEach(p =>
					getThumbnail(p.pid).then(r => {
						const reader = new FileReader();
						reader.readAsDataURL(r);
						reader.onloadend = () =>
							setThumbs(prev => [...prev, reader.result as string]);
					}),
				),
			100,
		);
	}, []);

	return thumbs;
};

export const useThumbnails2 = (pages: PublicationChild[]) => {
	const thumbs = [];
};

export const useImageProperties = (uuid: string) =>
	useQuery(
		['imageProperties', uuid],
		() =>
			api()
				.get('zoomify/' + uuid + '/ImageProperties.xml', {
					headers: { accept: 'application/xml' },
				})
				.text(),
		{ staleTime: 60000, refetchOnWindowFocus: false, refetchInterval: 5000 },
	);
/***************************THUMBNAILS***************************** */

export const useStreams = (uuid: string, stream: string) => {
	const [data, setData] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream', stream, uuid],
		() => api().get(`item/${uuid}/streams/${stream}`).text(),
		{ retry: 1, refetchInterval: 5000 },
	);
	useEffect(() => {
		if (!resp.isLoading) {
			setData(resp.data ?? '');
			setIsLoading(false);
		}
	}, [resp]);

	return { data, isLoading };
};
