import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableFilters } from 'api/models';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
};

const LanguagesFilter: FC<Props> = ({ data, isLoading, updateFilter }) => {
	const { t } = useTranslation('search');
	const items: StatItem[] = useMemo(
		() =>
			data?.keywords
				? [
						...Object.keys(data?.keywords).map(key => ({
							key,
							label: key,
							value: data.keywords[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.keywords],
	);

	return (
		<AccordionFilter
			maxRows={3}
			items={items}
			isLoading={isLoading}
			label={t('languages')}
			storeKey="languages"
			updateFilter={updateFilter('languages')}
		/>
	);
};

export default LanguagesFilter;
