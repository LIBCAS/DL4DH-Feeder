import React, { createContext, useContext, useMemo, useState } from 'react';

export type UuidHeapObject = {
	selected: boolean;
	title: string;
	enriched: boolean;
	policy: string;
	model: string;
};

export type UuidHeap = Record<string, UuidHeapObject>;

export type BulkExportContextType = {
	uuidHeap: UuidHeap;
	setUuidHeap?: React.Dispatch<React.SetStateAction<UuidHeap>>;
	exportModeOn: boolean;
	setExportModeOn?: React.Dispatch<React.SetStateAction<boolean>>;
};

const BulkExportCtx = createContext<BulkExportContextType>({
	uuidHeap: {},
	exportModeOn: false,
});

export const BulkExportContextProvider: React.FC = ({ children }) => {
	const [uuidHeap, setUuidHeap] = useState<UuidHeap>({});
	const [exportModeOn, setExportModeOn] = useState<boolean>(false);
	const ctx = useMemo(
		() => ({
			uuidHeap,
			setUuidHeap,
			exportModeOn,
			setExportModeOn,
		}),
		[uuidHeap, exportModeOn],
	);

	return (
		<BulkExportCtx.Provider value={ctx}> {children} </BulkExportCtx.Provider>
	);
};

export const useBulkExportContext = () => useContext(BulkExportCtx);
