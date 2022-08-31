import { FC, useMemo } from 'react';

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
	const items: StatItem[] = useMemo(
		() =>
			data?.models
				? [
						...Object.keys(data?.models).map(key => ({
							label: modelToText(key as ModelsEnum),
							key,
							value: data.models[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.models],
	);

	return (
		<AccordionFilter
			label="Typ dokumentu"
			isExpanded
			isLoading={isLoading}
			storeKey="models"
			items={items}
			updateFilter={updateFilter('keywords')}
		/>
	);
};

export default ModelsFilter;
