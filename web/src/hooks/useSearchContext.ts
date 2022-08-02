import { createContext, Dispatch, useContext, useReducer } from 'react';

import { SortOption, sortOptions } from 'modules/sorting/Sorting';

import { MakeTuple } from 'utils';

import { FiltersDto, NameTagFilterDto } from 'api/models';

export const fieldsTuple = MakeTuple(
	'NUMBERS_IN_ADDRESSES',
	'GEOGRAPHICAL_NAMES',
	'INSTITUTIONS',
	'MEDIA_NAMES',
	'NUMBER_EXPRESSIONS',
	'ARTIFACT_NAMES',
	'PERSONAL_NAMES',
	'TIME_EXPRESSIONS',
	'COMPLEX_PERSON_NAMES',
	'COMPLEX_TIME_EXPRESSION',
	'COMPLEX_ADDRESS_EXPRESSION',
	'COMPLEX_BIBLIO_EXPRESSION',
);
export const operationsTuple = MakeTuple('EQUAL', 'NOT_EQUAL');

export type TField = typeof fieldsTuple[number];
export type TOperation = typeof operationsTuple[number];

export type ViewMode = 'list' | 'graph' | 'tiles';

export type TSearchQuery = Partial<
	Omit<FiltersDto, 'start' | 'pageSize' | 'sort'>
>;

type State = {
	searchQuery: TSearchQuery | null;
	viewMode: ViewMode;
	pageSize: number;
	page: number;
	start: number;
	totalCount: number;
	hasMore: boolean;
	sorting: SortOption;
};

export const initState: State = {
	searchQuery: null,
	viewMode: 'tiles',
	pageSize: 15,
	page: 0,
	start: 0,
	totalCount: 0,
	hasMore: false,
	sorting: sortOptions[0],
};

type Actions =
	| { type: 'setSearchQuery'; searchQuery: TSearchQuery | null }
	| { type: 'changeNameTagFilter'; nameTagFilter: NameTagFilterDto | null }
	| { type: 'addNameTagFilter'; nameTagFilter: NameTagFilterDto }
	| { type: 'setSorting'; sortOption: SortOption }
	| { type: 'setTotalCount'; totalCount: number; hasMore: boolean }
	| { type: 'setPage'; page: number }
	| { type: 'setPageSize'; pageSize: number }
	| { type: 'setViewMode'; viewMode: ViewMode };

export const reducer = (state: State, action: Actions) => {
	switch (action.type) {
		case 'setSearchQuery':
			return {
				...state,
				searchQuery: action.searchQuery,
			};
		case 'changeNameTagFilter': {
			if (action.nameTagFilter) {
				const newFilter: NameTagFilterDto[] = [] as NameTagFilterDto[];
				newFilter.push(action.nameTagFilter);
				return {
					...state,
					searchQuery: { ...state.searchQuery, nameTagFilters: newFilter },
				};
			} else {
				return {
					...state,
					searchQuery: { ...state.searchQuery, nameTagFilter: null },
				};
			}
		}
		case 'addNameTagFilter': {
			const newFilter: NameTagFilterDto[] = [
				...(state.searchQuery?.nameTagFilters
					? state.searchQuery.nameTagFilters
					: []),
				action.nameTagFilter,
			];
			return {
				...state,
				searchQuery: { ...state.searchQuery, nameTagFilters: newFilter },
			};
		}
		case 'setSorting':
			console.log(action.sortOption);
			return {
				...state,
				sorting: action.sortOption,
			};
		case 'setPage':
			return {
				...state,
				page: action.page,
				start: action.page * state.pageSize,
			};
		case 'setPageSize':
			return { ...state, pageSize: action.pageSize, page: 0, start: 0 };
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
