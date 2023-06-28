import React, { createContext, useContext, useMemo, useState } from 'react';

export type SearchThroughVariant = 'publications' | 'pages';

export type SearchThroughContextType = {
	variant: SearchThroughVariant;
	setVariant: React.Dispatch<React.SetStateAction<SearchThroughVariant>>;
};
const SearchThroughContext = createContext<SearchThroughContextType>({
	variant: 'publications',
	setVariant: () => null,
});

export const SearchThroughContextProvider: React.FC = ({ children }) => {
	const [variant, setVariant] = useState<SearchThroughVariant>('publications');

	const ctx = useMemo(
		() => ({
			variant,
			setVariant,
		}),
		[variant, setVariant],
	);

	return (
		<SearchThroughContext.Provider value={ctx}>
			{children}
		</SearchThroughContext.Provider>
	);
};

export const useSearchThroughContext = () => useContext(SearchThroughContext);
