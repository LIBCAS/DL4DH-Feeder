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
	model: string;
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
};

export type SearchDto = {
	documents: PublicationsListDto;
	availableFilters: AvailableFilters;
};

export type TPublication = PublicationDto & Partial<MyPublication>;
