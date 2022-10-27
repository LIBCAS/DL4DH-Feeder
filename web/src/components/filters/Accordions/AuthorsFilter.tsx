import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableFilters } from 'api/models';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
	storeKey?: string;
	withoutCount?: boolean;
	activeItem?: string;
};

const AuthorsFilter: FC<Props> = ({
	data,
	isLoading,
	updateFilter,
	storeKey,
}) => {
	const { t } = useTranslation('search');
	const authorsItems: StatItem[] = useMemo(
		() =>
			data?.authors
				? [
						...Object.keys(data?.authors).map(key => ({
							key,
							label: key,
							value: data.authors[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.authors],
	);

	return (
		<AccordionFilter
			label={t('authors')}
			isExpanded
			maxRows={3}
			isLoading={isLoading}
			storeKey={storeKey ?? 'authors'}
			items={authorsItems}
			updateFilter={updateFilter('authors')}
		/>
	);
};

export default AuthorsFilter;
