/** @jsxImportSource @emotion/react */

import { FC, useEffect, useState } from 'react';
import { MdDownload, MdPrint, MdShare, MdTextFields } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import XML from 'xml2js';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';

import { Loader } from 'modules/loader';

import { useStreams } from 'api/publicationsApi';

import MetaStreamsDialog from './MetaStreamsDialog';

const parseDCXML = (xml: any): Partial<Record<string, string[]>> => {
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
	const [parsedXML, setParsedXML] = useState<any>();

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
					<Text fontSize="lg" color="secondary" fontWeight="bold">
						{biblio.title}
					</Text>
				</Box>
				<Box mb={3}>
					<Text fontSize="sm" color="secondary">
						Autor
					</Text>
					<Text fontSize="sm">{biblio.author}</Text>
				</Box>
				<Box mb={3}>
					<Text fontSize="sm" color="secondary">
						Nakladatelské údaje
					</Text>
					<Text fontSize="sm">
						{biblio.publisher}, {biblio.year}
					</Text>
				</Box>
				<Box mb={3}>
					<Text fontSize="sm" color="secondary">
						Typ dokumentu
					</Text>
					<Text fontSize="sm">{biblio.type}</Text>
				</Box>
				<Box mb={3}>
					<Text fontSize="sm" color="secondary">
						Jazyk
					</Text>
					<Text fontSize="sm">{biblio.language}</Text>
				</Box>
				<Box mb={3}>
					<Text fontSize="sm" color="secondary">
						Poznámky
					</Text>
					<Text fontSize="sm">{biblio.description}</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default PubBiblioDetail;
