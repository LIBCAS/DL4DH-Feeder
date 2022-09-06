/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import _ from 'lodash';
import { FC, useState } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import LeftMenuContainer from 'components/sidepanels/LeftMenuContainer';
import { Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import SubHeader from 'components/styled/SubHeader';
import IconButton from 'components/styled/IconButton';

import SearchResultLeftPanel from 'modules/public/homepage/leftPanel';
import Results from 'modules/searchResult/index';
import Sorting from 'modules/sorting/Sorting';

import {
	useAvailableFilters,
	useSearchPublications,
} from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';
import { useMobileView } from 'hooks/useViewport';

import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import DashboardViewModeSwitcher from './DashboardViewModeSwitcher';

const Dashboard: FC = () => {
	const { state } = useSearchContext();
	const [mobileOverride, setMobileOverride] = useState(false);
	const { isMobile } = useMobileView();
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
			<SubHeader
				leftJsx={
					<Flex alignItems="center" justifyContent="center">
						<Text pl={3} fontSize="sm" fontWeight="bold">
							Výsledky: {state.start + 1} -{' '}
							{state.hasMore ? state.start + state.pageSize : state.totalCount}/{' '}
							{state.totalCount}
						</Text>
					</Flex>
				}
				mainJsx={
					<Flex width={1}>
						{isMobile && (
							<IconButton onClick={() => setMobileOverride(p => !p)}>
								<Text color="primary">
									{mobileOverride ? (
										<MdArrowBack size={22} />
									) : (
										<MdArrowForward size={22} />
									)}
								</Text>
							</IconButton>
						)}
						<Flex width={1} justifyContent="flex-end">
							<DashboardViewModeSwitcher />
							<Flex mr={3} alignItems="center">
								<Sorting />
								{/* state.viewMode === 'list' && <ListExportDialog /> */}
								{/* state.viewMode === 'graph' && <GraphExportDialog /> */}
							</Flex>
						</Flex>
					</Flex>
				}
			/>

			<Divider />
			<Flex
				css={css`
					/* width: ${mobileOverride ? 0 : '100%'}; */
					width: 100%;

					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
				`}
				bg="white"
			>
				<LeftMenuContainer mobileOverride={mobileOverride}>
					<SearchResultLeftPanel
						key={filtersKey}
						data={filtersData?.availableFilters}
						isLoading={isFiltersLoading}
					/>
				</LeftMenuContainer>
				<Flex
					width={1}
					bg="paper"
					css={css`
						display: ${mobileOverride ? 'none' : 'flex'};
					`}
				>
					<Results
						data={data}
						stats={availableFilters}
						hasMore={hasMore}
						isLoading={isLoading}
						count={count}
					/>
				</Flex>
			</Flex>
		</ResponsiveWrapper>
	);
};

export default Dashboard;
