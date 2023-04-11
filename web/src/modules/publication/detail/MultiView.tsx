/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useRef, useState } from 'react';

import { Flex } from 'components/styled';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import ZoomifyView, {
	mapRef,
	mapRefOfSecond,
} from 'modules/zoomify/ZoomifyView';

import { useTheme } from 'theme';

import { MultiviewContextProvider } from 'hooks/useMultiviewContext';
import { useMobileView } from 'hooks/useViewport';
import { SidepanelContextProvider } from 'hooks/useSidepanelContext';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { useParseUrlIdsAndParams } from '../publicationUtils';
import { PublicationContextProvider } from '../ctx/pubContext';

import PublicationSidePanel from './PublicationSidePanel';
import PriavatePublicationInfo from './PriavatePublicationInfo';
import useProcessPublication from './useProcessPublication';
import PubPageNotFound from './PubPageNotFound';

//http://localhost:3000/view/uuid:0bec6e50-11e1-11eb-a4cf-005056827e52?page=uuid:18617fd7-cc78-4042-95aa-c7e7ce6363aa
//TODO:cleanup
const MultiView = () => {
	const { getApropriateIds } = useParseUrlIdsAndParams();
	const zoomRef = useRef<HTMLDivElement | null>(null);
	const { pageId: pageIdLeft, fulltext: fulltextLeft } =
		getApropriateIds('left');
	const { pageId: pageIdRight, fulltext: fulltextRight } =
		getApropriateIds('right');

	const processedLeft = useProcessPublication('left');
	const processedRight = useProcessPublication('right');
	const { isMobile } = useMobileView();
	const [rightCollapsed, setRightCollapsed] = useState(isMobile);
	const [leftCollapsed, setLeftCollapsed] = useState(isMobile);
	const theme = useTheme();

	//TODO: na krameriovi sa rozlisuje URL, ak je to periodical, cize neni datanode, tak to nejde na /view ale na /periodical .. uuid
	const leftPublic = true;
	const rightPublic = true;
	//const publication = detail.data;

	// 1.

	// postup na zreprodukovanie:
	// v pravom paneli dam vyhladat nejaku vec co bude not found
	// v lavom paneli dam nasledne tiez vyhladat vec co bude not found
	// potom v lavom paneli zrusim krizikom search
	// zostane to vysiet na loaderi

	return (
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
						transform: translateX(${leftCollapsed ? '-300px' : '0px'});
					`}
				>
					<PublicationContextProvider {...processedLeft}>
						<MultiviewContextProvider initSidePanel="left">
							<SidepanelContextProvider sidepanel="left">
								<PublicationSidePanel
									variant="left"
									defaultView="detail"
									pages={processedLeft.publicationChildren ?? []}
									onCollapse={() => setLeftCollapsed(p => !p)}
									isCollapsed={leftCollapsed}
								/>
							</SidepanelContextProvider>
						</MultiviewContextProvider>
					</PublicationContextProvider>
				</Flex>

				<Flex height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`} width="100%">
					<Flex
						id="ZOOMIFY_PARRENT_EL"
						ref={zoomRef}
						width={1}
						bg="border"
						alignItems="center"
						position="relative"
					>
						<PublicationContextProvider {...processedLeft}>
							<MultiviewContextProvider initSidePanel="left">
								<SidepanelContextProvider sidepanel="left">
									{fulltextLeft && !pageIdLeft ? (
										<PubPageNotFound multiview={true} />
									) : (
										<>
											{processedLeft.isLoading ? (
												<Loader />
											) : (
												<>
													{leftPublic ? (
														<ZoomifyView id={pageIdLeft} />
													) : (
														<PriavatePublicationInfo isMultiView />
													)}
												</>
											)}
										</>
									)}
								</SidepanelContextProvider>
							</MultiviewContextProvider>
						</PublicationContextProvider>

						<PublicationContextProvider {...processedRight}>
							<MultiviewContextProvider initSidePanel="right">
								<SidepanelContextProvider sidepanel="right">
									{fulltextRight && !pageIdRight ? (
										<PubPageNotFound isSecond multiview />
									) : (
										<Flex
											width={1 / 2}
											height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`}
											alignItems="center"
											css={css`
												border-left: 2px solid ${theme.colors.primary};
											`}
										>
											{processedRight.isLoading ? (
												<Loader />
											) : (
												<>
													{rightPublic ? (
														<ZoomifyView id={pageIdRight} />
													) : (
														<PriavatePublicationInfo isMultiView />
													)}
												</>
											)}
										</Flex>
									)}
								</SidepanelContextProvider>
							</MultiviewContextProvider>
						</PublicationContextProvider>
					</Flex>
				</Flex>
				<PublicationContextProvider {...processedRight}>
					<MultiviewContextProvider initSidePanel="right">
						<SidepanelContextProvider sidepanel="right">
							<PublicationSidePanel
								variant="right"
								pages={processedRight.publicationChildren ?? []}
								onCollapse={() => setRightCollapsed(p => !p)}
								isCollapsed={rightCollapsed}
							/>
						</SidepanelContextProvider>
					</MultiviewContextProvider>
				</PublicationContextProvider>
			</Flex>
		</ResponsiveWrapper>
	);
};
export default MultiView;
