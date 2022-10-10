import React, { createContext, useContext, useMemo, useState } from 'react';

import { PublicationDto } from 'api/models';

export type UuidHeap = Record<
	string,
	{
		selected: boolean;
		title: string;
		enriched: boolean;
		//TODO: get rid of title and enriched
		publication: PublicationDto;
	}
>;

export type BulkExportContextType = {
	uuidHeap: UuidHeap;
	setUuidHeap?: React.Dispatch<React.SetStateAction<UuidHeap>>;
};

const BulkExportCtx = createContext<BulkExportContextType>({ uuidHeap: {} });

export const BulkExportContextProvider: React.FC = ({ children }) => {
	const [uuidHeap, setUuidHeap] = useState<UuidHeap>({});
	const ctx = useMemo(
		() => ({
			uuidHeap,
			setUuidHeap,
		}),
		[uuidHeap, setUuidHeap],
	);

	return (
		<BulkExportCtx.Provider value={ctx}> {children} </BulkExportCtx.Provider>
	);
};

export const useBulkExportContext = () => useContext(BulkExportCtx);
