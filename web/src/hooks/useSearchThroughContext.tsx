import React, { createContext, useContext, useMemo, useState } from 'react';

export type SearchThroughVariant = 'publications' | 'pages';

export type SearchThroughContextType = {
	variant: SearchThroughVariant;
	setVariant: React.Dispatch<React.SetStateAction<SearchThroughVariant>>;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const SearchThroughContext = createContext<SearchThroughContextType>({
	variant: 'publications',
	setVariant: () => null,
	showModal: false,
	setShowModal: () => null,
});

export const SearchThroughContextProvider: React.FC = ({ children }) => {
	const [variant, setVariant] = useState<SearchThroughVariant>('publications');
	const [showModal, setShowModal] = useState<boolean>(false);

	const ctx = useMemo(
		() => ({
			variant,
			setVariant,
			showModal,
			setShowModal,
		}),
		[variant, setVariant, showModal, setShowModal],
	);

	return (
		<SearchThroughContext.Provider value={ctx}>
			{children}
		</SearchThroughContext.Provider>
	);
};

export const useSearchThroughContext = () => useContext(SearchThroughContext);
