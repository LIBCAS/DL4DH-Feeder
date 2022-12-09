/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useEffect, useMemo } from 'react';
import { MdLock } from 'react-icons/md';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MainContainer from 'components/layout/MainContainer';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';
import { BulkExportModeSwitch } from 'modules/export/BulkExportDialog';
import BulkExportAdditionalButtons from 'modules/export/BulkExportAdditionalButtons';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { useBulkExportContext } from 'hooks/useBulkExport';

import { usePublicationContext } from '../ctx/pub-ctx';

import PeriodicalSidePanel from './PeriodicalSidePanel';

const PeriodicalDetail = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const pubChildren = usePublicationChildren(id ?? '');
	const detail = usePublicationDetail(id ?? '');
	const pages = useMemo(() => pubChildren.data ?? [], [pubChildren.data]);
	const [page] = useSearchParams();
	const pubCtx = usePublicationContext();
	const nav = useNavigate();
	const { exportModeOn } = useBulkExportContext();

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
		pubCtx.setPublicationChildren(pages);
		if (detail?.data) {
			const context = detail.data?.context?.flat() ?? [];
			pubCtx.setPublication({
				...detail.data,
				context,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages, pageId]);
	//TODO:
	useEffect(() => {
		if (pubChildren.data?.[0]?.model === 'page') {
			nav('/view/' + id + '?page=' + pubChildren.data?.[0].pid, {
				replace: true,
			});
		} /*  else {
			nav('/periodical/' + pubChildren.data?.[0].pid, { replace: true });
		} */
	}, [pubChildren.data, detail.data, nav, id]);

	if (pubChildren.isLoading || detail.isLoading) {
		return <Loader />;
	}
	//TODO: na krameriovi sa rozlisuje URL, ak je to periodical, cize neni datanode, tak to nejde na /view ale na /periodical .. uuid
	const isPublic = detail.data?.policy === 'public';

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={0}
			mx={0}
			alignItems="flex-start"
			width={1}
			height="100vh"
		>
			<MainContainer
				subHeader={{
					leftJsx: (
						<Flex pl={3} alignItems="center">
							<Text>
								Výsledky: <strong>{pubChildren.data?.length ?? 0}</strong>
							</Text>
						</Flex>
					),
					mainJsx: (
						<Flex
							alignItems="center"
							px={3}
							justifyContent="space-between"
							width={1}
						>
							<Text
								fontSize="md"
								color="textCommon"
								css={css`
									text-overflow: ellipsis;
									overflow: hidden;
									white-space: nowrap;
								`}
							>
								{detail.data?.title ?? 'Periodikum'}
							</Text>
							<Flex>
								<Flex mr={3} alignItems="center">
									{/* 	<Sorting /> */}
									{exportModeOn && (
										<>
											<BulkExportAdditionalButtons periodicalChildren={pages} />
											<Text mx={3}>|</Text>
										</>
									)}
									<BulkExportModeSwitch />
								</Flex>
							</Flex>
						</Flex>
					),
				}}
				body={{
					leftJsx: (
						<PeriodicalSidePanel
							variant="left"
							defaultView="search"
							pages={pages}
						/>
					),
					rightJsx: (
						<PeriodicalSidePanel
							variant="right"
							defaultView="search"
							pages={pages}
						/>
					),
				}}
			>
				{isPublic ? (
					<>
						<Wrapper overflowY="auto" overflowX="hidden" p={3} maxHeight="90vh">
							<PeriodicalTiles data={pubChildren.data} />
						</Wrapper>
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
							<Text>{t('licence:private_label')}</Text>
						</Flex>
					</Flex>
				)}
			</MainContainer>
		</ResponsiveWrapper>
	);
};
export default PeriodicalDetail;
