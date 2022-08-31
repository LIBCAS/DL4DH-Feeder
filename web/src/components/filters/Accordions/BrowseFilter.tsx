import { FC, useMemo } from 'react';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
	withoutCount?: boolean;
	activeItem?: string;
};
const browseItems: StatItem[] = [
	{
		label: 'Typy dokumentů',
		key: 'models',
	},
	{
		label: 'Licence',
		key: 'licenses',
	},
	{
		label: 'Autoři',
		key: 'authors',
	},
	{
		label: 'Klíčová slova',
		key: 'keywords',
	},
	{
		label: 'Sbírky',
		key: 'collections',
	},
	{
		label: 'Jayzky',
		key: 'languages',
	},
];

const BrowseFilter: FC<Props> = ({ isLoading, updateFilter, activeItem }) => {
	const items = useMemo(
		() =>
			browseItems.map(item => ({
				...item,
				bold: activeItem && activeItem === item.key ? true : false,
			})),
		[activeItem],
	);
	return (
		<AccordionFilter
			isExpanded
			items={items}
			isLoading={isLoading}
			label="Procházet"
			storeKey="browse"
			updateFilter={updateFilter('category')}
		/>
	);
};

export default BrowseFilter;
