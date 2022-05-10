import { createContext, Dispatch, useContext, useReducer } from 'react';

import { SortOption, sortOptions } from 'modules/sorting/Sorting';

import { MakeTuple } from 'utils';

export const fieldsTuple = MakeTuple('author', 'title', 'keyword');
export const operationsTuple = MakeTuple('eq', 'neq', 'gt');

export type TField = typeof fieldsTuple[number];
export type TOperation = typeof operationsTuple[number];

export type ViewMode = 'list' | 'graph' | 'tiles';

export type TSearchQuery = {
	q?: string;
	field?: TField;
	operation?: TOperation;
	value?: string;
};

type State = {
	searchQuery: TSearchQuery | null;
	viewMode: ViewMode;
	pageSize: number;
	page: number;
	offset: number;
	totalCount: number;
	hasMore: boolean;
	sorting: SortOption;
};

const initState: State = {
	searchQuery: null,
	viewMode: 'tiles',
	pageSize: 15,
	page: 0,
	offset: 0,
	totalCount: 0,
	hasMore: false,
	sorting: sortOptions[0],
};

type Actions =
	| { type: 'setSearchQuery'; searchQuery: TSearchQuery | null }
	| { type: 'setSorting'; sortOption: SortOption }
	| { type: 'setTotalCount'; totalCount: number; hasMore: boolean }
	| { type: 'setPage'; page: number }
	| { type: 'setPageSize'; pageSize: number }
	| { type: 'setViewMode'; viewMode: ViewMode };

const reducer = (state: State, action: Actions) => {
	switch (action.type) {
		case 'setSearchQuery':
			return {
				...state,
				searchQuery: action.searchQuery,
			};
		case 'setSorting':
			return {
				...state,
				sorting: action.sortOption,
			};
		case 'setPage':
			return {
				...state,
				page: action.page,
				offset: action.page * state.pageSize,
			};
		case 'setPageSize':
			return { ...state, pageSize: action.pageSize, page: 0, offset: 0 };
		case 'setTotalCount':
			return {
				...state,
				totalCount: action.totalCount,
				hasMore: action.hasMore,
			};
		case 'setViewMode':
			return { ...state, viewMode: action.viewMode };

		default:
			return state;
	}
};

const SearchContext = createContext<[State, Dispatch<Actions> | null]>([
	initState,
	null,
]);
export const SearchContextProvider = SearchContext.Provider;
export const useSearchContext = () => {
	const [state, dispatch] = useContext(SearchContext);

	return { state, dispatch };
};

export const useSearchContextProvider = () => {
	const [state, dispatch] = useReducer(reducer, { ...initState });
	//	const { search } = useLocation();
	//	const parsed = parse(search) as unknown as Partial<TSearchQuery>;
	/* 
	useEffect(() => {
		dispatch?.({
			type: 'setSearchQuery',
			searchQuery: { ...state.searchQuery, q: parsed.q },
		});
	}, []);
 */
	return { state, dispatch, Provider: SearchContext.Provider } as const;
};
