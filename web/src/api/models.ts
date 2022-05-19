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
	date: string;
	authors: string | string[];
	title: string;
	pid: string;
	rootTitle: string;
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
	availability: AvailabilityEnum;
	models: ModelsEnum[];
	keywords: string[];
	authors: string[];
	languages: string[];
	start: number;
	pageSize: number;
	nameTagFilters: NameTagFilterDto[];
};
export type TPublication = PublicationDto & Partial<MyPublication>;

export type AvailabilityEnum = 'PUBLIC' | 'PRIVATE' | 'ALL';
export type ModelsEnum =
	| 'MONOGRAPH'
	| 'PERIODICAL'
	| 'MAP'
	| 'GRAPHICS'
	| 'ARCHIVAL'
	| 'MANUSCRIPT'
	| 'SHEETMUSIC';

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
	| 'COMPLEX_BIBLIO_EXPRESSION ';
