import { useCallback } from 'react';

import SimpleSelect from 'components/form/select/SimpleSelect';
import Text from 'components/styled/Text';

import { useSearchContext } from 'hooks/useSearchContext';

import { FiltersSortEnum } from '../../api/models';

export type SortOption = {
	id: FiltersSortEnum;
	label: string;
};

export const sortOptions: SortOption[] = [
	{ id: 'TITLE_ASC', label: 'Abecedně' },
	{ id: 'CREATED_DESC', label: 'Nově přidané' },
	{ id: 'DATE_DESC', label: 'Od nejnovějších' },
	{ id: 'DATE_ASC', label: 'Od nejstarších' },
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
			<SimpleSelect
				variant="borderless"
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
