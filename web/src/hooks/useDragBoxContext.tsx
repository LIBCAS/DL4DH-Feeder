import React, { createContext, useContext, useMemo, useState } from 'react';

export type DragBoxContextType = {
	left: {
		dragbox: boolean;
		setDragbox?: React.Dispatch<React.SetStateAction<boolean>>;
	};
	right: {
		dragbox: boolean;
		setDragbox?: React.Dispatch<React.SetStateAction<boolean>>;
	};
};

const DragBoxContext = createContext<DragBoxContextType>({
	left: { dragbox: false },
	right: { dragbox: false },
});

export const DragBoxContextProvider: React.FC = ({ children }) => {
	const [dragboxLeft, setDragboxLeft] = useState<boolean>(false);
	const [dragboxRight, setDragboxRight] = useState<boolean>(false);
	const ctx = useMemo(
		() => ({
			left: { dragbox: dragboxLeft, setDragBox: setDragboxLeft },
			right: { dragbox: dragboxRight, setDragBox: setDragboxRight },
		}),
		[dragboxLeft, dragboxRight],
	);

	return (
		<DragBoxContext.Provider value={ctx}>{children}</DragBoxContext.Provider>
	);
};

export const useDragBoxContext = () => useContext(DragBoxContext);
