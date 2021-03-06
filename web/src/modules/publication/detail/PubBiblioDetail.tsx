/** @jsxImportSource @emotion/react */

import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { MdDownload, MdPrint, MdShare, MdTextFields } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import XML from 'xml2js';

import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Text, { H3, H5 } from 'components/styled/Text';

import { Loader } from 'modules/loader';

import { useStreams } from 'api/publicationsApi';

import MetaStreamsDialog from './MetaStreamsDialog';

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

	const { data: xmlString, isLoading } = useStreams(id ?? '', 'DC');
	//const solrInfo = useStreams(id ?? '', 'BIBLIO_MODS');
	const [parsedXML, setParsedXML] = useState<unknown>();

	useEffect(() => {
		XML.parseString(xmlString, (err, result) => setParsedXML(result));
	}, [xmlString]);

	if (isLoading) {
		return <Loader />;
	}
	const biblio = parseDCXML(parsedXML);

	return (
		<Box width={1}>
			<Flex
				my={3}
				color="primary"
				justifyContent="space-between"
				alignItems="center"
				px={3}
			>
				<MetaStreamsDialog xmlString={xmlString} uuid={id ?? ''} />
				<IconButton color="primary">
					<MdPrint size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdDownload size={24} />
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
					<H3 color="#616161" fontSize="16.5px">
						{biblio.title}
					</H3>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Autor
					</Text>
					<H5>{biblio.author}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Nakladatelsk?? ??daje
					</Text>
					<H5>
						{biblio.publisher}, {biblio.year}
					</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Typ dokumentu
					</Text>
					<H5>{biblio.type}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Jazyk
					</Text>
					<H5>{biblio.language}</H5>
				</Box>
				<Box mb={3}>
					<Text fontSize="13.5px" color="#9e9e9e">
						Pozn??mky
					</Text>
					<H5>{biblio.description}</H5>
				</Box>
			</Box>
		</Box>
	);
};

export default PubBiblioDetail;
