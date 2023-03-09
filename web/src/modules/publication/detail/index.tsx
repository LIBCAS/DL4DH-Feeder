/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';
import { mapRef } from 'modules/zoomify/ZoomifyView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { useMobileView } from 'hooks/useViewport';
import { WordHighlightContextProvider } from 'hooks/useWordHighlightContext';

import { usePublicationContext } from '../ctx/pub-ctx';

import PublicationSidePanel from './PublicationSidePanel';
import PubMainDetail from './PubMainDetail';

const PublicationDetail = () => {
	const { id } = useParams<{ id: string }>();
	const theme = useTheme();
	const pubChildren = usePublicationChildren(id ?? '');
	const detail = usePublicationDetail(id ?? '');
	const pages = useMemo(() => pubChildren.data ?? [], [pubChildren.data]);
	const [page, setPageUrlParam] = useSearchParams();
	const pubCtx = usePublicationContext();
	const nav = useNavigate();
	const { isMobile } = useMobileView();
	const [rightCollapsed, setRightCollapsed] = useState(isMobile);
	const [leftCollapsed, setLeftCollapsed] = useState(isMobile);

	const pageId = useMemo(
		() => page.get('page') ?? pages[0]?.pid ?? undefined,
		[page, pages],
	);

	useEffect(() => {
		const childIndex = (
			pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered
				: pages
		).findIndex(p => p.pid === pageId);

		pubCtx.setCurrentPage({
			uuid: pageId ?? '',
			childIndex,
			prevPid: pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered[childIndex - 1]?.pid
				: pages[childIndex - 1]?.pid,
			nextPid: pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered[childIndex + 1]?.pid
				: pages[childIndex + 1]?.pid,
		});
		pubCtx.setPublicationChildren(pages);

		if (detail?.data) {
			const context = detail.data?.context?.flat() ?? [];
			pubCtx.setPublication({
				...detail.data,
				context,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages, pageId, detail.data, pubCtx.publicationChildrenFiltered]);
	useEffect(() => {
		if (pubChildren.isSuccess && !pubChildren.data?.[0]?.datanode) {
			nav(`/periodical/${id}`, { replace: true });
		}
	}, [pubChildren.data, nav, pubChildren.isSuccess, id]);

	if (pubChildren.isLoading || detail.isLoading) {
		return <Loader />;
	}
	if (!page.get('page')) {
		page.append('page', pages[0]?.pid ?? 'index-detail-undefined');
		setPageUrlParam(page, { replace: true });
	}

	//TODO: na krameriovi sa rozlisuje URL, ak je to periodical, cize neni datanode, tak to nejde na /view ale na /periodical .. uuid
	const isPublic = detail.data?.policy === 'public';
	const datanode = pubChildren.data?.[0]?.datanode ?? false;

	return (
		<WordHighlightContextProvider>
			<ResponsiveWrapper
				bg="primaryLight"
				px={0}
				mx={0}
				alignItems="flex-start"
				width={1}
				height="100vh"
			>
				<Flex
					width={`calc(100% + ${rightCollapsed ? 300 : 0}px)`}
					css={css`
						transition: width 200ms;
					`}
					onTransitionEnd={() => {
						mapRef.current?.updateSize();
					}}
				>
					<Flex
						overflow="visible"
						width={leftCollapsed ? 0 : 300}
						minWidth={0}
						maxWidth={300}
						zIndex={3}
						css={css`
							transition-duration: 200ms;
							transition-property: width transform;
							transform: translateX(${leftCollapsed ? '-310px' : '0px'});
						`}
					>
						<PublicationSidePanel
							variant="left"
							defaultView="search"
							pages={pages}
							onCollapse={() => setLeftCollapsed(p => !p)}
							isCollapsed={leftCollapsed}
						/>
					</Flex>

					{!datanode ? (
						<Wrapper overflowY="auto" overflowX="hidden" p={3} maxHeight="90vh">
							<PeriodicalTiles data={pubChildren.data} />
							<Text>Dlasie info</Text>
							<Flex flexWrap="wrap">
								{(pubChildren.data ?? []).map(ch => (
									<Flex
										key={ch.pid}
										p={3}
										m={2}
										flexWrap="wrap"
										css={css`
											border: 1px solid ${theme.colors.primary};
										`}
									>
										{Object.keys(ch.details).map(k => (
											<Text key={k} m={2}>
												{k} : {ch.details[k]}
											</Text>
										))}
									</Flex>
								))}
							</Flex>
						</Wrapper>
					) : (
						<Flex height="100vh" width="100%">
							<PubMainDetail page={pageId} leftPublic={isPublic} />
						</Flex>
					)}

					<PublicationSidePanel
						variant="right"
						pages={pages}
						onCollapse={() => setRightCollapsed(p => !p)}
						isCollapsed={rightCollapsed}
					/>
				</Flex>
			</ResponsiveWrapper>
		</WordHighlightContextProvider>
	);
};
export default PublicationDetail;
