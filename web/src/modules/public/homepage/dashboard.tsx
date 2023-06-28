/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import _ from 'lodash';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import MainContainer from 'components/layout/MainContainer';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import AdvancedFilter from 'components/filters/AdvancedFilters';

import SearchResultLeftPanel from 'modules/public/homepage/leftPanel';
import Results from 'modules/searchResult/index';
import Sorting from 'modules/sorting/Sorting';
import { BulkExportModeSwitch } from 'modules/export/BulkExportDialog';
import BulkExportAdditionalButtons from 'modules/export/BulkExportAdditionalButtons';

import {
	useAvailableFilters,
	useSearchPublications,
} from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';
import { useSearchResultContext } from 'hooks/useSearchResultContext';
import { useBulkExportContext } from 'hooks/useBulkExport';
import { useDashboardFilters } from 'hooks/useDashboardFilters';
import { useSearchThroughContext } from 'hooks/useSearchThroughContext';

import DashboardViewModeSwitcher from './DashboardViewModeSwitcher';
import DashboardSearchThroughSwitch from './DashboardSearchThroughSwitch';

const Dashboard: FC = () => {
	const { state } = useSearchContext();
	const { setResult } = useSearchResultContext();
	const { variant: searchVariant } = useSearchThroughContext();
	const { t } = useTranslation();

	const {
		data,
		count,
		isLoading: loading,
		isFetching,
		isRefetching,
		hasMore,
		availableFilters,
	} = useSearchPublications({
		start: ((state?.searchQuery?.page ?? 1) - 1) * state.pageSize,
		pageSize: state.pageSize,
		sort: state.sorting.id,
		searchThroughPages: searchVariant === 'pages',
		..._.omit(state.searchQuery, 'page'),
	});
	const {
		data: filtersData,
		dataUpdatedAt: filtersKey,
		isLoading: isFiltersLoading,
	} = useAvailableFilters(_.omit(state.searchQuery, 'page'));

	const { exportModeOn } = useBulkExportContext();
	const { setDashboardFilters } = useDashboardFilters();

	useEffect(() => {
		if (data) {
			setResult?.(data);
		}
	}, [data, setResult]);

	useEffect(() => {
		if (state.searchQuery) {
			setDashboardFilters?.(state.searchQuery);
		}
	}, [setDashboardFilters, state.searchQuery]);

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
								{t('search:results')}: {state.start + 1} -{' '}
								{state.hasMore
									? state.start + state.pageSize
									: state.totalCount}
								/ {state.totalCount}
							</Text>
						</Flex>
					),
					mainJsx: (
						<Flex width={1} justifyContent="space-between">
							<Flex alignItems="center">
								{exportModeOn && state.viewMode !== 'graph' ? (
									<BulkExportAdditionalButtons />
								) : (
									<AdvancedFilter />
								)}
							</Flex>
							<Flex>
								<DashboardViewModeSwitcher />
								<DashboardSearchThroughSwitch />
								<Flex mr={3} alignItems="center">
									<Sorting />
									{state.viewMode !== 'graph' && <BulkExportModeSwitch />}
									{/* state.viewMode === 'graph' && <GraphExportDialog /> */}
								</Flex>
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
