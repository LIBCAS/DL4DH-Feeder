/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import Text from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';
import PublicationExportDialog from 'modules/export/PublicationExportDialog';
import { Loader } from 'modules/loader';
import PrintDialog from 'modules/publication/print/PrintDialog';
import CitationDialog from 'modules/quote/CitationDialog';
import { PubModelTagBadge } from 'modules/searchResult/tiles/GenericTileItem';
import ShareDialog from 'modules/share/ShareDialog';

import { useTheme } from 'theme';

import { ModelsEnum } from 'api/models';
import { usePublicationDetail } from 'api/publicationsApi';

import useMetadata, {
	useMetadataFormatter,
	usePeriodicalParts,
} from 'hooks/useMetadata';

import MetaStreamsDialog from '../MetaStreamsDialog';
import { BibLink } from '../PubBiblioDetail';

import { BibRootInfo } from './bib-rows';
import BibDonators from './bib-donators';

const Bibliography = () => {
	const { t } = useTranslation();
	const { getApropriateIds, isDetailView, formatViewLink } =
		useParseUrlIdsAndParams();
	const { id, pageId } = getApropriateIds();
	const pubDetail = usePublicationDetail(id ?? '');
	const pageDetail = usePublicationDetail(pageId ?? '');
	const theme = useTheme();
	const { fcm, isLoading } = useMetadata(id ?? '');
	const { format } = useMetadataFormatter();
	const formatted = useMemo(() => format(fcm), [fcm, format]);
	const { parts } = usePeriodicalParts(fcm);

	if (isLoading) {
		return (
			<Wrapper justifyContent="center" width={1}>
				<Loader />
			</Wrapper>
		);
	}
	return (
		<Wrapper m={0} width={1} overflow="hidden" position="relative">
			<Flex
				my={2}
				color="primary"
				justifyContent="space-between"
				alignItems="center"
				px={3}
			>
				<MetaStreamsDialog
					rootId={formatted?.[0]?.pid}
					pageId={pageId ?? undefined}
				/>
				{isDetailView && (
					<>
						<PublicationExportDialog />
						<PrintDialog />
					</>
				)}
				<CitationDialog />
				<ShareDialog />
			</Flex>
			<Divider />
			<Wrapper position="relative" height="100%">
				<Wrapper
					position="absolute"
					overflowY="auto"
					height="100%"
					flexShrink={0}
					px={3}
					width="calc(100% - 32px)"
				>
					<BibRootInfo formatted={formatted} level={0} currentId={id}>
						{formatted.slice(1).map(f => (
							<BibRootInfo
								currentId={id}
								key={f.pid}
								formatted={[f]}
								level={1}
							></BibRootInfo>
						))}
						{parts?.prev?.uuid && (
							<Box>
								<BibLink
									to={formatViewLink(parts.prev.uuid)}
									label={`${t('metadata:previous_unit')} ${parts.prev.label}`}
								/>
							</Box>
						)}

						{parts?.next?.uuid && (
							<Box>
								<BibLink
									to={formatViewLink(parts.next.uuid)}
									label={`${t('metadata:next_unit')} ${parts.next.label}`}
								/>
							</Box>
						)}
					</BibRootInfo>

					<BibDonators donators={pubDetail.data?.donator ?? []} />

					{pageDetail.data?.title && (
						<Box mb={3}>
							{t('metadata:page')}
							<Text fontSize="13.5px" color="#9e9e9e">
								{pageDetail.data?.title}
							</Text>
						</Box>
					)}
				</Wrapper>
			</Wrapper>
			<Box
				position="sticky"
				bg={pubDetail.data?.enriched ? '#E4F0F3' : '#ebebeb'}
				width={1}
				py={2}
				css={css`
					box-shadow: 2px 0px 2px 2px rgba(0, 0, 0, 0.05);
					border-top: 1px solid
						${pubDetail.data?.enriched
							? theme.colors.primary
							: theme.colors.border};
					bottom: 0px;
					min-height: 20px;
					max-height: 20px;
					flex-grow: 1;
				`}
			>
				<Flex
					justifyContent="flex-end"
					alignItems="flex-end"
					position="relative"
					px={2}
				>
					{pubDetail.data?.enriched && (
						<Flex bg="primary" color="white" opacity="0.8" mr={2}>
							<Text py={1} my={0} px={3} fontSize="sm">
								{t('search:enrichment:is_enriched')}
							</Text>
						</Flex>
					)}
					{pubDetail.data?.model && (
						<PubModelTagBadge model={pubDetail.data.model as ModelsEnum} />
					)}
				</Flex>
			</Box>
		</Wrapper>
	);
};

export default Bibliography;
