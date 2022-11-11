import { useEffect, useState } from 'react';
import XML from 'xml2js';

import { useStreams } from 'api/publicationsApi';

type BiblioModsXML = {
	'mods:modsCollection': {
		'mods:mods': {
			'mods:titleInfo': {
				'mods:title': string[];
				'mods:subTitle': string[];
				'mods:partNumber': string[];
			}[];
			'mods:name': {
				'mods:namePart': [string, unknown];
			}[];
		}[];
	};
};

type BiblioModsParsed = {
	title: string;
	subTitle: string;
	partNumber: string;
};

const convertModsToObj = (parsedXML: BiblioModsXML): BiblioModsParsed => {
	const titleInfo =
		parsedXML?.['mods:modsCollection']?.['mods:mods']?.[0]?.[
			'mods:titleInfo'
		]?.[0] ?? {};
	const title = titleInfo?.['mods:title']?.[0] ?? undefined;
	const subTitle = titleInfo?.['mods:subTitle']?.[0] ?? undefined;
	const partNumber = titleInfo?.['mods:partNumber']?.[0] ?? undefined;
	return {
		title,
		subTitle,
		partNumber,
	};
};

const useBibilio = (uuid: string) => {
	const { data, isLoading } = useStreams(uuid ?? '', 'BIBLIO_MODS');
	const [biblio, setBiblio] = useState<BiblioModsParsed>();
	useEffect(() => {
		if (data) {
			XML.parseString(data, (err, result) => {
				setBiblio(convertModsToObj(result));
			});
		}
	}, [data]);

	return { isLoading, biblio };
};

export default useBibilio;
