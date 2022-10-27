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

const AvailabilityFilter: FC<Props> = ({
	data,
	isLoading,
	updateFilter,
	storeKey,
	withoutCount,
	activeItem,
}) => {
	const { t } = useTranslation('search');
	const items: StatItem[] = useMemo(
		() => [
			{
				label: t('accessibility.public'),
				value: withoutCount ? undefined : data?.availability.public ?? 0,
				key: 'PUBLIC',
				bold: activeItem && activeItem === 'PUBLIC' ? true : false,
			},
			{
				key: 'PRIVATE',
				label: t('accessibility.private'),
				value: withoutCount ? undefined : data?.availability.private ?? 0,
				bold: activeItem && activeItem === 'PRIVATE' ? true : false,
			},
			{
				key: 'ALL',
				label: t('accessibility.all'),
				bold: activeItem && activeItem === 'ALL' ? true : false,
				value: withoutCount
					? undefined
					: (data?.availability.private ?? 0) +
					  (data?.availability.public ?? 0),
			},
		],
		[data, withoutCount, activeItem, t],
	);

	return (
		<AccordionFilter
			label={t('accessibility.label')}
			isExpanded
			isLoading={isLoading}
			storeKey={storeKey ?? 'availability'}
			items={items}
			updateFilter={updateFilter('availability')}
		/>
	);
};

export default AvailabilityFilter;
