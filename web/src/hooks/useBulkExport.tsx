import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import Store from 'utils/Store';

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
	updateExportHeap?: React.Dispatch<React.SetStateAction<UuidHeap>>;
	exportModeOn: boolean;
	setExportModeOn?: React.Dispatch<React.SetStateAction<boolean>>;
};

let savedBulkExport = {};

try {
	console.log('loading be from ls');
	savedBulkExport = JSON.parse(Store.get(Store.keys.BulkExport) ?? '{}');
} catch (error) {
	console.log('Bulk export LS empty.');
}

const BulkExportCtx = createContext<BulkExportContextType>({
	uuidHeap: savedBulkExport ?? {},
	exportModeOn: false,
});

export const BulkExportContextProvider: React.FC = ({ children }) => {
	const [uuidHeap, setUuidHeap] = useState<UuidHeap>(savedBulkExport ?? {});
	const [exportModeOn, setExportModeOn] = useState<boolean>(false);
	const updateExportHeap = setUuidHeap;

	useEffect(() => {
		Store.set(Store.keys.BulkExport, JSON.stringify(uuidHeap));
	}, [uuidHeap]);

	const ctx = useMemo(
		() => ({
			uuidHeap,
			updateExportHeap,
			exportModeOn,
			setExportModeOn,
		}),
		[uuidHeap, updateExportHeap, exportModeOn],
	);

	return (
		<BulkExportCtx.Provider value={ctx}> {children} </BulkExportCtx.Provider>
	);
};

export const useBulkExportContext = () => useContext(BulkExportCtx);
