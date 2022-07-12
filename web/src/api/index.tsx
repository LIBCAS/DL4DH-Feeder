import ky, { ResponsePromise } from 'ky';
import { useInfiniteQuery, useQuery } from 'react-query';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from 'react';

import { OidcUserInfo } from 'modules/public/auth';

import { VsdUser } from 'auth/token';

import { useSearchContext } from 'hooks/useSearchContext';

import {
	ACCESS_TOKEN_CONTEXT,
	APP_CONTEXT,
	OIDC_URL,
	OIDC_USER_INFO_URL,
} from 'utils/enumsMap';
import store from 'utils/Store';

import { Backend } from './endpoints';
import { FiltersDto, SearchDto } from './models';

const FETCH_TIMEOUT = 30000;
const INFINITE_QUERY_RETRY_COUNT = 1;
export const REFETCH_INTERVAL = 30 * 60 * 1000;

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
							console.error('Nepodarilo sa kontaktovať /me api');
							return undefined;
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

		const statistics = useMemo(
			() => result.data?.pages?.flatMap(i => i.availableFilters)[0],
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
			statistics,
		};
	};
