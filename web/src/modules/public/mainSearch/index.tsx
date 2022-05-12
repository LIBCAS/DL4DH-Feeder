/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ListIcon from '@mui/icons-material/List';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Tabs from 'components/tabs';

import Results from 'modules/searchResult/index';
import SearchResultLeftPanel from 'modules/searchResult/leftPanel';
import Sorting from 'modules/sorting/Sorting';

import { theme } from 'theme';

import { useSearchContext, ViewMode } from 'hooks/useSearchContext';

import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

const MainSearch: FC = () => {
	// const [leftCollapsed, setLeftCollapsed] = useState(false);
	// const [rightCollapsed, setRightCollapsed] = useState(false);
	const [pagesPublications, setPagesPublications] = useState<
		'publications' | 'pages'
	>('publications');

	const { state, dispatch } = useSearchContext();

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
					// width={leftCollapsed ? 10 : 300}
					overflow="hidden"
					css={css`
						border-right: 1px solid ${theme.colors.border};
						transition: width 1s ease-in-out;
					`}
				>
					<Text pl={3} fontSize="sm" fontWeight="bold">
						Výsledky: {state.offset + 1} -{' '}
						{state.hasMore ? state.offset + state.pageSize : state.totalCount}/{' '}
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
										<IconButton color="inherit" mx={2}>
											<GridViewIcon />
										</IconButton>
									),
								},
								{
									key: 'list',
									jsx: (
										<IconButton color="inherit" mx={2}>
											<ListIcon />
										</IconButton>
									),
								},
								{
									key: 'graph',
									jsx: (
										<IconButton color="inherit" mx={2}>
											<EqualizerIcon />
										</IconButton>
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

						<Button height={30} ml={3} variant="primary">
							Exportovat
						</Button>
					</Flex>
				</Flex>
			</Flex>
			<Divider />
			<Flex
				css={css`
					width: 100%;
					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
				`}
				bg="primaryLight"
			>
				<Flex
					position="relative"
					alignItems="flex-start"
					flexShrink={0}
					width={300}
					overflowY="auto"
					// width={leftCollapsed ? 10 : 300}
					// onClick={() => setLeftCollapsed(p => !p)}
					css={css`
						border-right: 1px solid ${theme.colors.border};
						transition: width 1s ease-in-out;
					`}
				>
					{' '}
					{/*hide button TODO: */}
					{/* <Flex bg="red" position="absolute" right={0} top={0}>
							ahoj
						</Flex> */}
					<SearchResultLeftPanel />
				</Flex>
				<Flex width={1} bg="white">
					<Results />
				</Flex>
				{/* <Flex
						flexShrink={0}
						width={rightCollapsed ? 10 : 300}
						onClick={() => setRightCollapsed(p => !p)}
						css={css`
							border-left: 1px solid ${theme.colors.border};
							transition: width 1s ease-in-out;
						`}
					>
						Menu Right
					</Flex> */}
			</Flex>
		</ResponsiveWrapper>
	);
};

export default MainSearch;
