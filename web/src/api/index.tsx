import ky, { ResponsePromise } from 'ky';
import { useInfiniteQuery } from 'react-query';
import { useEffect, useMemo, useRef } from 'react';

import { useSearchContext } from 'hooks/useSearchContext';

import { APP_CONTEXT } from 'utils/enumsMap';
import store from 'utils/Store';

import { FiltersDto, SearchDto } from './models';

const FETCH_TIMEOUT = 60000;
const INFINITE_QUERY_RETRY_COUNT = 1;
export const REFETCH_INTERVAL = 30 * 60 * 1000;

export const api = (prefix?: string, json?: Partial<FiltersDto>) => {
	return ky.extend({
		prefixUrl: `${APP_CONTEXT}/api/${prefix ?? ''}`,
		timeout: FETCH_TIMEOUT,
		...(json ? { json } : {}),
		retry: { limit: 3 },

		hooks: {
			beforeRequest: [
				request => {
					const token = store.get<string>(store.keys.Token, undefined);
					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					}

					return;
				},
			],
			afterResponse: [
				(_request, _options, response) => {
					// If response contains bearer, save it as token
					if (response.headers.has('bearer')) {
						store.set(store.keys.Token, response.headers.get('bearer'));
					}
					// If unauthorized token, remove it
					if (response.status === 401) {
						store.remove(store.keys.Token);
					}
				},
			],
		},
	});
};

export const infiniteMainSearchEndpoint =
	<Args extends unknown[] = []>(
		key: string[],
		promise: (a: ReturnType<typeof api>, ...args: Args) => ResponsePromise,
	) =>
	(...args: Args) => {
		const { start, pageSize, sort } = args[args.length - 1] as FiltersDto;
		const { state, dispatch } = useSearchContext();
		const result = useInfiniteQuery(
			[...key, ...args],
			async () => {
				const r = await promise(
					api('', {
						start,
						pageSize,
						sort,
						query: state.searchQuery?.query ?? '',
					}),

					...args,
				);
				return await (r.json() as Promise<SearchDto>);
			},
			{
				staleTime: Infinity,
				retry: INFINITE_QUERY_RETRY_COUNT,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
				retryDelay: 3000,
			},
		);

		const data = useMemo(
			() => result.data?.pages.flatMap(i => i.documents.docs),
			[result.data],
		);

		const availableFilters = useMemo(
			() => result.data?.pages?.flatMap(i => i.availableFilters)[0],
			[result.data],
		);

		/* const filteredYears = useMemo(
			() => omit(availableFilters?.years, '0'),
			[availableFilters],
		); */
		/* console.log({ filteredYears }); */

		const availableNameTagFilters = useMemo(
			() => result.data?.pages?.flatMap(i => i.availableNameTagFilters)[0],
			[result.data],
		);

		const page = useMemo(() => {
			if (!result.data || result.data?.pages.length <= 0) {
				return 0;
			}

			return Math.ceil(start / pageSize);
		}, [result.data, start, pageSize]);
		const refCount = useRef(0);
		const count = useMemo(
			() => result.data?.pages[0]?.documents.numFound ?? refCount.current,
			[result.data],
		);
		refCount.current = count;

		const hasMore = useMemo(
			() => start + (data?.length ?? 0) < count,
			[start, count, data],
		);

		useEffect(() => {
			if (state.totalCount !== count) {
				dispatch?.({ type: 'setTotalCount', totalCount: count, hasMore });
			}
		}, [count, hasMore, dispatch, state.totalCount]);

		return {
			...result,
			data,
			count,
			page,
			hasMore,
			availableFilters,
			availableNameTagFilters,
		};
	};
