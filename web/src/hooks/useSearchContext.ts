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
	pageSize?: number;
	offset: number;
};

const initState: State = {
	searchQuery: '',
	viewMode: 'tiles',
	pageSize: 15,
	offset: 0,
};

type Actions =
	| { type: 'setPageSize'; pageSize: number }
	| { type: 'setViewMode'; viewMode: ViewMode };

const reducer = (state: State, action: Actions) => {
	switch (action.type) {
		case 'setPageSize':
			return { ...state, pageSize: action.pageSize };
		case 'setViewMode':
			return { ...state, viewMode: action.viewMode };
		default:
			return state;
	}
};

const SearchContext = createContext<[State, Dispatch<Actions>] | [null, null]>([
	null,
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
