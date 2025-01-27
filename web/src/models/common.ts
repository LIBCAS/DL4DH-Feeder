import { TFunction } from 'react-i18next';

export type TableColumn<T> = {
	datakey: string;
	label?: string;
	dataMapper?: (row: T, translate?: TFunction<string>) => unknown;
	visible?: boolean;
	flex?: number;
	maxWidth?: number;
	sortable?: boolean;
	sortKey?: string;
	CellComponent?: ({
		row,
		...rest
	}: { row: T } & Record<string, unknown>) => React.ReactNode;
};

export interface DomainObject {
	id: string;
}

export interface LabeledObject extends DomainObject {
	label: string;
}

export type Result<T> = {
	page: number;
	pageSize: number;
	total: number;
	items: T[];
};
