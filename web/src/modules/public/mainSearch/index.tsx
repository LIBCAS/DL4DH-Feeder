/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MdClear, MdMenu, MdSearch } from 'react-icons/md';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewIcon from '@mui/icons-material/GridView';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { parse } from 'query-string';
import useMeasure from 'react-use-measure';
import ListIcon from '@mui/icons-material/List';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import SelectInput from 'components/form/select/SelectInput';

import Results from 'modules/searchResult/index';

import { theme } from 'theme';

import { SearchContextProvider, TSearchQuery } from 'hooks/useSearchContext';

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
	const [leftCollapsed, setLeftCollapsed] = useState(false);
	const [rightCollapsed, setRightCollapsed] = useState(false);
	const { search } = useLocation();
	const parsed = parse(search) as unknown as Partial<TSearchQuery>;
	console.log(parsed);

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
			overflow="hidden"
		>
			<Flex
				id={HEADER_WRAPPER_ID}
				alignItems="center"
				flexDirection="row"
				justifyContent="space-between"
				height={INIT_HEADER_HEIGHT}
				bg="primaryLight"
			>
				<Flex flexShrink={0} width={300}>
					<NavLinkButton to="/" variant="text">
						<ArrowBackIcon />
						Moravska zemska knihovna
					</NavLinkButton>
				</Flex>
				<Flex pr={3} width={1} flexShrink={1}>
					<TextInput
						label=""
						labelType="inline"
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
							<Button variant="text">Sbirky</Button>
							<Button variant="text">Prochadzet</Button>
							<Button variant="text">Informace</Button>
							<Button variant="text">English</Button>
						</>
					)}
					<Button minWidth={150} variant="primary">
						Prejit do Krameria
					</Button>
				</Flex>
			</Flex>
			<Divider />
			<SearchContextProvider value={{ content: toSearch }}>
				<Flex bg="white" width={1} height={SUB_HEADER_HEIGHT}>
					<Flex
						flexShrink={0}
						width={leftCollapsed ? 10 : 300}
						overflow="hidden"
						css={css`
							border-right: 1px solid ${theme.colors.border};
							transition: width 1s ease-in-out;
						`}
					>
						Vysledky
					</Flex>
					<Flex width={1} alignItems="center" justifyContent="flex-end" py={2}>
						{/**MODES SWITCHES */}
						{/*TODO: make TABS component*/}
						<Flex
							mx={3}
							css={css`
								border-right: 1px solid ${theme.colors.border};
							`}
						>
							<IconButton
								onClick={() => alert('mode switch')}
								color="primary"
								mx={2}
							>
								<GridViewIcon />
							</IconButton>
							<IconButton
								onClick={() => alert('mode switch')}
								color="primary"
								mx={2}
							>
								<ListIcon />
							</IconButton>
							<IconButton
								onClick={() => alert('mode switch')}
								color="primary"
								mx={2}
							>
								<EqualizerIcon />
							</IconButton>
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
							<Button height={30} ml={2} variant="primary">
								Publikace
							</Button>
							<Button height={30} ml={2} variant="outlined">
								Stránky
							</Button>
						</Flex>
						<Flex mx={3} alignItems="center">
							<SelectInput
								label="Razeni"
								labelMinWidth="0px"
								options={['m1', 'm2', 'm3', 'm4']}
								value={''}
								onSetValue={() => 'm1'}
								id="sortopt"
								borderless
							/>
							<Button height={30} ml={2} variant="primary">
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
						alignItems="flex-start"
						flexShrink={0}
						width={leftCollapsed ? 10 : 300}
						onClick={() => setLeftCollapsed(p => !p)}
						css={css`
							border-right: 1px solid ${theme.colors.border};
							transition: width 1s ease-in-out;
						`}
					>
						Menu left
					</Flex>
					<Flex width={1} bg="white">
						<Results />
					</Flex>
					<Flex
						flexShrink={0}
						width={rightCollapsed ? 10 : 300}
						onClick={() => setRightCollapsed(p => !p)}
						css={css`
							border-left: 1px solid ${theme.colors.border};
							transition: width 1s ease-in-out;
						`}
					>
						Menu Right
					</Flex>
				</Flex>
			</SearchContextProvider>
		</ResponsiveWrapper>
	);
};

export default MainSearch;
