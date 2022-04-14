import { createContext, useContext } from 'react';

export type TField = 'author' | 'title' | 'keyword';

export type TSearchQuery = {
	q: string;
	field: TField;
	value: string;
};

export const toSearch = {
	content: '',
};
export const SearchContext = createContext(toSearch);
export const SearchContextProvider = SearchContext.Provider;
export const useSearchContext = () => useContext(SearchContext);
