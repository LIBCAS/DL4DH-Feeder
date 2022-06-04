import ky, { ResponsePromise } from 'ky';
import {
	QueryCache,
	QueryConfig,
	useInfiniteQuery,
	useQuery,
} from 'react-query';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import toast from 'react-hot-toast';

import { OidcUserInfo } from 'modules/public/auth';

import { VsdUser } from 'auth/token';

import { useSearchContext } from 'hooks/useSearchContext';

import { EASResult } from 'utils/EASTypes';
import {
	ACCESS_TOKEN_CONTEXT,
	APP_CONTEXT,
	OIDC_URL,
	OIDC_USER_INFO_URL,
} from 'utils/enumsMap';
import store from 'utils/Store';
import { isIntern } from 'utils/FEVersion';

import { Backend } from './endpoints';
import { FiltersDto, SearchDto } from './models';

export const QueryCacheInstance = new QueryCache();

const FETCH_TIMEOUT = 30000;
const INFINITE_QUERY_RETRY_COUNT = 1;

export const api = (prefix?: string, json?: Partial<FiltersDto>) =>
	ky.extend({
		prefixUrl: `${APP_CONTEXT}/api/${prefix ?? ''}`,
		timeout: FETCH_TIMEOUT,
		...(json ? { json } : {}),
		retry: { limit: 3 },
		hooks: {
			beforeRequest: [
				request => {
					const token = store.get<string>(ACCESS_TOKEN_CONTEXT, undefined);
					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					}

					return;
				},
			],
			/* afterResponse: [
				// Handle session expiration
				async (request, _, response) => {
					if (response.status === 403) {
						await QueryCacheInstance.invalidateQueries(['me-oidc']);
						return ky(request);
					}
					return;
				},
			], */
		},
	});

const UserContext = createContext<VsdUser | undefined>(undefined);

export const useLoggedInUserProvider = () => {
	const access_token = store.get<string>(ACCESS_TOKEN_CONTEXT) ?? '';

	const userResponse = useQuery<VsdUser | undefined>(
		'me-oidc',
		useCallback(() => {
			if (access_token) {
				return fetch(`${OIDC_URL}${OIDC_USER_INFO_URL}`, {
					method: 'POST',
					body: new URLSearchParams({ access_token }),
				})
					.then(r => r.json() as Promise<OidcUserInfo>)
					.then(async r => {
						const resp = await api().get('me');
						if (!resp.ok) {
							toast.error('Nepodarilo sa kontaktovať /me api');
							return undefined;
						}

						if (!isIntern()) {
							return {
								personType: 'CUSTOMER',
								...r,
							} as VsdUser;
						}
						const roles = (await resp.json()) as Backend.Role[];
						const personType = roles.some(r => r === 'ADMIN')
							? 'ADMIN'
							: 'EMPLOYEE';

						return {
							personType,
							...r,
						} as VsdUser;
					})
					.catch(() => {
						store.remove(ACCESS_TOKEN_CONTEXT);
						return undefined;
					});
			} else {
				//no token => dont call userinfo
				return undefined;
			}
		}, [access_token]),
		{
			staleTime: Infinity,
		},
	);

	return {
		userResponse,
		UserContextProvider: UserContext.Provider,
	};
};

export const useLoggedInUser = () => useContext(UserContext);

export const authEndpoint =
	<T, Args extends unknown[] = []>(
		key: string[],
		promise: (a: ReturnType<typeof api>, ...args: Args) => ResponsePromise,
		queryConfig?: QueryConfig<T>,
	) =>
	(...args: Args) => {
		//	const user = useLoggedInUser();
		return useQuery(
			[...key, ...args],
			() => promise(api(), ...args).then(r => r.json() as Promise<T>),
			queryConfig,
		);
	};

export const infiniteEndpoint =
	<T, Args extends unknown[] = []>(
		key: string[],
		promise: (a: ReturnType<typeof api>, ...args: Args) => ResponsePromise,
	) =>
	(...args: Args) => {
		const { offset, size } = args[args.length - 1] as {
			offset: number;
			size: number;
		};
		const result = useInfiniteQuery(
			[...key, ...args],
			async () => {
				const r = await promise(
					api('', {
						start: offset,
						pageSize: size,
					}),

					...args,
				);
				return await (r.json() as Promise<EASResult<T>>);
			},
			{
				//	staleTime: Infinity,

				retry: INFINITE_QUERY_RETRY_COUNT,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
				retryDelay: 3000,
				getFetchMore: (p, all) =>
					all[0]?.count > all.flatMap(i => i.items).length
						? p.searchAfter
						: undefined,
			},
		);

		const data = useMemo(
			() => result.data?.flatMap(i => i.items),
			[result.data],
		);

		const page = useMemo(() => {
			if (!result.data || result.data.length <= 0) {
				return 0;
			}

			return Math.ceil(offset / size);
		}, [result.data, offset, size]);
		const refCount = useRef(0);
		const count = useMemo(
			() => result.data?.[0]?.count ?? refCount.current,
			[result.data],
		);
		refCount.current = count;

		const hasMore = useMemo(
			() => offset + (data?.length ?? 0) < count,
			[offset, count, data],
		);

		const { state, dispatch } = useSearchContext();

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
		};
	};

export const infiniteMainSearchEndpoint =
	<Args extends unknown[] = []>(
		key: string[],
		promise: (a: ReturnType<typeof api>, ...args: Args) => ResponsePromise,
	) =>
	(...args: Args) => {
		const { start, pageSize } = args[args.length - 1] as {
			start: number;
			pageSize: number;
		};
		const { state, dispatch } = useSearchContext();
		const result = useInfiniteQuery(
			[...key, ...args],
			async () => {
				const r = await promise(
					api('', {
						start: start,
						pageSize: pageSize,
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
			() => result.data?.flatMap(i => i.documents.docs),
			[result.data],
		);

		const statistics = useMemo(
			() => result.data?.flatMap(i => i.availableFilters)[0],
			[result.data],
		);

		const page = useMemo(() => {
			if (!result.data || result.data.length <= 0) {
				return 0;
			}

			return Math.ceil(start / pageSize);
		}, [result.data, start, pageSize]);
		const refCount = useRef(0);
		const count = useMemo(
			() => result.data?.[0]?.documents.numFound ?? refCount.current,
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
			statistics,
		};
	};
