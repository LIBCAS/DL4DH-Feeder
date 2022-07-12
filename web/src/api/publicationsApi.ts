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

type StreamList = Record<string, { label: string; mimeType: string }> | null;

export const useStreamList = (uuid: string) => {
	const [data, setData] = useState<StreamList>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream-list', uuid],
		() =>
			api()
				.get(`item/${uuid}/streams`, {
					headers: { accept: 'application/json' },
				})
				.json<StreamList>(),
		{
			retry: 1,
			refetchInterval: REFETCH_INTERVAL,
			refetchOnWindowFocus: false,
		},
	);

	const streams = useQueries(
		Object.keys(data ?? {}).map(k => ({
			queryKey: ['stream', uuid, k],
			queryFn: () =>
				api()
					.get(`item/${uuid}/streams/${k}`, {
						headers: { accept: data?.[k].mimeType ?? 'application/json' },
					})
					.text(),
		})),
	);

	console.log({ streams });

	useEffect(() => {
		if (!resp.isLoading) {
			setData(resp.data ?? null);
			setIsLoading(false);
		}
	}, [resp]);

	return { data, isLoading };
};

export const useStreams = (uuid: string, stream: string, mime?: string) => {
	const [data, setData] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream', stream, uuid],
		() =>
			api()
				.get(`item/${uuid}/streams/${stream}`, {
					headers: { accept: mime ?? 'application/json' },
				})
				.text(),
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
