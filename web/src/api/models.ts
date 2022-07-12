/* export type TPublication = {
	id: string;
	title: string;
	author: string;
	published: Date;
	pages: number;
	meta1: string;
	meta2: string;
	meta3: string;
}; */

export type MyPublication = {
	published: Date;
	pages: number;
	meta1: string;
	meta2: string;
	meta3: string;
	author: string;
};

export type PublicationDto = {
	model: ModelsEnum;
	availability: string;
	policy: string;
	date: string;
	authors: string | string[];
	title: string;
	pid: string;
	rootTitle: string;
	enriched: boolean;
};

export type PublicationDetail = {
	policy: string;
	model: string;
	datanode: boolean;
	pid: string;
	root_pid: string;
	rootTitle: string;
	title: string;
};

export type PublicationsListDto = {
	numFound: number;
	start: number;
	docs: PublicationDto[];
};

export type AvailableFilters = {
	availability: {
		private: number;
		public: number;
	};
	models: Record<string, number>;
	keywords: Record<string, number>;
	authors: Record<string, number>;
	languages: Record<string, number>;
	collections: Record<string, number>;
};

export type NameTagFilterDto = {
	type: TagNameEnum;
	operator: 'EQUAL' | 'NOT_EQUAL';
	values: string[];
};

export type SearchDto = {
	documents: PublicationsListDto;
	availableFilters: AvailableFilters;
};
export type FiltersDto = {
	query: string;
	queryEscaped: string;
	availability: AvailabilityEnum;
	from: string;
	to: string;
	models: ModelsEnum[];
	keywords: string[];
	authors: string[];
	languages: string[];
	start: number;
	pageSize: number;
	nameTagFilters: NameTagFilterDto[];
	sort: FiltersSortEnum;
	enrichment: EnrichmentFilterType;
};
export type TPublication = PublicationDto & Partial<MyPublication>;

export type PublicationChild = {
	datanode: boolean;
	pid: string;
	policy: string;
	title: string;
	details: {
		volumeNumber: string;
		year: string;
		partNumber: string;
	};
	root_pid: string;
	root_title: string;
	model: string;
	enriched: boolean;
};

export type InfoDto = {
	feeder: {
		version: string;
	};
	krameriusPlus: {
		version: string;
		timeOfLastBuild: string;
	};
	kramerius: {
		version: string;
		name: string;
		name_en: string;
		logo: string;
	};
};

export type FiltersSortEnum =
	| 'TITLE_ASC'
	| 'CREATED_DESC'
	| 'DATE_ASC'
	| 'DATE_DESC';
export type AvailabilityEnum = 'PUBLIC' | 'PRIVATE' | 'ALL';
export type ModelsEnum =
	| 'MONOGRAPH'
	| 'PERIODICAL'
	| 'MAP'
	| 'GRAPHICS'
	| 'ARCHIVAL'
	| 'MANUSCRIPT'
	| 'SHEETMUSIC'
	| 'MONOGRAPHUNIT';

export type TagNameEnum =
	| 'NUMBERS_IN_ADDRESSES'
	| 'GEOGRAPHICAL_NAMES'
	| 'INSTITUTIONS'
	| 'MEDIA_NAMES'
	| 'NUMBER_EXPRESSIONS'
	| 'ARTIFACT_NAMES'
	| 'PERSONAL_NAMES'
	| 'TIME_EXPRESSIONS'
	| 'COMPLEX_PERSON_NAMES'
	| 'COMPLEX_TIME_EXPRESSION'
	| 'COMPLEX_ADDRESS_EXPRESSION'
	| 'COMPLEX_BIBLIO_EXPRESSION';

export const NameTagCode: Record<TagNameEnum, string> = {
	NUMBERS_IN_ADDRESSES: 'A',
	GEOGRAPHICAL_NAMES: 'B',
	INSTITUTIONS: 'C',
	MEDIA_NAMES: 'D',
	NUMBER_EXPRESSIONS: 'E',
	ARTIFACT_NAMES: 'F',
	PERSONAL_NAMES: 'G',
	TIME_EXPRESSIONS: 'H',
	COMPLEX_PERSON_NAMES: 'I',
	COMPLEX_TIME_EXPRESSION: 'J',
	COMPLEX_ADDRESS_EXPRESSION: 'K',
	COMPLEX_BIBLIO_EXPRESSION: 'L',
};

export const OperationCode: Record<'EQUAL' | 'NOT_EQUAL', string> = {
	EQUAL: 'A',
	NOT_EQUAL: 'B',
};

export type EnrichmentFilterType = 'ENRICHED' | 'NOT_ENRICHED' | 'ALL';
