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
		label: 'Typy dokumentov',
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
			items={items}
			isLoading={isLoading}
			label="Klíčové slovo"
			storeKey="browse"
			updateFilter={updateFilter('category')}
		/>
	);
};

export default BrowseFilter;
