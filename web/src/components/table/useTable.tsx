import { createContext, useContext } from 'react';

type TableContextType<T extends unknown> = {
	height: number;
	data: T[];
};

export const createTableContext = <T extends unknown>() => {
	return createContext<TableContextType<T>>(undefined as never);
};

const TableContext = createContext<TableContextType<{ pid: string }>>({
	height: 100,
	data: [],
});

export const useTableCtx = () => useContext(TableContext);

export const useTable = <T extends unknown>(porps: TableContextType<T>) => {
	return null;
};

export function TableContextProvider(props: { children: React.ReactNode }) {
	const table = useTableCtx();
	return (
		<TableContext.Provider value={table}>
			{props.children}
		</TableContext.Provider>
	);
}
