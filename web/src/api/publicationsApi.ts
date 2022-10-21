import { useQueries, useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import _ from 'lodash';

import { api, infiniteMainSearchEndpoint, REFETCH_INTERVAL } from 'api';

import { TSearchQuery } from 'hooks/useSearchContext';

import {
	AvailableFilters,
	AvailableNameTagFilters,
	FiltersDto,
	PublicationChild,
	PublicationDetail,
	StreamTypeEnum,
} from './models';

export const useSearchPublications = infiniteMainSearchEndpoint<
	[json: Partial<FiltersDto>]
>(['search-publication'], (api, json) => api.post('search', { json }));

export const useSearchRecommended = infiniteMainSearchEndpoint<
	[json: Partial<FiltersDto>]
>(['search-publication-recommended'], (api, json) =>
	api.post('feed/custom', { json }),
);

export const usePublicationDetail = (uuid: string, disabled?: boolean) =>
	useQuery(
		['publication-detail', uuid],
		() =>
			disabled
				? undefined
				: api()
						.get('item/' + uuid)
						.json<PublicationDetail>(),
		{ retry: 0, staleTime: 300000, refetchOnWindowFocus: false },
	);

export const useAvailableFilters = (searchQuery?: TSearchQuery) => {
	const body: Partial<FiltersDto> = {
		...searchQuery,
		query: searchQuery?.query ?? '',
		pageSize: 1,
		nameTagFacet: searchQuery?.nameTagFacet,
	};
	const json =
		searchQuery?.nameTagFacet === '' ? _.omit(body, 'nameTagFacet') : body;
	return useQuery(['search-filters', _.omit(json, 'page')], () =>
		api().post('search', { json }).json<{
			availableFilters: AvailableFilters;
			availableNameTagFilters: AvailableNameTagFilters;
		}>(),
	);
};

export const usePublicationDetailWithRoot = (
	uuid: string,
	disabled?: boolean,
) =>
	useQuery(
		['publication-detail-with-root', uuid],
		async () => {
			if (disabled) {
				return undefined;
			}
			const mainDetail = await api()
				.get('item/' + uuid)
				.json<PublicationDetail>();

			const rootDetail = await api()
				.get('item/' + mainDetail.root_pid)
				.json<PublicationDetail>();

			return { mainDetail, rootDetail };
		},

		{ retry: 0, staleTime: 300000, refetchOnWindowFocus: false },
	);

export const usePublicationChildren = (uuid: string) =>
	useQuery(
		['children', uuid],
		() =>
			api()
				.get('item/' + uuid + '/children')
				.json<PublicationChild[]>(),
		{
			staleTime: Infinity,
			refetchOnWindowFocus: false,
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
			staleTime: Infinity,
			refetchOnWindowFocus: false,
		},
	);
/***************************THUMBNAILS***************************** */

export type StreamInfoDto = {
	label: string;
	mimeType: string;
	key?: StreamTypeEnum;
};

export type StreamsRecord = Record<StreamTypeEnum, StreamInfoDto> | null;

export type StreamsList = StreamInfoDto[];

export type StreamsOptions = {
	record: StreamsRecord;
	isLoading: boolean;
	list: StreamsList;
};
export const useStreamList = (uuid: string): StreamsOptions => {
	const [record, setRecord] = useState<StreamsRecord | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream-list', uuid],
		() =>
			api()
				.get(`item/${uuid}/streams`, {
					headers: { accept: 'application/json' },
				})
				.json<StreamsRecord>(),
		{
			retry: 0,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	);

	/* 	useQueries(
		Object.keys(list ?? {}).map(k => ({
			queryKey: ['stream', uuid, k],
			queryFn: () =>
				api()
					.get(`item/${uuid}/streams/${k}`, {
						headers: { accept: list?.[k].mimeType ?? 'application/json' },
					})
					.then(async r => {
						if ((list?.[k].mimeType ?? '').includes('json')) {
							return await r.json();
						}
						if ((list?.[k].mimeType ?? '').includes('text')) {
							return await r.text();
						}
						if ((list?.[k].mimeType ?? '').includes('image')) {
							return await r.blob();
						}
						return await r.text();
					})

					.then(r =>
						setList(p => {
							const newState = p;
							if (newState?.[k]) {
								newState[k].response = r;
								return newState;
							}
							return newState;
						}),
					),
			refetchOnWindowFocus: false,
			retry: 1,
			refetchInterval: 0,
			staleTime: 99999,
		})),
	); */
	//{ refetchOnWindowFocus: false, retry: 0, refetchInterval: 0 }

	useEffect(() => {
		if (!resp.isLoading) {
			setRecord(resp.data ?? null);
			setIsLoading(false);
		}
	}, [resp]);

	return {
		list: record
			? Object.keys(record).map(k => ({
					...record[k],
					key: k,
			  }))
			: [],
		record,
		isLoading,
	};
};

export const useStreams = (uuid: string, stream: string, mime?: string) => {
	const [data, setData] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream', uuid, stream],
		() =>
			api()
				.get(`item/${uuid}/streams/${stream}`, {
					headers: { accept: mime ?? 'application/json' },
				})
				.then(r => r.text()),
		{
			retry: 0,
			refetchInterval: 600000,
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

/*

api()
				.get(
					`https://kramerius5.nkp.cz/search/api/v5.0/item/${uuid}/streams/${stream}`,
					{
						headers: { accept: mime ?? 'application/json' },
						timeout: 250,
					},
				)
				.text(),
				*/
