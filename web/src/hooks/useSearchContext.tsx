import { createContext, Dispatch, FC, useContext, useReducer } from 'react';

import { SortOption, sortOptions } from 'modules/sorting/Sorting';

import { MakeTuple } from 'utils';

import { FiltersDto, NameTagFilterDto } from 'api/models';

import Store from 'utils/Store';

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
	Omit<FiltersDto, 'start' | 'pageSize' | 'sort'> & { page: number }
>;

type State = {
	searchQuery: TSearchQuery | null;
	viewMode: ViewMode;
	pageSize: number;
	start: number;
	totalCount: number;
	hasMore: boolean;
	sorting: SortOption;
};

export const initState: State = {
	searchQuery: { page: 1, nameTagFacet: '' },
	viewMode: Store.get(Store.keys.ViewMode) ?? 'tiles',
	pageSize: 15,
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
	| { type: 'setPageSize'; pageSize: number }
	| { type: 'setViewMode'; viewMode: ViewMode };

export const reducer = (state: State, action: Actions) => {
	switch (action.type) {
		case 'setSearchQuery': {
			const page = action.searchQuery?.page ?? NaN;
			if (!isNaN(page)) {
				return {
					...state,
					searchQuery: action.searchQuery, //: _.omit(action.searchQuery, 'page'),
					page,
					start: (page - 1) * state.pageSize,
				};
			}
			return {
				...state,
				searchQuery: action.searchQuery,
			};
		}
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
			return {
				...state,
				sorting: action.sortOption,
			};

		case 'setPageSize':
			return { ...state, pageSize: action.pageSize, page: 0, start: 0 };
		case 'setTotalCount':
			return {
				...state,
				totalCount: action.totalCount,
				hasMore: action.hasMore,
			};
		case 'setViewMode': {
			Store.set(Store.keys.ViewMode, action.viewMode);
			return { ...state, viewMode: action.viewMode };
		}

		default:
			return state;
	}
};

const SearchContext = createContext<[State, Dispatch<Actions> | null]>([
	initState,
	null,
]);
export const useSearchContext = () => {
	const [state, dispatch] = useContext(SearchContext);
	return { state, dispatch };
};

export const SearchContextProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, { ...initState });

	return (
		<SearchContext.Provider value={[state, dispatch]}>
			{children}
		</SearchContext.Provider>
	);
};
