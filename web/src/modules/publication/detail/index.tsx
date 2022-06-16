/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useContext, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MdLock } from 'react-icons/md';

import { Flex } from 'components/styled';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { PubCtx } from '../ctx/pub-ctx';

import PublicationSidePanel from './PublicationSidePanel';
import PubMainDetail from './PubMainDetail';

const PublicationDetail = () => {
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

	useEffect(() => {
		console.log(pubChildren.isSuccess);
		if (pubChildren.isSuccess && !pubChildren.data[0].datanode) {
			console.log('afafasfas');
			nav(`/periodical/${id}`, { replace: true });
		}
	}, [pubChildren.data, nav, pubChildren.isSuccess, id]);

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
			<Flex width={1}>
				<PublicationSidePanel
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
								<PubMainDetail page={pageId} />
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

				<PublicationSidePanel variant="right" pages={pages} />
			</Flex>
		</ResponsiveWrapper>
	);
};
export default PublicationDetail;
