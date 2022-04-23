import { useCallback } from 'react';

import TestSelect from 'components/form/select/TestSelect';
import Text from 'components/styled/Text';

import { useSearchContext } from 'hooks/useSearchContext';

export type SortOption = {
	id: string;
	label: string;
};

export const sortOptions: SortOption[] = [
	{ id: 'asc1', label: 'Dle autora 1' },
	{ id: 'asc2', label: 'Dle autora 2' },
	{ id: 'asc3', label: 'Dle nazvu 3' },
	{ id: 'asc4', label: 'Dle data pridani 4' },
	{ id: 'asc5', label: 'Dle jineho 5' },
	{ id: 'asc6', label: 'ASC 6' },
];

const Sorting = () => {
	const { state, dispatch } = useSearchContext();
	const setSortOption = useCallback(
		(sortOption: SortOption) => dispatch?.({ type: 'setSorting', sortOption }),
		[dispatch],
	);

	return (
		<>
			<Text mr={2}>Řazení</Text>
			<TestSelect
				value={state.sorting}
				options={sortOptions}
				onChange={setSortOption}
				keyFromOption={item => item?.id ?? ''}
				width={150}
				nameFromOption={item => (item !== null ? item.label : '')}
			/>
		</>
	);
};

export default Sorting;
