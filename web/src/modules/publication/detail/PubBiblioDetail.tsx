/** @jsxImportSource @emotion/react */

import _ from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { MdTextFields } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import XML from 'xml2js';

import LoaderSpin from 'components/loaders/LoaderSpin';
import { Box, Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Text, { H2, H3, H5 } from 'components/styled/Text';

import PublicationExportDialog from 'modules/export/PublicationExportDialog';
import ShareDialog from 'modules/share/ShareDialog';

import { usePublicationDetail, useStreams } from 'api/publicationsApi';

import { ModelToText } from 'utils/enumsMap';
import { mapLangToCS } from 'utils/languagesMap';

import { usePublicationContext } from '../ctx/pub-ctx';
import PrintDialog from '../print/PrintDialog';

import MetaStreamsDialog from './MetaStreamsDialog';

const xmlItemToText = (item: string | string[], key: string) => {
	if (Array.isArray(item)) {
		return item
			.map(it => {
				if (key === 'type') {
					return ModelToText?.[it.split(':')[1]] ?? 'Neznámy';
				}
				if (key === 'language') {
					return mapLangToCS[it] ?? 'Neznámy';
				}
				return it;
			})
			.join(', ');
	}
	return '';
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
};

const PubBiblioDetail: FC<Props> = ({ isSecond }) => {
	const { id: urlId } = useParams<{ id: string }>();
	const pubCtx = usePublicationContext();

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

	//const detail = usePublicationDetailWithRoot(id ?? 'biblio_id_undefined');

	const { data: xmlString, isLoading } = useStreams(id ?? '', 'DC');
	const [parsedXML, setParsedXML] = useState<unknown>();

	useEffect(() => {
		XML.parseString(xmlString, (err, result) => setParsedXML(result));
	}, [xmlString]);

	const biblio = useMemo(() => parseDCXML(parsedXML), [parsedXML]);

	if (isLoading || pubDetail.isLoading || pageDetail.isLoading) {
		return <LoaderSpin />;
	}

	const isPrintableOrExportable =
		window.location.pathname.includes('/view/') ||
		window.location.pathname.includes('/multiview/');

	const rootTitle = pubDetail.data?.root_title ?? 'r';
	const details = pubDetail.data?.details;
	const pageContext = pubDetail.data?.context
		.flat()
		.filter(c => c.model !== 'periodicalitem' && c.model !== 'supplement');

	return (
		<Box width={1}>
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
				<ShareDialog isSecond={isSecond} />
				<IconButton color="primary">
					<MdTextFields size={24} />
				</IconButton>
			</Flex>
			<Divider />
			<Box p={3}>
				<Box mb={3}>
					{pageContext?.map(pc => (
						<Box key={pc.pid}>
							<NavLinkButton
								to={`/periodical/${pc.pid}`}
								key={pc.pid}
								variant="text"
								color="textCommon"
								fontWeight="bold"
								px={0}
								//onClick={() => nav(`/periodical/${pc.pid}`)}
							>
								Přejít na {ModelToText[pc.model]}
							</NavLinkButton>
						</Box>
					))}
					<Divider my={2} />
					<H2 color="#616161" fontSize="18.5px">
						{rootTitle}
					</H2>
					{/* <Button variant="text" onClick={() => nav(`/periodical/${rootId}`)}>
						Přejít na {ModelToText[rootDetail?.model ?? '']}
					</Button> */}
				</Box>
				<Divider />
				<Box mb={3}>
					<H3 color="#616161" fontSize="16.5px">
						{rootTitle}
					</H3>
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
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Autor
					</Text>
					<H5>{biblio.author}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Nakladatelské údaje
					</Text>
					<H5>
						{biblio.publisher}, {biblio.year}
					</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Typ dokumentu
					</Text>
					<H5>{xmlItemToText(biblio.type ?? [], 'type')}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Jazyk
					</Text>
					<H5>{xmlItemToText(biblio.language ?? [], 'language')}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Poznámky
					</Text>
					{(biblio?.description ?? []).map(desc => (
						<H5 key={desc}>{desc}</H5>
					))}
					<H5></H5>
				</Box>
			</Box>
		</Box>
	);
};

export default PubBiblioDetail;
