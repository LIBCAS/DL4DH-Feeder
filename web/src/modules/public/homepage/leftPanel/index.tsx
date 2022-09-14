/** @jsxImportSource @emotion/react */
import { FC, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Accordion from 'components/accordion';
import LoaderSpin from 'components/loaders/LoaderSpin';
import { Box } from 'components/styled';
import AvailabilityFilter from 'components/filters/Accordions/AvailabilityFilter';
import EnrichmentFilter from 'components/filters/Accordions/EnrichmentFilter';
import KeywordsFilter from 'components/filters/Accordions/KeywordsFilter';
import StatList, { StatItem } from 'components/filters/Accordions/StatList';
import ModelsFilter from 'components/filters/Accordions/ModelsFilter';

import { AvailableFilters } from 'api/models';

import { mapLangToCS } from 'utils/languagesMap';

import ActiveFilters from './ActiveFilters';
import NameTagFilter from './NameTagFilter';
import PublishDateFilter from './PublishDateFilter';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
};

const SearchResultLeftPanel: FC<Props> = ({ data, isLoading }) => {
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

	const authorsItems: StatItem[] = useMemo(
		() =>
			data?.authors
				? [
						...Object.keys(data?.authors).map(key => ({
							key,
							label: key,
							value: data.authors[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.authors],
	);
	const languagesItems: StatItem[] = useMemo(
		() =>
			data?.languages
				? [
						...Object.keys(data?.languages).map(key => ({
							key,
							label: mapLangToCS?.[key] ?? key,
							value: data.languages[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.languages],
	);

	const [searchParams, setSearchParams] = useSearchParams();

	const handleUpdateFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.append(type, key);
			searchParams.delete('page');
			setSearchParams(searchParams);
		},
		[searchParams, setSearchParams],
	);

	const handleChangeFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.set(type, key);
			searchParams.delete('page');
			setSearchParams(searchParams);
		},
		[searchParams, setSearchParams],
	);
	if (isLoading) {
		return (
			<Box p={2} width={1}>
				<LoaderSpin />
			</Box>
		);
	}
	return (
		<Box px={0} width={1}>
			<ActiveFilters />

			<AvailabilityFilter
				data={data}
				updateFilter={handleChangeFilter}
				isLoading={isLoading}
			/>

			<EnrichmentFilter
				data={data}
				updateFilter={handleChangeFilter}
				isLoading={isLoading}
			/>
			<ModelsFilter
				data={data}
				updateFilter={handleUpdateFilter}
				isLoading={isLoading}
			/>

			<KeywordsFilter
				data={data}
				updateFilter={handleUpdateFilter}
				isLoading={isLoading}
			/>
			{authorsItems.length > 0 && (
				<Accordion
					label="Autor"
					isExpanded
					isLoading={isLoading}
					storeKey="authors"
				>
					{onRefresh => (
						<StatList
							items={authorsItems}
							maxRows={3}
							refresh={onRefresh}
							onClick={handleUpdateFilter('authors')}
						/>
					)}
				</Accordion>
			)}
			{languagesItems.length > 0 && (
				<Accordion label="Jazyk" isLoading={isLoading} storeKey="languages">
					{onRefresh => (
						<StatList
							items={languagesItems}
							maxRows={3}
							refresh={onRefresh}
							onClick={handleUpdateFilter('languages')}
						/>
					)}
				</Accordion>
			)}

			<Accordion
				label="Rok vydání"
				isExpanded
				isLoading={isLoading}
				storeKey="publishDateFilter"
			>
				<PublishDateFilter interval={yearsInterval} />
			</Accordion>

			<NameTagFilter />

			<Box height="50px" />
		</Box>
	);
};

// export default memo(SearchResultLeftPanel, (prevProps, nextProps) => {
// 	console.log({ prevProps, nextProps });
// 	return _.isEqual(prevProps, nextProps);
// });

export default SearchResultLeftPanel;
