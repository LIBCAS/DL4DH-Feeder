import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/accordion';

import { AvailableFilters } from 'api/models';

import PublishDateFilterForm from './PublishDateFilterForm';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
};

const PublishDateFilter: FC<Props> = ({ data, isLoading }) => {
	const { t } = useTranslation('search');

	const yearsInterval = useMemo(() => {
		const years = data?.years;
		if (years) {
			const numYears = Object.keys(years)
				.map(k => parseInt(k))
				.filter(y => y !== 0);
			return { maxYear: Math.max(...numYears), minYear: Math.min(...numYears) };
		} else {
			return undefined;
		}
	}, [data]);

	return (
		<Accordion
			label={t('year-range.label')}
			isExpanded
			isLoading={isLoading}
			storeKey="publishDateFilter"
		>
			<PublishDateFilterForm interval={yearsInterval} />
		</Accordion>
	);
};

export default PublishDateFilter;
