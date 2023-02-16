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

export type PublicationContext = {
	pid: string;
	model: string;
};

export type PublicationDetail = {
	policy: string;
	model: string;
	datanode: boolean;
	pid: string;
	root_pid: string;
	root_title: string;
	title: string;
	context: PublicationContext[];
	details: {
		partNumber: string;
		title: string;
	};
	enriched?: boolean;
};

export type PublicationsListDto = {
	numFound: number;
	start: number;
	docs: PublicationDto[];
};

export type AvailableNameTagFilters = {
	artifactNames: Record<string, number>;
	complexAddressExpression: Record<string, number>;
	complexBiblioExpression: Record<string, number>;
	complexPersonNames: Record<string, number>;
	complexTimeExpression: Record<string, number>;
	geographicalNames: Record<string, number>;
	institutions: Record<string, number>;
	mediaNames: Record<string, number>;
	numberExpressions: Record<string, number>;
	numbersInAddresses: Record<string, number>;
	personalNames: Record<string, number>;
	timeExpression: Record<string, number>;
};

export type AvailableFilters = {
	availability: {
		private: number;
		public: number;
	};
	enrichment: {
		ALL: number;
		ENRICHED: number;
		NOT_ENRICHED: number;
	};
	years: Record<string, number>;
	models: Record<string, number>;
	keywords: Record<string, number>;
	authors: Record<string, number>;
	languages: Record<string, number>;
	collections: Record<string, Collection>;
};

export type NameTagFilterDto = {
	type: TagNameEnum;
	operator: 'EQUAL' | 'NOT_EQUAL';
	values: string[];
};

export type SearchDto = {
	documents: PublicationsListDto;
	availableFilters: AvailableFilters;
	availableNameTagFilters: AvailableNameTagFilters;
};
export type FiltersDto = {
	id?: string;
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
	nameTagFacet: string;
	collections: string[];
	advancedFilterField: AdvancedFilterFieldEnum;
};

export type PageFilter = {
	content: FiltersDto[];
};

export type PublicationChild = {
	datanode: boolean;
	pid: string;
	policy: string;
	title: string;
	details: {
		volumeNumber: string;
		year: string;
		partNumber: string;
		title: string;
		pagenumber: string;
		date: string;
		subTitle: string;
		nonSort: string;
		partName: string;
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
		url: string;
	};
};

export type Collection = {
	canLeave: boolean;
	descs: {
		cs: string;
		en: string;
	};
	label: string;
	numberOfDocs: number;
	pid: string;
};

export type ChildSearchDto = {
	textOcr: string[];

	nameTag: Record<string, string[]>; //TODO:
};

export type ChildSearchResult = Record<string, ChildSearchDto>;

export type FiltersSortEnum =
	| 'TITLE_ASC'
	| 'CREATED_DESC'
	| 'DATE_ASC'
	| 'DATE_DESC'
	| 'LAST_ENRICHED';
export type AvailabilityEnum = 'PUBLIC' | 'PRIVATE' | 'ALL';
export type ModelsEnum =
	| 'MONOGRAPH'
	| 'PERIODICAL'
	| 'MAP'
	| 'GRAPHICS'
	| 'ARCHIVAL'
	| 'MANUSCRIPT'
	| 'SHEETMUSIC'
	| 'MONOGRAPHUNIT'
	| 'MONOGRAPHBUNDLE'
	| 'PERIODICALITEM'
	| 'PERIODICALVOLUME';

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

export type EnrichmentFilterType = 'ENRICHED' | 'NOT_ENRICHED' | 'ALL';

export type StreamTypeEnum =
	| 'ITEM'
	| 'CHILDREN'
	| 'IMG_PREVIEW'
	| 'BIBLIO_MODS'
	| 'IMG_FULL_ADM'
	| 'IMG_FULL'
	| 'TEXT_OCR_ADM'
	| 'ALTO'
	| 'TEXT_OCR'
	| 'IMG_THUMB'
	| 'DC';

export type AdvancedFilterFieldEnum =
	| 'TITLE'
	| 'AUTHOR'
	| 'KEYWORDS'
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
	| 'COMPLEX_BIBLIO_EXPRESSION'
	| 'ALL_BASIC_METADATA'
	| 'ALL_NAMETAG_DATA'
	| 'NONE';
