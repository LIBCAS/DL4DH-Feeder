/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import MainContainer from 'components/layout/MainContainer';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';

import BulkExportAdditionalButtons from 'modules/export/BulkExportAdditionalButtons';
import { BulkExportModeSwitch } from 'modules/export/BulkExportDialog';
import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useBulkExportContext } from 'hooks/useBulkExport';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import useProcessPublication from '../detail/useProcessPublication';
import { PublicationContextProvider } from '../ctx/pubContext';

import PeriodicalSidePanel from './PeriodicalSidePanel';

const PeriodicalDetail = () => {
	const { t } = useTranslation();

	const processed = useProcessPublication();
	const { publication, publicationChildren, isLoading } = processed;
	const pages = useMemo(() => publicationChildren ?? [], [publicationChildren]);

	const nav = useNavigate();
	const { exportModeOn } = useBulkExportContext();

	useEffect(() => {
		if (publication?.pid && pages?.[0]?.model === 'page') {
			nav('/view/' + publication.pid + '?page=' + pages?.[0].pid, {
				replace: true,
			});
		}
	}, [pages, publication, nav]);

	if (isLoading) {
		return <Loader />;
	}
	const isPublic = publication?.policy === 'public';

	return (
		<PublicationContextProvider {...processed}>
			<ResponsiveWrapper
				bg="primaryLight"
				px={0}
				mx={0}
				alignItems="flex-start"
				width={1}
				height={`calc(100vh - ${INIT_HEADER_HEIGHT}px`}
			>
				<MainContainer
					subHeader={{
						leftJsx: (
							<Flex pl={3} alignItems="center">
								<Text>
									Výsledky: <strong>{pages?.length ?? 0}</strong>
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
									{publication?.title ?? 'Periodikum'}
								</Text>
								<Flex>
									<Flex mr={3} alignItems="center">
										{/* 	<Sorting /> */}
										{exportModeOn && (
											<>
												<BulkExportAdditionalButtons
													periodicalChildren={pages}
												/>
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
							<Wrapper
								overflowY="auto"
								overflowX="hidden"
								p={3}
								maxHeight="90vh"
							>
								<PeriodicalTiles data={pages} />
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
		</PublicationContextProvider>
	);
};
export default PeriodicalDetail;
