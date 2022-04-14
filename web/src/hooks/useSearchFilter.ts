import { Dispatch, useCallback, useMemo, useState } from 'react';

import Store from 'utils/Store';

import useQueryString from './useQueryString';

export type FormFilterProps<T> = {
	filter: T;
	setFilter: Dispatch<T>;
};

const useSearchFilter = <T>(id: string, emptyFilter: T) => {
	// Take initial values from query string
	const qs = useQueryString();
	const queryFilter = useMemo(() => {
		const filter = Object.entries(emptyFilter).reduce(
			(obj, [k]) => (qs.has(k) ? { ...obj, [k]: qs.get(k) } : obj),
			{} as T,
		);

		return Object.keys(filter).length <= 0
			? undefined
			: { ...emptyFilter, ...filter };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [filter, set] = useState({
		...emptyFilter,
		...(queryFilter ?? Store.get<T>(id) ?? {}),
	});

	const [page, setPagePrivate] = useState(0);
	const setPage = useCallback((n: number) => {
		setPagePrivate(n);
	}, []);

	const setFilter = useCallback(
		(f: T) => {
			setPagePrivate(0);
			set(f);
			Store.set(id, f);
		},
		[id],
	);
	return { filter, setFilter, page, setPage };
};

export default useSearchFilter;
