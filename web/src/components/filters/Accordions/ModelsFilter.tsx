import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AvailableFilters, ModelsEnum } from 'api/models';

import { modelToText } from 'utils/enumsMap';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
};

const ModelsFilter: FC<Props> = ({ data, isLoading, updateFilter }) => {
	const { t } = useTranslation('model');
	const items: StatItem[] = useMemo(
		() =>
			data?.models
				? [
						...Object.keys(data?.models).map(key => ({
							label: t(modelToText(key as ModelsEnum)),
							key,
							value: data.models[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.models, t],
	);

	return (
		<AccordionFilter
			label={t('search:doctypes')}
			isExpanded
			isLoading={isLoading}
			storeKey="models"
			items={items}
			updateFilter={updateFilter('models')}
		/>
	);
};

export default ModelsFilter;
