/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MdClear, MdLock } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { Loader } from 'modules/loader';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import { PubCtx } from '../ctx/pub-ctx';

import PublicationSidePanel from './PublicationSidePanel';
import PubMainDetail from './PubMainDetail';

const PublicationDetail = () => {
	const { id } = useParams<{ id: string }>();

	const pubChildren = usePublicationChildren(id ?? '');
	const detail = usePublicationDetail(id ?? '');
	const pages = useMemo(() => pubChildren.data ?? [], [pubChildren.data]);
	const [page] = useSearchParams();
	const pubCtx = useContext(PubCtx);

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

	if (pubChildren.isLoading || detail.isLoading) {
		return <Loader />;
	}

	const isPublic = detail.data?.policy === 'public';
	const notRoot = detail.data?.model === 'periodical';

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
						{notRoot ? (
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
									<MdClear size={60} />
									<Text>Tento typ dokumentu zatím nelze zobrazit</Text>
								</Flex>
							</Flex>
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
