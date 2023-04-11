import React, { createContext, useContext, useMemo } from 'react';

type SidePanelVariant = 'left' | 'right';
export type SidepanelContextType = SidePanelVariant;

const SidepanelContext = createContext<SidepanelContextType>('left');

export const SidepanelContextProvider: React.FC<{
	sidepanel: SidePanelVariant;
}> = ({ sidepanel, children }) => {
	const ctx = useMemo(() => sidepanel, [sidepanel]);

	return (
		<SidepanelContext.Provider value={ctx}>
			{children}
		</SidepanelContext.Provider>
	);
};

export const useSidepanelContext = () => useContext(SidepanelContext);
