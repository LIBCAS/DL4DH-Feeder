import { useMemo } from 'react';

import { easRange } from 'utils';

import { Backend } from 'api/endpoints';

import useSearchFilter from 'hooks/useSearchFilter';
import useSearchSort, { SortOption, StoredSort } from 'hooks/useSearchSort';

import { EASFilter } from 'utils/EASTypes';

import { TColumnsLayout } from './helpers';

type ReadingState = Backend.ReadingState;

//TODO:
type TAdminFilter = {
	deliveryPoint: string;
	barcode: string;
	record1: number;
	record2: number;
	readingDate: Date;
	definiteEvaluation: Date;
	email: string;
	state: ReadingState[];
};

export const FILTER_INIT_VALUES: TAdminFilter = {
	deliveryPoint: '',
	barcode: '',
	record1: '' as unknown as number,
	record2: '' as unknown as number,
	readingDate: undefined as unknown as Date,
	definiteEvaluation: undefined as unknown as Date,
	email: '',
	state: [] as unknown as ReadingState[],
};

const useAdminFilter = () => {
	const filters = useSearchFilter(
		'vsd-admin-overview-filters',
		FILTER_INIT_VALUES,
	);

	const SORT_OPTIONS: Record<keyof Pick<TColumnsLayout, 'title'>, SortOption> =
		{
			title: { label: 'title', field: 'title' },
		};

	/* const SORT_OPTIONS: Record<
		keyof Omit<TColumnsLayout, 'id' | 'meta1' | 'meta2' | 'meta3' | 'toExport'>,
		SortOption
	> = {
		title: { label: 'title', field: 'title' },
		author: { label: 'author', field: 'author' },
		published: { label: 'published', field: 'published' },
		pages: { label: 'pages', field: 'pages' },
	}; */
	const defaultSort = { key: 'title', order: 'DESC' } as StoredSort;

	const sort = useSearchSort(
		'vsd-admin-overview-sort',
		SORT_OPTIONS,
		defaultSort,
	);

	const { filter } = filters;
	const { sorting } = sort;
	const params = useMemo(() => {
		const f = [] as EASFilter[];

		if (filter.state.length > 0) {
			f.push({
				operation: 'OR',
				filters: filter.state.map(value => ({
					field: 'state.id',
					operation: 'EQ',
					value,
				})),
			});
		}

		if (filter.email) {
			f.push({
				field: 'customer.email',
				operation: 'EQ',
				value: filter.email,
			});
		}

		if (filter.deliveryPoint) {
			f.push({
				field: 'deliveryPoint',
				operation: 'EQ',
				value: filter.deliveryPoint,
			});
		}

		if (filter.barcode) {
			f.push({
				field: 'barcode',
				operation: 'CONTAINS',
				value: filter.barcode,
			});
		}

		if (filter.record1) {
			f.push({
				field: 'record1',
				operation: 'EQ',
				value: filter.record1.toString(),
			});
		}

		if (filter.record2) {
			f.push({
				field: 'record2',
				operation: 'EQ',
				value: filter.record2.toString(),
			});
		}
		if (filter.readingDate) {
			f.push({
				operation: 'AND',
				filters: easRange('created', filter.readingDate),
			});
		}

		if (filter.definiteEvaluation) {
			f.push({
				operation: 'AND',
				filters: easRange('definiteEvaluation', filter.definiteEvaluation),
			});
		}
		return {
			...(f.length > 0 ? { filters: f } : {}),
			...sorting,
		};
	}, [filter, sorting]);
	return { params, filters, sort };
};

export default useAdminFilter;
