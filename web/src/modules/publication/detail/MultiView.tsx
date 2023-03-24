/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import { mapRef, mapRefOfSecond } from 'modules/zoomify/ZoomifyView';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { WordHighlightContextProvider } from 'hooks/useWordHighlightContext';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { usePublicationContext } from '../ctx/pub-ctx';

import PublicationSidePanel from './PublicationSidePanel';
import PubMainDetail from './PubMainDetail';
//http://localhost:3000/view/uuid:0bec6e50-11e1-11eb-a4cf-005056827e52?page=uuid:18617fd7-cc78-4042-95aa-c7e7ce6363aa
const MultiView = () => {
	const { id1, id2 } = useParams<{ id1: string; id2: string }>();

	const pubChildren1 = usePublicationChildren(id1 ?? '');
	const detail1 = usePublicationDetail(id1 ?? '');
	const pages1 = useMemo(() => pubChildren1.data ?? [], [pubChildren1.data]);

	const pubChildren2 = usePublicationChildren(id2 ?? '');
	const detail2 = usePublicationDetail(id2 ?? '');
	const pages2 = useMemo(() => pubChildren2.data ?? [], [pubChildren2.data]);

	const [sp, setSp] = useSearchParams();
	const pubCtx = usePublicationContext();
	const [rightCollapsed, setRightCollapsed] = useState(false);
	const [leftCollapsed, setLeftCollapsed] = useState(false);

	const pageId1 = useMemo(
		() => sp.get('page') ?? pages1[0]?.pid ?? undefined,
		[sp, pages1],
	);

	const pageId2 = useMemo(
		() => sp.get('page2') ?? pages2[0]?.pid ?? undefined,
		[sp, pages2],
	);

	useEffect(() => {
		if (detail1?.data) {
			const context = detail1.data?.context?.flat() ?? [];
			pubCtx.setPublication({
				...detail1.data,
				context,
			});
		}
		const childIndex = (
			pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered
				: pages1
		).findIndex(p => p.pid === pageId1);

		pubCtx.setCurrentPage({
			uuid: pageId1 ?? '',
			childIndex,
			prevPid: pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered[childIndex - 1]?.pid
				: pages1[childIndex - 1]?.pid,
			nextPid: pubCtx.publicationChildrenFiltered
				? pubCtx.publicationChildrenFiltered[childIndex + 1]?.pid
				: pages1[childIndex + 1]?.pid,
		});
		pubCtx.setPublicationChildren(pages1);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages1, pageId1, detail1.data, pubCtx.publicationChildrenFiltered]);

	useEffect(() => {
		if (detail2?.data) {
			const context = detail2.data?.context?.flat() ?? [];
			pubCtx.setSecondPublication({
				...detail2.data,
				context,
			});
		}
		//

		const childIndex2 = (
			pubCtx.publicationChildrenFilteredOfSecond
				? pubCtx.publicationChildrenFilteredOfSecond
				: pages2
		).findIndex(p => p.pid === pageId2);

		pubCtx.setCurrentPageOfSecond({
			uuid: pageId2 ?? '',
			childIndex: childIndex2,
			prevPid: pubCtx.publicationChildrenFilteredOfSecond
				? pubCtx.publicationChildrenFilteredOfSecond[childIndex2 - 1]?.pid
				: pages2[childIndex2 - 1]?.pid,
			nextPid: pubCtx.publicationChildrenFilteredOfSecond
				? pubCtx.publicationChildrenFilteredOfSecond[childIndex2 + 1]?.pid
				: pages2[childIndex2 + 1]?.pid,
		});
		pubCtx.setPublicationChildrenOfSecond(pages2);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		pages2,
		pageId2,
		detail2.data,
		pubCtx.publicationChildrenFilteredOfSecond,
	]);

	useEffect(() => {
		if (!sp.get('page') || !sp.get('page2')) {
			if (!sp.get('page')) {
				sp.append('page', pages1[0]?.pid ?? 'undefined');
			}
			if (!sp.get('page2')) {
				sp.append('page2', pages2[0]?.pid ?? 'undefined');
			}
			setSp(sp, { replace: true });
		}
	}, [pages1, pages2, setSp, sp]);

	if (
		pubChildren1.isLoading ||
		detail1.isLoading ||
		pubChildren2.isLoading ||
		detail2.isLoading
	) {
		return <Loader />;
	}

	//FIXME: isPubliuc musi byt pre obe publikacie zvlast
	const isPublicLeft = detail1.data?.policy === 'public';
	const isPublicRight = detail2.data?.policy === 'public';

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
						mapRefOfSecond.current?.updateSize();
					}}
				>
					<Flex
						overflow="visible"
						width={leftCollapsed ? 0 : 300}
						minWidth={leftCollapsed ? 0 : 300}
						maxWidth={300}
						zIndex={3}
						css={css`
							transition-duration: 200ms;
							transition-property: width transform;
							transform: translateX(${leftCollapsed ? '-305px' : '0px'});
						`}
					>
						<PublicationSidePanel
							variant="left"
							defaultView="detail"
							pages={pages1}
							onCollapse={() => setLeftCollapsed(p => !p)}
							isCollapsed={leftCollapsed}
						/>
					</Flex>

					<Flex height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`} width="100%">
						<PubMainDetail
							page={pageId1}
							pageOfSecond={pageId2}
							leftPublic={isPublicLeft}
							rightPublic={isPublicRight}
						/>
					</Flex>

					<PublicationSidePanel
						variant="right"
						pages={pages2}
						onCollapse={() => setRightCollapsed(p => !p)}
						isCollapsed={rightCollapsed}
						isSecond
					/>
				</Flex>
			</ResponsiveWrapper>
		</WordHighlightContextProvider>
	);
};
export default MultiView;
