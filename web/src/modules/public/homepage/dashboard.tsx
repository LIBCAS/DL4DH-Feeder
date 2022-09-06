/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import _ from 'lodash';
import { FC } from 'react';

import MainContainer from 'components/layout/MainContainer';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import SearchResultLeftPanel from 'modules/public/homepage/leftPanel';
import Results from 'modules/searchResult/index';
import Sorting from 'modules/sorting/Sorting';

import {
	useAvailableFilters,
	useSearchPublications,
} from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

import DashboardViewModeSwitcher from './DashboardViewModeSwitcher';

const Dashboard: FC = () => {
	const { state } = useSearchContext();

	const {
		data,
		count,
		isLoading: loading,
		isFetching,
		isRefetching,
		hasMore,
		availableFilters,
	} = useSearchPublications({
		start: state.start,
		pageSize: state.pageSize,
		sort: state.sorting.id,
		...state.searchQuery,
	});

	const {
		data: filtersData,
		dataUpdatedAt: filtersKey,
		isLoading: isFiltersLoading,
	} = useAvailableFilters(_.omit(state.searchQuery, 'page'));

	const isLoading = loading || isFetching || isRefetching;

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={0}
			mx={0}
			css={css`
				padding-bottom: 0px !important;
				overflow: hidden !important;
			`}
		>
			<MainContainer
				subHeader={{
					leftJsx: (
						<Flex alignItems="center" justifyContent="center">
							<Text pl={3} fontSize="sm" fontWeight="bold">
								Výsledky: {state.start + 1} -{' '}
								{state.hasMore
									? state.start + state.pageSize
									: state.totalCount}
								/ {state.totalCount}
							</Text>
						</Flex>
					),
					mainJsx: (
						<Flex width={1} justifyContent="flex-end">
							<DashboardViewModeSwitcher />
							<Flex mr={3} alignItems="center">
								<Sorting />
								{/* state.viewMode === 'list' && <ListExportDialog /> */}
								{/* state.viewMode === 'graph' && <GraphExportDialog /> */}
							</Flex>
						</Flex>
					),
				}}
				body={{
					leftJsx: (
						<SearchResultLeftPanel
							key={filtersKey}
							data={filtersData?.availableFilters}
							isLoading={isFiltersLoading}
						/>
					),
				}}
			>
				<Results
					data={data}
					stats={availableFilters}
					hasMore={hasMore}
					isLoading={isLoading}
					count={count}
				/>
			</MainContainer>
		</ResponsiveWrapper>
	);
};

export default Dashboard;
