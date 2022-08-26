/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { BsGridFill } from 'react-icons/bs';
import { ImMenu } from 'react-icons/im';
import { MdEqualizer } from 'react-icons/md';
import _ from 'lodash';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Tabs from 'components/tabs';

import Results from 'modules/searchResult/index';
import SearchResultLeftPanel from 'modules/public/homepage/leftPanel';
import Sorting from 'modules/sorting/Sorting';
import ListExportDialog from 'modules/export/ListExportDialog';
import GraphExportDialog from 'modules/export/GraphExportDialog';

import { theme } from 'theme';

import {
	useSearchPublications,
	useAvailableFilters,
} from 'api/publicationsApi';

import { useSearchContext, ViewMode } from 'hooks/useSearchContext';

import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

const Dashboard: FC = () => {
	const [pagesPublications, setPagesPublications] = useState<
		'publications' | 'pages'
	>('publications');

	const { state, dispatch } = useSearchContext();
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
			px={1}
			mx={0}
			css={css`
				padding-bottom: 0px !important;
				overflow: hidden !important;
			`}
		>
			<Flex bg="white" width={1} height={SUB_HEADER_HEIGHT}>
				<Flex
					flexShrink={0}
					alignItems="center"
					justifyContent="flex-start"
					width={300}
					overflow="hidden"
					css={css`
						border-right: 1px solid ${theme.colors.border};
						transition: width 1s ease-in-out;
					`}
				>
					<Text pl={3} fontSize="sm" fontWeight="bold">
						Výsledky: {state.start + 1} -{' '}
						{state.hasMore ? state.start + state.pageSize : state.totalCount}/{' '}
						{state.totalCount}
					</Text>
				</Flex>
				<Flex width={1} alignItems="center" justifyContent="flex-end" py={2}>
					{/**MODES SWITCHES */}
					<Flex
						mx={3}
						css={css`
							border-right: 1px solid ${theme.colors.border};
						`}
					>
						<Tabs
							tabs={[
								{
									key: 'tiles',
									jsx: (
										<Flex mx={2}>
											<IconButton color="inherit" tooltip="Zobrazení dlažice">
												<BsGridFill size={20} />
											</IconButton>
										</Flex>
									),
								},
								{
									key: 'list',
									jsx: (
										<Flex mx={2}>
											<IconButton color="inherit" tooltip="Zobrazení seznam">
												<ImMenu size={20} />
											</IconButton>
										</Flex>
									),
								},
								{
									key: 'graph',
									jsx: (
										<Flex mx={2}>
											<IconButton
												color="inherit"
												tooltip="Zobrazení grafu statistik"
											>
												<MdEqualizer size={20} />
											</IconButton>
										</Flex>
									),
								},
							]}
							setActiveTab={vm =>
								dispatch?.({ type: 'setViewMode', viewMode: vm as ViewMode })
							}
							activeTab={state.viewMode}
							// activeTab="list"
						/>
					</Flex>
					{/**publikace / stranky */}
					<Flex
						mr={3}
						pr={3}
						alignItems="center"
						css={css`
							border-right: 1px solid ${theme.colors.border};
						`}
					>
						<Text fontSize="sm" fontWeight="bold" ml={2}>
							Zobrazení:
						</Text>
						<Tabs
							tabs={[
								{
									key: 'publications',
									jsx: (
										<Button
											height={30}
											ml={2}
											hoverDisable
											variant={
												pagesPublications === 'publications'
													? 'primary'
													: 'outlined'
											}
										>
											Publikace
										</Button>
									),
								},
								{
									key: 'pages',
									jsx: (
										<Button
											height={30}
											hoverDisable
											ml={2}
											variant={
												pagesPublications === 'pages' ? 'primary' : 'outlined'
											}
										>
											Stránky
										</Button>
									),
								},
							]}
							setActiveTab={k =>
								setPagesPublications(k as 'pages' | 'publications')
							}
							activeTab={pagesPublications}
						/>
					</Flex>
					<Flex mr={3} alignItems="center">
						<Sorting />

						{state.viewMode === 'list' && <ListExportDialog />}
						{state.viewMode === 'graph' && <GraphExportDialog />}
					</Flex>
				</Flex>
			</Flex>
			<Divider />
			<Flex
				css={css`
					width: 100%;
					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
				`}
				bg="paper"
			>
				<Flex
					position="relative"
					alignItems="flex-start"
					flexShrink={0}
					width={300}
					overflowY="auto"
					css={css`
						border-right: 1px solid ${theme.colors.border};
						transition: width 1s ease-in-out;
					`}
				>
					<SearchResultLeftPanel
						key={filtersKey}
						data={filtersData?.availableFilters}
						isLoading={isFiltersLoading}
					/>
				</Flex>
				<Flex width={1} bg="paper">
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
