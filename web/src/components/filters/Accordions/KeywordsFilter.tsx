import { FC, useMemo } from 'react';

import { AvailableFilters } from 'api/models';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
};

const KeywordsFilter: FC<Props> = ({ data, isLoading, updateFilter }) => {
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
			label="Klíčové slovo"
			storeKey="keywords"
			updateFilter={updateFilter('keywords')}
		/>
	);
};

export default KeywordsFilter;
