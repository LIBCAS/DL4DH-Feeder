/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useRef, useState } from 'react';

import { Flex } from 'components/styled';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import ZoomifyView, { mapRef } from 'modules/zoomify/ZoomifyView';

import { useMobileView } from 'hooks/useViewport';
import { SidepanelContextProvider } from 'hooks/useSidepanelContext';
import { MultiviewContextProvider } from 'hooks/useMultiviewContext';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { PublicationContextProvider } from '../ctx/pubContext';
import { useParseUrlIdsAndParams } from '../publicationUtils';

import PublicationSidePanel from './PublicationSidePanel';
import PriavatePublicationInfo from './PriavatePublicationInfo';
import useProcessPublication from './useProcessPublication';
import PubPageNotFound from './PubPageNotFound';

const PublicationDetail = () => {
	const zoomRef = useRef<HTMLDivElement | null>(null);
	const { getApropriateIds } = useParseUrlIdsAndParams();

	const { pageId, fulltext } = getApropriateIds();

	const processed = useProcessPublication();
	const { isMobile } = useMobileView();
	const [rightCollapsed, setRightCollapsed] = useState(isMobile);
	const [leftCollapsed, setLeftCollapsed] = useState(isMobile);

	const isPublic = processed.publication?.policy === 'public';

	return (
		<PublicationContextProvider {...processed}>
			<ResponsiveWrapper
				bg="primaryLight"
				px={0}
				mx={0}
				alignItems="flex-start"
				width={1}
				height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`}
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
						minWidth={leftCollapsed ? 0 : 300}
						maxWidth={300}
						zIndex={3}
						css={css`
							transition-duration: 200ms;
							transition-property: width transform;
							transform: translateX(${leftCollapsed ? '-300px' : '0px'});
						`}
					>
						<SidepanelContextProvider sidepanel="left">
							<PublicationSidePanel
								variant="left"
								pages={processed.publicationChildren ?? []}
								onCollapse={() => setLeftCollapsed(p => !p)}
								isCollapsed={leftCollapsed}
								defaultView="search"
							/>
						</SidepanelContextProvider>
					</Flex>

					<Flex height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`} width="100%">
						<MultiviewContextProvider initSidePanel="left">
							<Flex
								id="ZOOMIFY_PARRENT_EL"
								ref={zoomRef}
								width={1}
								bg="border"
								alignItems="center"
								position="relative"
							>
								{fulltext && !pageId ? (
									<PubPageNotFound />
								) : (
									<>
										{processed.isLoading ? (
											<Loader />
										) : (
											<>
												{isPublic ? (
													<ZoomifyView id={pageId} />
												) : (
													<PriavatePublicationInfo />
												)}
											</>
										)}
									</>
								)}
							</Flex>
						</MultiviewContextProvider>
					</Flex>
					<SidepanelContextProvider sidepanel="right">
						<PublicationSidePanel
							variant="right"
							defaultView="detail"
							pages={processed.publicationChildren ?? []}
							onCollapse={() => setRightCollapsed(p => !p)}
							isCollapsed={rightCollapsed}
						/>
					</SidepanelContextProvider>
				</Flex>
			</ResponsiveWrapper>
		</PublicationContextProvider>
	);
};
export default PublicationDetail;
