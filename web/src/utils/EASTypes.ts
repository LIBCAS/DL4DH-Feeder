export type UASFilterOperation = BinaryOp | UnaryOp;

type BinaryOp =
	| 'EQ'
	| 'NEQ'
	| 'GT'
	| 'LT'
	| 'GTE'
	| 'LTE'
	| 'START_WITH'
	| 'END_WITH'
	| 'CONTAINS';
type UnaryOp = 'IS_NULL' | 'NOT_NULL';
type NestedOp = 'OR' | 'AND';

type BinaryFilter = {
	field: string;
	operation: BinaryOp;
	value: string;
};

type UnaryFilter = {
	field: string;
	operation: UnaryOp;
};

type BooleanFilter = {
	operation: NestedOp;
	filters: EASFilter[];
};

type NestedFilter = {
	field: string;
	operation: 'NESTED' | 'NOT';
	filters: EASFilter[];
};

export type EASFilter =
	| BinaryFilter
	| UnaryFilter
	| BooleanFilter
	| NestedFilter;

export type EASSorting = {
	field: string;
	order: 'ASC' | 'DESC';
};

export type EASParams = {
	filters?: EASFilter[];
	sort?: EASSorting[];
	size?: number;
	searchAfter?: string;
	flipDirection?: boolean;
	offset?: number;
	start?: number;
	pageSize?: number;
};

export type EASResult<T> = {
	items: T[];
	count: number;
	searchAfter?: string;
};

export type EASWithDetail<T, D> = {
	[k in keyof T & keyof D]: T[k] extends Array<infer U>
		? D[k] extends Array<infer V>
			? (U | V)[]
			: T[k] | D[k]
		: T[k] | D[k];
} & { [k in Exclude<keyof T, keyof D>]?: T[k] } & {
	[k in Exclude<keyof D, keyof T>]?: D[k];
};
