import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { StatItem } from './StatList';

import AccordionFilter from '.';

type Props = {
	isLoading?: boolean;
	updateFilter: (type: string) => (key: string) => void;
	withoutCount?: boolean;
	activeItem?: string;
};

const BrowseFilter: FC<Props> = ({ isLoading, updateFilter, activeItem }) => {
	const { t } = useTranslation('browse');
	const browseItems: StatItem[] = useMemo(
		() => [
			{
				label: t('category.doctypes'),
				key: 'models',
			},
			{
				label: t('category.licences'),
				key: 'licenses',
			},
			{
				label: t('category.authors'),
				key: 'authors',
			},
			{
				label: t('category.keywords'),
				key: 'keywords',
			},
			{
				label: t('category.collections'),
				key: 'collections',
			},
			{
				label: t('category.languages'),
				key: 'languages',
			},
		],
		[t],
	);
	const items = useMemo(
		() =>
			browseItems.map(item => ({
				...item,
				bold: activeItem && activeItem === item.key ? true : false,
			})),
		[activeItem, browseItems],
	);
	return (
		<AccordionFilter
			isExpanded
			items={items}
			isLoading={isLoading}
			label={t('category.label')}
			storeKey="browse"
			updateFilter={updateFilter('category')}
		/>
	);
};

export default BrowseFilter;
