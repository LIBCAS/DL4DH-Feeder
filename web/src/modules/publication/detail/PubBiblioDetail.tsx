/** @jsxImportSource @emotion/react */

import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { MdDownload, MdPrint, MdShare, MdTextFields } from 'react-icons/md';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import XML from 'xml2js';

import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Text, { H2, H3, H5 } from 'components/styled/Text';
import LoaderSpin from 'components/loaders/LoaderSpin';
import Button, { NavLinkButton } from 'components/styled/Button';

import PublicationExportDialog from 'modules/export/PublicationExportDialog';

import {
	usePublicationDetail,
	usePublicationDetailWithRoot,
	useStreams,
} from 'api/publicationsApi';

import { modelToText, ModelToText } from 'utils/enumsMap';
import { mapLangToCS } from 'utils/languagesMap';

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
	nic?: boolean;
};

const PubBiblioDetail: FC<Props> = () => {
	const { id } = useParams<{ id: string }>();
	const [searchParams] = useSearchParams();
	const pageId = searchParams.get('page');

	const pubDetail = usePublicationDetail(id ?? 'biblio_id_undefined');
	const pageDetail = usePublicationDetail(pageId ?? '', pageId === undefined);

	const detail = usePublicationDetailWithRoot(id ?? 'biblio_id_undefined');

	const { data: xmlString, isLoading } = useStreams(id ?? '', 'DC');
	//const solrInfo = useStreams(id ?? '', 'BIBLIO_MODS');
	const [parsedXML, setParsedXML] = useState<unknown>();

	useEffect(() => {
		XML.parseString(xmlString, (err, result) => setParsedXML(result));
	}, [xmlString]);

	if (isLoading || pubDetail.isLoading || pageDetail.isLoading) {
		return <LoaderSpin />;
	}
	const { rootDetail, mainDetail } = detail.data ?? {
		rootDetail: undefined,
		mainDetail: undefined,
	};
	const biblio = parseDCXML(parsedXML);

	const rootTitle = pubDetail.data?.root_title ?? 'r';
	const details = pubDetail.data?.details;
	const pageContext = pubDetail.data?.context
		.flat()
		.filter(c => c.model !== 'periodicalitem' && c.model !== 'supplement');
	console.log({ pageContext });
	console.log({ rootDetail, mainDetail });

	return (
		<Box width={1}>
			<Flex
				my={2}
				color="primary"
				justifyContent="space-between"
				alignItems="center"
				px={3}
			>
				<MetaStreamsDialog />
				<PublicationExportDialog />
				<IconButton color="primary">
					<MdPrint size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdTextFields size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdShare size={24} />
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
