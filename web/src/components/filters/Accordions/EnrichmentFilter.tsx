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

const EnrichmentFilter: FC<Props> = ({ data, isLoading, updateFilter }) => {
	const { t } = useTranslation('search');
	const items: StatItem[] = useMemo(
		() => [
			{
				label: t('enrichment.enriched_only'),
				value: data?.enrichment.ENRICHED ?? 0,
				key: 'ENRICHED',
			},
			{
				key: 'NOT_ENRICHED',
				label: t('enrichment.not_enriched_only'),
				value: data?.enrichment.NOT_ENRICHED ?? 0,
			},
		],
		[data, t],
	);

	return (
		<AccordionFilter
			label={t('enrichment.label')}
			isExpanded
			isLoading={isLoading}
			items={items}
			storeKey="enrichment"
			updateFilter={updateFilter('enrichment')}
		/>
	);
};

export default EnrichmentFilter;
