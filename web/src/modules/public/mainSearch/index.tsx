/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdClear, MdSearch } from 'react-icons/md';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewIcon from '@mui/icons-material/GridView';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { parse } from 'query-string';
import useMeasure from 'react-use-measure';
import ListIcon from '@mui/icons-material/List';
import { MenuItem, Select } from '@material-ui/core';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Tabs from 'components/tabs';

import Results from 'modules/searchResult/index';
import SearchResultLeftPanel from 'modules/searchResult/leftPanel';

import { theme } from 'theme';

import {
	TSearchQuery,
	useSearchContextProvider,
	ViewMode,
} from 'hooks/useSearchContext';

import {
	HEADER_WRAPPER_ID,
	INIT_HEADER_HEIGHT,
	SUB_HEADER_HEIGHT,
} from 'utils/useHeaderHeight';

const collapseWidth = theme.breakpointsInt[2];

const MainSearch: FC = () => {
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 200,
	});

	const isMobile = useMemo(
		() => viewportWidth < collapseWidth,
		[viewportWidth],
	);

	const [toSearch, setToSearch] = useState('');
	// const [leftCollapsed, setLeftCollapsed] = useState(false);
	// const [rightCollapsed, setRightCollapsed] = useState(false);
	const [pagesPublications, setPagesPublications] = useState<
		'publications' | 'pages'
	>('publications');
	const [sortOption, setSortOption] = useState<string>('A-ASC');
	// const { search } = useLocation();

	const {
		state,
		dispatch,
		Provider: SearchContextProvider,
	} = useSearchContextProvider();

	// const parsed = parse(search) as unknown as Partial<TSearchQuery>;

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={1}
			mx={0}
			ref={ref}
			css={css`
				padding-bottom: 0px !important;
				overflow: hidden !important;
			`}
			// overflow="hidden"
		>
			<Flex
				id={HEADER_WRAPPER_ID}
				alignItems="center"
				flexDirection="row"
				justifyContent="space-between"
				height={INIT_HEADER_HEIGHT}
				bg="primaryLight"
				overflow="hidden"
			>
				<Flex flexShrink={0} width={300}>
					<NavLinkButton to="/" variant="text" pr={5}>
						<ArrowBackIcon />
						<Flex flexDirection="column" ml={2} justifyContent="center">
							<Text textAlign="left" fontSize="14px" my={0} fontWeight="bold">
								Studijní a vědecká knihovna Plzeňského kraje
							</Text>
							<Text m={0} textAlign="left" fontSize="11px">
								DL4DH Feeder
							</Text>
						</Flex>
					</NavLinkButton>
				</Flex>
				<Flex pr={3} width={1} flexShrink={1}>
					<TextInput
						placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
						label=""
						labelType="inline"
						color="primary"
						value={toSearch}
						iconLeft={
							<Flex color="primary" ml={2}>
								<MdSearch size={26} />
							</Flex>
						}
						iconRight={
							toSearch !== '' ? (
								<Flex mr={3} color="primary">
									<MdClear
										onClick={() => setToSearch('')}
										css={css`
											cursor: pointer;
										`}
									/>
								</Flex>
							) : (
								<></>
							)
						}
						onChange={e => {
							setToSearch(e.currentTarget.value);
						}}
					/>
				</Flex>
				<Flex flexShrink={0}>
					<Button width={150} variant="primary" py={2} mr={[2, 2, 2, 0]}>
						Hledat v K+
					</Button>
					{!isMobile && (
						<>
							<Button variant="text">Sbírky</Button>
							<Button variant="text">Procházet</Button>
							<Button variant="text">Informace</Button>
							<Button variant="text">English</Button>
						</>
					)}
					<Button minWidth={150} variant="primary">
						Přejít do Kraméria
					</Button>
				</Flex>
			</Flex>
			<Divider />
			<SearchContextProvider value={[state, dispatch]}>
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
							{state.hasMore ? state.offset + state.pageSize : state.totalCount}
							/ {state.totalCount}
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
							<Text mr={2}>Řazení</Text>
							<Select
								labelId="sort-select-label"
								id="sort-select"
								value={sortOption}
								onChange={e =>
									setSortOption(e.target.value as unknown as string)
								}
							>
								<MenuItem value={'A-ASC'}>Dle nazvu - ASC</MenuItem>
								<MenuItem value={'A-DESC'}>Dle nazvu - DESC</MenuItem>
								<MenuItem value={'B-ASC'}>Dle autora - ASC</MenuItem>
								<MenuItem value={'B-DESC'}>Dle autora - DESC</MenuItem>
								<MenuItem value={'C-ASC'}>C-ASC</MenuItem>
								<MenuItem value={'C-DESC'}>C-ASC</MenuItem>
								<MenuItem value={'D-ASC'}>D-ASC</MenuItem>
								<MenuItem value={'D-DESC'}>D-ASC</MenuItem>
							</Select>

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
			</SearchContextProvider>
		</ResponsiveWrapper>
	);
};

export default MainSearch;
