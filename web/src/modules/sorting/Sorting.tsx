import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import SimpleSelect from 'components/form/select/SimpleSelect';
import Text from 'components/styled/Text';

import { useSearchContext } from 'hooks/useSearchContext';

import { FiltersSortEnum } from '../../api/models';

export type SortOption = {
	id: FiltersSortEnum;
	label: string;
};

export const sortOptions: SortOption[] = [
	{ id: 'TITLE_ASC', label: 'alphabetical' },
	{ id: 'CREATED_DESC', label: 'newest' },
	{ id: 'DATE_DESC', label: 'latest' },
	{ id: 'DATE_ASC', label: 'earliest' },
];

const Sorting = () => {
	const { state, dispatch } = useSearchContext();
	const setSortOption = useCallback(
		(sortOption: SortOption) => dispatch?.({ type: 'setSorting', sortOption }),
		[dispatch],
	);

	const { t } = useTranslation();

	return (
		<>
			<Text mr={2}>{t('search:ordering:label')}</Text>
			<SimpleSelect
				variant="borderless"
				value={state.sorting}
				options={sortOptions}
				onChange={setSortOption}
				keyFromOption={item => item?.id ?? ''}
				width={150}
				nameFromOption={item =>
					item !== null ? t(`search:ordering:${item.label}`) : ''
				}
			/>
		</>
	);
};

export default Sorting;
