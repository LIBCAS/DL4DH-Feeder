import { useEffect, useState } from 'react';
import XML from 'xml2js';

import { useStreams } from 'api/publicationsApi';

type BiblioKeyword = {
	'mods:topic': string[];
	'mods:geographic': string[];
};

type ModsObject = {
	_: string;
	$: {
		authority: string;
		type: string;
	};
};

type BiblioModsXML = {
	'mods:modsCollection': {
		'mods:mods': {
			'mods:classification': unknown[];
			'mods:language': { 'mods:languageTerm': { _: string }[] }[];
			// keywords
			'mods:subject': BiblioKeyword[];
			'mods:titleInfo': {
				'mods:title': string[];
				'mods:subTitle': string[];
				'mods:partNumber': string[];
			}[];
			'mods:name': {
				'mods:namePart': string[];
				'mods:nameIdentifier': string[];
			}[];
			'mods:genre': (
				| ModsObject
				| string // napr volume,.. ?
			)[];
			'mods:location': {
				'mods:physicalLocation': string[] | ModsObject[];
				'mods:shelfLocator': string[] | ModsObject[];
			}[];
			'mods:physicalDescription': {
				'mods:form': ModsObject[];
				'mods:extent': (ModsObject | string)[];
			}[];
		}[];
	};
};

type BiblioModsParsed = {
	title: string;
	subTitle: string;
	partNumber: string;
	keywords: string[];
	genre: string;
	geographic: string[];
	location: string;
	shelfLocator: string;
	physicalDescription: string;
};

const convertModsToObj = (parsedXML: BiblioModsXML): BiblioModsParsed => {
	//console.log({ parsedXML });
	const base = parsedXML?.['mods:modsCollection']?.['mods:mods']?.[0] ?? {};
	const titleInfo = base?.['mods:titleInfo']?.[0] ?? {};
	const subject = base?.['mods:subject'] ?? [];
	const keywords = subject
		.map(topic => topic['mods:topic']?.[0])
		.filter(t => t);
	const geographic = subject
		.map(topic => topic['mods:geographic']?.[0])
		.filter(t => t);

	const genre =
		base?.['mods:genre'].find(g => g?.['$']?.authority === 'czenas')?.['_'] ??
		undefined;

	const locationRaw =
		base?.['mods:location']?.[0]?.['mods:physicalLocation']?.[0];
	const location = locationRaw?.['_'] ? locationRaw?.['_'] : locationRaw ?? '';

	const shelfLocatorRaw =
		base?.['mods:location']?.[0]?.['mods:shelfLocator']?.[0];
	const shelfLocator = shelfLocatorRaw?.['_']
		? shelfLocatorRaw?.['_']
		: shelfLocatorRaw ?? '';
	const physicalDescriptionRaw =
		base?.['mods:physicalDescription']?.[0]?.['mods:extent']?.[0];
	const physicalDescription = physicalDescriptionRaw?.['_']
		? physicalDescriptionRaw?.['_']
		: physicalDescriptionRaw ?? '';

	const title = titleInfo?.['mods:title']?.[0] ?? undefined;
	const subTitle = titleInfo?.['mods:subTitle']?.[0] ?? undefined;
	const partNumber = titleInfo?.['mods:partNumber']?.[0] ?? undefined;
	return {
		title,
		subTitle,
		partNumber,
		keywords,
		genre,
		geographic,
		location,
		shelfLocator,
		physicalDescription,
	};
};

const useBibilio = (uuid?: string) => {
	const { data, isLoading } = useStreams(
		uuid ?? '',
		'BIBLIO_MODS',
		undefined,
		uuid === undefined,
	);
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
