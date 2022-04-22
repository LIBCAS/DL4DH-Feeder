import { createContext, Dispatch, useContext, useReducer } from 'react';

export type TField = 'author' | 'title' | 'keyword';
export type ViewMode = 'list' | 'graph' | 'tiles';

export type TSearchQuery = {
	q: string;
	field: TField;
	value: string;
};

type State = {
	searchQuery: string;
	viewMode: ViewMode;
	pageSize: number;
	page: number;
	offset: number;
	totalCount: number;
	hasMore: boolean;
};

const initState: State = {
	searchQuery: '',
	viewMode: 'tiles',
	pageSize: 15,
	page: 0,
	offset: 0,
	totalCount: 0,
	hasMore: false,
};

type Actions =
	| { type: 'setTotalCount'; totalCount: number; hasMore: boolean }
	| { type: 'setPage'; page: number }
	| { type: 'setPageSize'; pageSize: number }
	| { type: 'setViewMode'; viewMode: ViewMode };

const reducer = (state: State, action: Actions) => {
	console.log(state);
	switch (action.type) {
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
	return { state, dispatch, Provider: SearchContext.Provider } as const;
};
