import React, { createContext, useContext, useMemo, useState } from 'react';

export type FullscreenContextType = {
	fullscreen: boolean;
	setFullscreen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const FullscreenContext = createContext<FullscreenContextType>({
	fullscreen: false,
});

export const FullscreenContextProvider: React.FC = ({ children }) => {
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const ctx = useMemo(
		() => ({
			fullscreen,
			setFullscreen,
		}),
		[fullscreen, setFullscreen],
	);

	return (
		<FullscreenContext.Provider value={ctx}>
			{children}
		</FullscreenContext.Provider>
	);
};

export const useFullscreenContext = () => useContext(FullscreenContext);
