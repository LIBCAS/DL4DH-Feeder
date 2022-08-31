import { FC, useMemo } from 'react';

import { AvailableFilters } from 'api/models';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
};

const EnrichmentFilter: FC<Props> = ({ data, isLoading, updateFilter }) => {
	const items: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze obohacené',
				value: data?.enrichment.ENRICHED ?? 0,
				key: 'ENRICHED',
			},
			{
				key: 'NOT_ENRICHED',
				label: 'Pouze neobohacené',
				value: data?.enrichment.NOT_ENRICHED ?? 0,
			},
		],
		[data],
	);

	return (
		<AccordionFilter
			label="Obohacení"
			isExpanded
			isLoading={isLoading}
			items={items}
			storeKey="enrichment"
			updateFilter={updateFilter('enrichment')}
		/>
	);
};

export default EnrichmentFilter;
