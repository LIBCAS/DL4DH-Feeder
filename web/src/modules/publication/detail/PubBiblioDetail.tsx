/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { TFunction } from 'i18next';
import _ from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import XML from 'xml2js';

import LoaderSpin from 'components/loaders/LoaderSpin';
import { Box, Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import Text, { H3, H5 } from 'components/styled/Text';

import PublicationExportDialog from 'modules/export/PublicationExportDialog';
import CitationDialog from 'modules/quote/CitationDialog';
import { PubModelTagBadge } from 'modules/searchResult/tiles/GenericTileItem';
import ShareDialog from 'modules/share/ShareDialog';

import { useTheme } from 'theme';

import { ModelsEnum } from 'api/models';
import { usePublicationDetail, useStreams } from 'api/publicationsApi';

import useBibilio from 'hooks/useBiblio';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { usePublicationContext } from '../ctx/pub-ctx';
import PrintDialog from '../print/PrintDialog';

import AuthorsDialog from './AuthorsDialog';
import MetaStreamsDialog from './MetaStreamsDialog';

//biblio periodikum
//https://ndk.cz/view/uuid:947f10f0-ca96-11e7-bfaa-005056827e52?page=uuid:d12e2000-028f-11e8-816d-5ef3fc9bb22f

//biblio svazek knih
//http://feeder.dev.inqool.cz/view/uuid:60447ee0-4f90-11ed-ad9c-5ef3fc9bb22f?page=uuid:703a3bd3-5b96-4102-aa72-bbe4fef45cf2

//viacero jazykov
//view/uuid:b2b8aed0-b345-11e3-b833-005056827e52?page=uuid:57013930-bb07-11e3-a597-5ef3fc9bb22f

// const xmlItemToText = (
// 	item: string | string[],
// 	key: string,
// 	trans: TFunction<'translation'>,
// ): string[] => {
// 	if (Array.isArray(item)) {
// 		return item.map(it => {
// 			if (key === 'type') {
// 				return ModelToText?.[it.split(':')[1]] ?? 'Neznámy';
// 			}
// 			if (key === 'language') {
// 				return trans(`language:${it}`) ?? '';
// 			}
// 			return it;
// 		});
// 	}
// 	return [];
// };

export const BibLink: FC<{ to: string; label?: string | string[] }> = ({
	to,
	label,
}) => {
	const theme = useTheme();
	return (
		<NavLinkButton variant="text" m={0} p={0} to={to} textAlign="left">
			<H5
				color="primary"
				m={0}
				style={{ color: theme.colors.primary, fontWeight: 'normal' }}
			>
				{label ?? ''}
			</H5>
		</NavLinkButton>
	);
};

const ParsedLanguages: FC<{
	langs: string | string[];
	t: TFunction<'translation'>;
}> = ({ langs, t }) => {
	if (Array.isArray(langs)) {
		return (
			<div style={{ display: 'block' }}>
				{langs.map(lang => (
					<div key={lang}>
						<BibLink
							to={`/search?languages=${lang}`}
							label={t(`language:${lang}`) ?? ''}
						/>
					</div>
				))}
			</div>
		);
	} else {
		return (
			<BibLink
				to={`/search?languages=${langs}`}
				label={t(`language:${langs}`) ?? ''}
			/>
		);
	}
};

const parseDCXML = (xml: unknown): Partial<Record<string, string[]>> => {
	const wrapper = 'oai_dc:dc';
	const getVal = (key: string) =>
		_.get(xml, `${wrapper}.dc:${key}`) as string[];

	const year = getVal('date');
	const title = getVal('title');
	const author = getVal('creator');
	const description = getVal('description');
	const publisher = getVal('publisher');
	const type = getVal('type');
	const policy = getVal('policy');
	const language = getVal('language');

	return {
		year,
		title,
		author,
		description,
		publisher,
		type,
		policy,
		language,
	};
};

type Props = {
	isSecond?: boolean;
	variant: 'left' | 'right';
};

const PubBiblioDetail: FC<Props> = ({ isSecond, variant }) => {
	const { id: urlId } = useParams<{ id: string }>();
	const pubCtx = usePublicationContext();
	const theme = useTheme();

	//TODO: temp nullish values for debugging, remove after tested
	const id = isSecond
		? pubCtx.secondPublication?.pid ?? 'ctx-right-pub-id-error'
		: pubCtx.publication?.pid ?? urlId ?? 'ctx-left-pub-id-error';
	const pageId = isSecond
		? pubCtx.currentPageOfSecond?.uuid ?? 'ctx-right-current-page-uuid-error'
		: pubCtx.currentPage?.uuid ?? 'ctx-left-current-page-uuid-error';

	const pubDetail = usePublicationDetail(id ?? 'biblio_id_undefined');
	const pageDetail = usePublicationDetail(
		pageId ?? '',
		pageId === 'ctx-right-current-page-uuid-error' ||
			pageId === 'ctx-left-current-page-uuid-error',
	);
	const rootId = pubDetail.data?.root_pid ?? undefined;
	const isPeriodical = rootId !== id;
	const { data: xmlString, isLoading } = useStreams(id ?? '', 'DC');
	const { biblio: bmods, isLoading: isBiblioLoading } = useBibilio(rootId);

	const {
		biblio: bmods2,
		isLoading: isBiblioLoading2,
		metadata,
	} = useBibilio(id ?? undefined);

	const [parsedXML, setParsedXML] = useState<unknown>();

	const { t } = useTranslation();

	useEffect(() => {
		XML.parseString(xmlString, (err, result) => setParsedXML(result));
	}, [xmlString]);

	const biblio = useMemo(() => parseDCXML(parsedXML), [parsedXML]);

	if (
		isBiblioLoading ||
		isBiblioLoading2 ||
		isLoading ||
		pubDetail.isLoading ||
		pageDetail.isLoading
	) {
		return <LoaderSpin />;
	}

	const isPrintableOrExportable =
		window.location.pathname.includes('/view/') ||
		window.location.pathname.includes('/multiview/');

	const details = pubDetail.data?.details;
	const pageContext = pubDetail.data?.context
		.flat()
		.filter(
			({ model }) =>
				model !== 'periodicalitem' &&
				model !== 'supplement' &&
				model !== 'internalpart' &&
				model !== 'monographunit',
		);
	// console.log({ bmods, bmods2 });

	const mapContextToUnitType = {
		monograph: 'unit_list',
		periodical: 'volume_list',
		periodicalvolume: 'issue_list',
	};

	//TODO: tu nie je hlavny autor, tak asi povazovat za hlavneho toho prveho? -- overit
	// http://localhost:3000/view/uuid:bbe1bcd0-550e-11de-b630-000d606f5dc6?page=uuid%3A37af3bf4-2cad-4f09-b871-48370c84908b
	// tu je tvurce, ale nie autor
	// http://localhost:3000/view/uuid:7e05cb70-50e7-11de-aafb-000d606f5dc6?page=uuid%3A15b3a380-fe72-11e6-bff9-005056825209
	// publikacia ktora ma internalpart - zacykli sa nachvilu
	// http://localhost:3000/view/uuid:21426150-9e46-11dc-a259-000d606f5dc6?page=uuid:a9759e30-42d6-4a91-846f-4b636b4066ed
	// internal part je vraci childrenov
	//http://localhost:3000/search?query=D%C4%9Bjepis%20pro%20ml%C3%A1de%C5%BE%20%C4%8Deskoslovanskou%20na%20%C5%A1kol%C3%A1ch%20n%C3%A1rodn%C3%ADch&availability=PUBLIC
	const authors = metadata?.authors ?? [];
	const mainAuthors = authors.filter(a => a.roles.indexOf('aut') !== -1);
	const otherAuthors = authors.filter(a => a.roles.indexOf('aut') === -1);

	//console.log({ pageContext, fullMetadata, metadata });

	return (
		<Flex width={1} flexDirection="column" position="relative" height="100%">
			<Flex
				my={2}
				color="primary"
				justifyContent="space-between"
				alignItems="center"
				px={3}
			>
				<MetaStreamsDialog rootId={id} pageId={pageId} />
				{isPrintableOrExportable && (
					<>
						<PublicationExportDialog isSecond={isSecond} />
						<PrintDialog isSecond={isSecond} />
					</>
				)}
				<CitationDialog isSecond={isSecond} />
				<ShareDialog isSecond={isSecond} />
			</Flex>
			<Divider />
			<Box
				p={3}
				pt={1}
				overflowY="auto"
				maxHeight={`calc(100vh - ${
					variant === 'right' ? 120 : 90
				}px - ${INIT_HEADER_HEIGHT}px)`}
			>
				<Box mb={3}>
					<Text color="#616161" fontSize="16.5px" fontWeight="bold">
						{bmods?.title ?? ''}
					</Text>
					<Text color="#616161" fontSize="15px">
						{bmods?.subTitle ?? ''}
					</Text>
					{isPeriodical && (
						<>
							{(pageContext ?? []).map(pc => (
								<Box key={pc.pid}>
									<NavLinkButton
										to={`/periodical/${pc.pid}`}
										key={pc.pid}
										variant="text"
										color="textCommon"
										fontWeight="bold"
										px={0}
									>
										{t(`metadata:${mapContextToUnitType[pc.model]}`)}
									</NavLinkButton>
								</Box>
							))}
						</>
					)}
				</Box>
				<Divider />
				<Box mb={3}>
					{details && (
						<>
							<H3 color="#616161" fontSize="16.5px">
								{details.partNumber}. část
							</H3>
							<H3 color="#616161" fontSize="16.5px">
								{details.title}
							</H3>
						</>
					)}
				</Box>
				<Box
					css={
						isPeriodical
							? css`
									padding-left: 16px;
									border-left: 6px solid ${theme.colors.border};
							  `
							: css``
					}
				>
					{isPeriodical && (
						<Box mb={3}>
							<Text color="#616161" fontSize="16.5px" fontWeight="bold">
								{bmods2?.title ?? ''}
							</Text>
							<Text color="#616161" fontSize="15px">
								{bmods2?.subTitle ?? ''}
							</Text>
						</Box>
					)}
					{(mainAuthors.length > 0 || otherAuthors.length > 0) && (
						<Box mb={3}>
							{mainAuthors.length > 0 && (
								<>
									<>
										<Text fontSize="13.5px" color="#9e9e9e">
											{t('metadata:author')}
										</Text>
										{mainAuthors.map(a => (
											<BibLink
												key={a.name}
												to={`/search?authors=${a.name}`}
												label={a.name}
											/>
										))}
									</>

									<Box>
										<AuthorsDialog metadata={metadata} />
									</Box>
								</>
							)}

							{otherAuthors.length > 0 && (
								<>
									<Text fontSize="13.5px" color="#9e9e9e">
										{t('metadata:author_other')}
									</Text>
									{otherAuthors.map(a => (
										<div key={a.name}>
											<BibLink
												to={`/search?authors=${a.name}`}
												label={a.name}
											/>
										</div>
									))}
									<Box>
										<AuthorsDialog metadata={metadata} />
									</Box>
								</>
							)}
						</Box>
					)}
					<Box mb={3}>
						<Text fontSize="13.5px" color="#9e9e9e">
							{t('metadata:publisher')}
						</Text>
						<H5>
							{biblio.publisher}, {biblio.year}
						</H5>
					</Box>
					<Box mb={3}>
						<Text fontSize="13.5px" color="#9e9e9e">
							{t('metadata:doctype')}
						</Text>
						<BibLink
							to={`/search?model=${pageContext?.[0].model}`}
							label={t(`model:${pageContext?.[0].model}`)}
						/>
					</Box>
					{(bmods2?.keywords?.length ?? 0) > 0 && (
						<Box mb={3}>
							<Text fontSize="13.5px" color="#9e9e9e">
								{t('metadata:keywords')}
							</Text>
							{bmods2?.keywords.map((k, i) => (
								<div key={`${k} - ${i}`}>
									<BibLink to={`/search?keywords=${k}`} label={k} />
								</div>
							))}
						</Box>
					)}
					<Box mb={3}>
						<Text fontSize="13.5px" color="#9e9e9e">
							{t('metadata:languages')}
						</Text>
						<ParsedLanguages langs={biblio.language ?? []} t={t} />
					</Box>

					{(bmods2?.geographic?.length ?? 0) > 0 && (
						<Box mb={3}>
							<Text fontSize="13.5px" color="#9e9e9e">
								{t('metadata:geonames')}
							</Text>
							{bmods2?.geographic.map((k, i) => (
								<div key={`${k} - ${i}`}>
									<BibLink to={`/search?keywords=${k}`} label={k} />
								</div>
							))}
						</Box>
					)}
					{bmods2?.genre && (
						<Box mb={3}>
							<Text fontSize="13.5px" color="#9e9e9e">
								{t('metadata:genres')}
							</Text>

							<H5>{bmods2.genre}</H5>
						</Box>
					)}
					{bmods2?.location && (
						<Box mb={3}>
							<Text fontSize="13.5px" color="#9e9e9e">
								{t('metadata:location')}
							</Text>

							<H5 fontSize="13.5px" color="black">
								{t(`sigla:${bmods2?.location}`)}
							</H5>
							<H5 fontSize="13.5px" color="black">
								{t('metadata:shelf_locator', {
									shelf_locator: bmods2.shelfLocator,
								})}
							</H5>
						</Box>
					)}
					{bmods2?.physicalDescription && (
						<Box mb={3}>
							<Text fontSize="13.5px" color="#9e9e9e">
								{t('metadata:physical_description')}
							</Text>

							<H5 fontSize="13.5px" color="black">
								{t('metadata:extent')}: {bmods2.physicalDescription}
							</H5>
						</Box>
					)}
				</Box>
				{/* {parts.prev && (
					<Box mb={3}>
						<BibLink
							to={`/view/${parts.prev}`}
							label={t('metadata:previous_unit')}
						/>
					</Box>
				)}

				{parts.next && (
					<Box mb={3}>
						<BibLink
							to={`/view/${parts.next}`}
							label={t('metadata:next_unit')}
						/>
					</Box>
				)} */}

				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						{t('metadata:notes')}
					</Text>
					{(biblio?.description ?? []).map(desc => (
						<H5 key={desc}>{desc}</H5>
					))}
					<H5></H5>
				</Box>
			</Box>
			{isPrintableOrExportable && (
				<Flex
					position="absolute"
					bg={pubDetail.data?.enriched ? '#E4F0F3' : '#ebebeb'}
					width={1}
					py={2}
					css={css`
						box-shadow: 2px 0px 2px 2px rgba(0, 0, 0, 0.05);
						border-top: 1px solid
							${pubDetail.data?.enriched
								? theme.colors.primary
								: theme.colors.border};
						bottom: 50px;
						min-height: 20px;
						flex-grow: 1;
					`}
				>
					<Flex
						justifyContent="flex-end"
						alignItems="flex-end"
						width={1}
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
				</Flex>
			)}
		</Flex>
	);
};

export default PubBiblioDetail;
