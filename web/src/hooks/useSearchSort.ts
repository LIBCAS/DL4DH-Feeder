import { useCallback, useMemo, useState } from 'react';

import { EASSorting } from 'utils/EASTypes';
import Store from 'utils/Store';

export type SortOption = {
	label: string;
	field: string;
};

export type StoredSort = {
	key: string;
	order: 'ASC' | 'DESC';
};

export type SortProps = ReturnType<typeof useSearchSort>;

export const useSearchSort = (
	id: string,
	options: Record<string, SortOption | undefined>,
	defaultSort: StoredSort,
) => {
	const [selected, set] = useState(Store.get<StoredSort>(id) ?? defaultSort);
	const setSelected = useCallback(
		(key: string) => {
			set(old => {
				if (!options[key]) {
					return old;
				}
				const newSort: StoredSort = { key, order: 'ASC' };
				if (key === old.key) {
					newSort.order = old.order === 'ASC' ? 'DESC' : 'ASC';
				}

				Store.set(id, newSort);
				return newSort;
			});
		},
		[id, options],
	);
	const sorting = useMemo(
		() =>
			selected && options[selected.key]
				? {
						sort: [
							{
								field: options[selected.key]?.field,
								order: selected.order,
							},
						] as EASSorting[],
				  }
				: {},
		[selected, options],
	);
	const deselect = useCallback(() => {
		set({ key: 'created', order: 'DESC' });
	}, []);
	return {
		sorting,
		selected,
		setSelected,
		deselect,
		options,
	};
};

export default useSearchSort;
