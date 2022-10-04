import React, { createContext, useContext, useMemo, useState } from 'react';

import { PublicationDto } from 'api/models';

export type SearchResultType = {
	result: PublicationDto[];
	setResult?: React.Dispatch<React.SetStateAction<PublicationDto[]>>;
};

const SearchResultContext = createContext<SearchResultType>({ result: [] });

export const SearchResultContextProvider: React.FC = ({ children }) => {
	const [result, setResult] = useState<PublicationDto[]>([]);
	const ctx = useMemo(
		() => ({
			result,
			setResult,
		}),
		[result, setResult],
	);

	return (
		<SearchResultContext.Provider value={ctx}>
			{children}
		</SearchResultContext.Provider>
	);
};

export const useSearchResultContext = () => useContext(SearchResultContext);
