import React, { createContext, useContext, useMemo } from 'react';

type SidePanelVariant = 'left' | 'right';
export type MultiviewContextType = {
	sidePanel: SidePanelVariant;
};

const MultiviewContext = createContext<MultiviewContextType>({
	sidePanel: 'left',
});

export const MultiviewContextProvider: React.FC<{
	initSidePanel: SidePanelVariant;
}> = ({ initSidePanel, children }) => {
	const ctx = useMemo(
		() => ({
			sidePanel: initSidePanel,
		}),
		[initSidePanel],
	);

	return (
		<MultiviewContext.Provider value={ctx}>
			{children}
		</MultiviewContext.Provider>
	);
};

export const useMultiviewContext = () => useContext(MultiviewContext);
