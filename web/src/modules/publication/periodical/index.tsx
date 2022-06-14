/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useContext, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MdCode, MdFormatQuote, MdLock, MdShare } from 'react-icons/md';

import { Flex } from 'components/styled';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';
import Text, { H1, H2 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';

import { Loader } from 'modules/loader';
import TileView from 'modules/searchResult/tiles/TileView';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';
import { TPublication } from 'api/models';

import { SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { PubCtx } from '../ctx/pub-ctx';

import PeriodicalSidePanel from './PeriodicalSidePanel';

const PANEL_WIDTH = 300;

const PeriodicalDetail = () => {
	const { id } = useParams<{ id: string }>();
	const theme = useTheme();
	const pubChildren = usePublicationChildren(id ?? '');
	const detail = usePublicationDetail(id ?? '');
	const pages = useMemo(() => pubChildren.data ?? [], [pubChildren.data]);
	const [page] = useSearchParams();
	const pubCtx = useContext(PubCtx);
	const nav = useNavigate();

	const pageId = useMemo(
		() => page.get('page') ?? pages[0]?.pid ?? undefined,
		[page, pages],
	);

	useEffect(() => {
		const childIndex = pages.findIndex(p => p.pid === pageId);
		pubCtx.setCurrentPage({
			uuid: pageId ?? '',
			childIndex,
			prevPid: pages[childIndex - 1]?.pid,
			nextPid: pages[childIndex + 1]?.pid,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages, pageId]);
	//TODO:
	useEffect(() => {
		console.log({ detail: detail.data });
		console.log({ children: pubChildren.data });
		if (pubChildren.data?.[0]?.model === 'periodicalitem') {
			nav('/view/' + pubChildren.data?.[0].pid, { replace: true });
		}
	}, [pubChildren.data, detail.data, nav]);

	if (pubChildren.isLoading || detail.isLoading) {
		return <Loader />;
	}
	//TODO: na krameriovi sa rozlisuje URL, ak je to periodical, cize neni datanode, tak to nejde na /view ale na /periodical .. uuid
	const isPublic = detail.data?.policy === 'public';
	const datanode = pubChildren.data?.[0]?.datanode ?? false;

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={1}
			mx={0}
			alignItems="flex-start"
			width={1}
			height="100vh"
		>
			<Flex
				width={1}
				bg="white"
				height={SUB_HEADER_HEIGHT + 10}
				css={css`
					border-bottom: 1px solid ${theme.colors.border};
				`}
			>
				<Flex
					width={PANEL_WIDTH}
					maxWidth={PANEL_WIDTH}
					css={css`
						border-right: 1px solid ${theme.colors.border};
					`}
					alignItems="center"
				>
					<Flex pl={3}>
						<Text>
							Výsledky: <strong>1</strong>
						</Text>
					</Flex>
				</Flex>
				<Flex width="auto" flexGrow={1} px={3} alignItems="center">
					<Text fontSize="20px" color="textCommon">
						{detail.data?.title ?? 'Periodikum'}
					</Text>
				</Flex>
				<Flex
					alignItems="center"
					justifyContent="flex-end"
					width={PANEL_WIDTH}
					css={css`
						border-left: 1px solid ${theme.colors.border};
					`}
				>
					<IconButton mr={3} color="textCommon">
						<MdCode size={22} />
					</IconButton>
					<IconButton mr={3} color="textCommon">
						<MdFormatQuote size={22} />
					</IconButton>
					<IconButton mr={3} color="textCommon">
						<MdShare size={22} />
					</IconButton>
				</Flex>
			</Flex>
			<Flex width={1}>
				<PeriodicalSidePanel
					variant="left"
					defaultView="search"
					pages={pages}
				/>
				{isPublic ? (
					<>
						{!datanode ? (
							<Wrapper
								overflowY="auto"
								overflowX="hidden"
								p={3}
								maxHeight="90vh"
							>
								<PeriodicalTiles data={pubChildren.data} />
							</Wrapper>
						) : (
							<Flex height="100vh" width="100%">
								MAIN DETAIL
							</Flex>
						)}
					</>
				) : (
					<Flex
						width="100%"
						p={4}
						alignItems="center"
						justifyContent="center"
						fontWeight="bold"
						fontSize="xl"
						height="100vh"
					>
						<Flex
							justifyContent="center"
							alignItems="center"
							flexDirection="column"
							mt={-100}
						>
							<MdLock size={60} />
							<Text>Tento dokument není veřejný</Text>
						</Flex>
					</Flex>
				)}

				<PeriodicalSidePanel variant="right" pages={pages} />
			</Flex>
		</ResponsiveWrapper>
	);
};
export default PeriodicalDetail;
