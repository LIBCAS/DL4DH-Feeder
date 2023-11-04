import { FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import LoaderSpin from 'components/loaders/LoaderSpin';
import { Box } from 'components/styled';
import AvailabilityFilter from 'components/filters/Accordions/AvailabilityFilter';
import EnrichmentFilter from 'components/filters/Accordions/EnrichmentFilter';
import KeywordsFilter from 'components/filters/Accordions/KeywordsFilter';
import ModelsFilter from 'components/filters/Accordions/ModelsFilter';
import AuthorsFilter from 'components/filters/Accordions/AuthorsFilter';
import LanguagesFilter from 'components/filters/Accordions/LanguagesFilter';
import PublishDateFilter from 'components/filters/Accordions/publishDateFilter';

import { AvailableFilters } from 'api/models';

import { CUSTOM_URL_PARAMS } from 'utils/enumsMap';

import ActiveFilters from './ActiveFilters';
import NameTagFilter from './NameTagFilter';

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
};

const SearchResultLeftPanel: FC<Props> = ({ data, isLoading }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const handleUpdateFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.append(type, key);
			searchParams.delete('page');
			searchParams.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
			setSearchParams(searchParams);
		},
		[searchParams, setSearchParams],
	);

	const handleChangeFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.set(type, key);
			searchParams.delete('page');
			searchParams.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
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
			<AuthorsFilter
				data={data}
				updateFilter={handleUpdateFilter}
				isLoading={isLoading}
			/>

			<LanguagesFilter
				data={data}
				updateFilter={handleUpdateFilter}
				isLoading={isLoading}
			/>

			<PublishDateFilter data={data} isLoading={isLoading} />

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
