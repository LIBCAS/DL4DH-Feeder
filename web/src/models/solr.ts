export type PagableResponse<T> = {
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;
	numberOfElements: number;
	sort: unknown;
	size: number;
	content: T[];
	number: number;
	empty: boolean;
	pageable: {
		offset: number;
		page: number;
	};
};

export type PagableSort = {
	field: string;
	direction: 'ASC' | 'DESC';
};

export type PagableParams = {
	sort: PagableSort;
	size: number;
	page: number;
};
