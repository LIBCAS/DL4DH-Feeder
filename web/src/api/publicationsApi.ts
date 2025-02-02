import { useQueries, useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import _ from 'lodash';

import { api, infiniteMainSearchEndpoint, REFETCH_INTERVAL } from 'api';

import { TSearchQuery, useSearchContext } from 'hooks/useSearchContext';
import { useSearchThroughContext } from 'hooks/useSearchThroughContext';

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

export const usePublicationDetail = (uuid?: string, disabled?: boolean) =>
	useQuery(
		['publication-detail', uuid],
		() =>
			disabled
				? undefined
				: api()
						.get('item/' + uuid)
						.json<PublicationDetail>(),
		{
			retry: 0,
			staleTime: 300000,
			refetchOnWindowFocus: false,
			enabled: !!uuid,
		},
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
//TODO: unite main search  endpoint and availible filters
export const useAvailableFilters2 = (searchQuery?: TSearchQuery) => {
	const { state } = useSearchContext();

	const { variant: searchVariant } = useSearchThroughContext();

	const parsedPage = parseInt(
		(state?.searchQuery?.page as unknown as string) ?? '',
	);
	const page = isNaN(parsedPage) ? 1 : parsedPage;

	const body: Partial<FiltersDto> = {
		start: (page - 1) * (state?.pageSize ?? 0),
		pageSize: state.pageSize,
		sort: state.sorting.id,
		searchThroughPages: searchVariant === 'pages',
		..._.omit(state.searchQuery, 'page'),
		nameTagFacet: searchQuery?.nameTagFacet,
		query: searchQuery?.query ?? state.searchQuery?.query ?? '',
	};
	const json =
		searchQuery?.nameTagFacet === '' ? _.omit(body, 'nameTagFacet') : body;
	return useQuery(['search-publication', json], () =>
		api().post('search', { json }).json<{
			pages: [
				{
					availableFilters: AvailableFilters;
					availableNameTagFilters: AvailableNameTagFilters;
				},
			];
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

export const usePublicationChildren = (uuid: string | undefined) =>
	useQuery(
		['children', uuid],
		() =>
			api()
				.get('item/' + uuid + '/children')
				.json<PublicationChild[]>(),
		//		.then(r => r.filter(c => c.model !== 'internalpart')), //TODO:FIXME:
		{
			staleTime: Infinity,
			refetchOnWindowFocus: false,
			enabled: !!uuid,
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
export const useStreamList = (uuid?: string): StreamsOptions => {
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
			enabled: !!uuid,
		},
	);

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

export const useStreams = (
	uuid: string,
	stream: string,
	mime?: string,
	disabled?: boolean,
) => {
	const [data, setData] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const resp = useQuery(
		['stream', uuid, stream],
		() =>
			api()
				.get(`item/${uuid}/streams/${stream}`, {
					headers: { accept: mime ?? 'application/json' },
					retry: { statusCodes: [408, 413, 429, 502, 503, 504] },
				})
				.then(async r => await r.text()),
		{
			retry: 0,
			refetchInterval: 600000,
			refetchOnWindowFocus: false,
			enabled: !disabled,
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

export const useUnicodeStreams = (
	uuid: string,
	stream: string,
	mime?: string,
	disabled?: boolean,
) => {
	const [data, setData] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	//stackoverflow.com/questions/27318715/blob-url-with-utf-16le-encoding
	const resp = useQuery(
		['stream-unicode', uuid, stream],
		() =>
			api()
				.get(`item/${uuid}/streams/${stream}`, {
					headers: { accept: mime ?? 'text/plain' },
					retry: { statusCodes: [408, 413, 429, 502, 503, 504] },
				})
				.then(async r => {
					const arr = await r.arrayBuffer();
					const uint8Array = new Uint8Array(arr);
					const decoder = new TextDecoder('utf-16le');
					const utf8String = decoder.decode(uint8Array);
					return utf8String;
				}),
		{
			retry: 0,
			refetchInterval: 600000,
			refetchOnWindowFocus: false,
			enabled: !disabled,
		},
	);
	useEffect(() => {
		if (!resp.isLoading) {
			setData(resp.data);
			setIsLoading(false);
		}
	}, [resp]);

	return { data, isLoading };
};
