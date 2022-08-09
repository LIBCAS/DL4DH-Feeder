/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MdLock } from 'react-icons/md';

import { Flex } from 'components/styled';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';
import { mapRef } from 'modules/zoomify/ZoomifyView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { PubCtx } from '../ctx/pub-ctx';

import PublicationSidePanel from './PublicationSidePanel';
import PubMainDetail from './PubMainDetail';

const MultiView = () => {
	const { id1, id2 } = useParams<{ id1: string; id2: string }>();

	const theme = useTheme();
	const pubChildren1 = usePublicationChildren(id1 ?? '');
	const detail1 = usePublicationDetail(id1 ?? '');
	const pages1 = useMemo(() => pubChildren1.data ?? [], [pubChildren1.data]);

	const pubChildren2 = usePublicationChildren(id2 ?? '');
	const detail2 = usePublicationDetail(id2 ?? '');
	const pages2 = useMemo(() => pubChildren2.data ?? [], [pubChildren2.data]);

	const [sp, setSp] = useSearchParams();
	const pubCtx = useContext(PubCtx);
	const nav = useNavigate();
	const [rightCollapsed, setRightCollapsed] = useState(false);
	const [leftCollapsed, setLeftCollapsed] = useState(false);

	const pageId = useMemo(
		() => sp.get('page') ?? pages1[0]?.pid ?? undefined,
		[sp, pages1],
	);

	useEffect(() => {
		const childIndex = pages1.findIndex(p => p.pid === pageId);
		pubCtx.setCurrentPage({
			uuid: pageId ?? '',
			childIndex,
			prevPid: pages1[childIndex - 1]?.pid,
			nextPid: pages1[childIndex + 1]?.pid,
		});
		pubCtx.setPublicationChildren(pages1);

		if (detail1?.data) {
			const context = detail1.data?.context?.flat() ?? [];
			pubCtx.setPublication({
				...detail1.data,
				context,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages1, pageId]);

	useEffect(() => {
		if (pubChildren1.isSuccess && !pubChildren1.data?.[0]?.datanode) {
			nav(`/periodical/${id1}`, { replace: true });
		}
	}, [pubChildren1.data, nav, pubChildren1.isSuccess, id1]);

	if (pubChildren1.isLoading || detail1.isLoading) {
		return <Loader />;
	}
	if (!sp.get('page')) {
		sp.append('page', pages1[0]?.pid ?? 'undefined');
		setSp(sp, { replace: true });
	}

	//TODO: na krameriovi sa rozlisuje URL, ak je to periodical, cize neni datanode, tak to nejde na /view ale na /periodical .. uuid
	const isPublic = detail1.data?.policy === 'public';
	const datanode = pubChildren1.data?.[0]?.datanode ?? false;

	return (
		<>
			{id1} <br /> {id2}
		</>
	);
};
export default MultiView;
