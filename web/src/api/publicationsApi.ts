import { useQueries, useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import { api, infiniteMainSearchEndpoint, REFETCH_INTERVAL } from 'api';

import { FiltersDto, PublicationChild, PublicationDetail } from './models';

export const useSearchPublications = infiniteMainSearchEndpoint<
	[json: Partial<FiltersDto>]
>(['search-publication'], (api, json) => api.post('search', { json }));

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
			staleTime: REFETCH_INTERVAL,
			refetchOnWindowFocus: false,
			refetchInterval: REFETCH_INTERVAL,
		},
	);
/***************************THUMBNAILS***************************** */

export const useThumbnails = (pages: PublicationChild[], toIndex: number) =>
	useQueries(
		pages.map((p, index) => ({
			queryKey: ['thumbnail', p.pid],
			queryFn: async () => {
				const resp = await api().get('item/' + p.pid + '/thumb', {
					headers: { accept: 'image/jpeg' },
				});
				const blob = await resp.blob();
				return URL.createObjectURL(blob);
			},
			cacheTime: REFETCH_INTERVAL,
			staleTime: REFETCH_INTERVAL,
			refetchOnWindowFocus: false,
			refetchInterval: REFETCH_INTERVAL,
			enabled: index < toIndex,
		})),
	);

export const useImageProperties = (uuid: string) =>
	useQuery(
		['imageProperties', uuid],
		() =>
			api()
				.get('zoomify/' + uuid + '/ImageProperties.xml', {
					headers: { accept: 'application/xml' },
				})
				.text(),
		{
			staleTime: REFETCH_INTERVAL,
			refetchOnWindowFocus: false,
			refetchInterval: REFETCH_INTERVAL,
		},
	);
/***************************THUMBNAILS***************************** */

export const useStreams = (uuid: string, stream: string) => {
	const [data, setData] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream', stream, uuid],
		() => api().get(`item/${uuid}/streams/${stream}`).text(),
		{
			retry: 1,
			refetchInterval: REFETCH_INTERVAL,
			refetchOnWindowFocus: false,
		},
	);
	useEffect(() => {
		if (!resp.isLoading) {
			setData(resp.data ?? '');
			setIsLoading(false);
		}
	}, [resp]);

	return { data, isLoading };
};
