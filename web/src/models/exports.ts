export type PipeParam = 'n' | 'lemma' | 'pos' | 'msd' | 'join' | '?';
export type TagParam =
	| 'a'
	| 'g'
	| 'i'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 't'
	| 'P'
	| 'T'
	| 'A'
	| 'C';
//| '?';
export type AltoParam = 'width' | 'height' | 'vpos' | 'hpos' | '?';

export type ExportFilter = {
	operation: 'OR';
	filters: ExportFilterEQ[];
};

export type ExportFilterEQ = {
	field: string;
	operation: 'EQ';
	value: string;
};

export type Delimiter = ',' | '\t';

export type ExportApiResponse = {
	limit: number;
	offset: number;
	total: number;
	empty: boolean;
};

export type JobStatusEnum =
	| 'CREATED'
	| 'ENQUEUED'
	| 'RUNNING'
	| 'COMPLETED'
	| 'SUCCESSFUL'
	| 'FAILED'
	| 'FAILED_FATALLY'
	| 'CANCELLED'
	| 'PARTIAL'
	| 'STARTING'
	| 'STARTED'
	| 'STOPPING'
	| 'STOPPED'
	| 'ABANDONED'
	| 'UNKNOWN';

export type JobEventConfigDto = {
	parameters: unknown;
	krameriusJob:
		| 'ENRICHMENT_KRAMERIUS'
		| 'ENRICHMENT_EXTERNAL'
		| 'ENRICHMENT_NDK'
		| 'ENRICHMENT_TEI'
		| 'EXPORT_JSON'
		| 'EXPORT_CSV'
		| 'EXPORT_TEI'
		| 'EXPORT_ALTO'
		| 'EXPORT_TEXT';
};

export type JobEventDto = {
	id: string;
	created: string;
	updated: string;
	deleted: string;
	jobName: string;
	publicationId: string;
	lastExecutionStatus: JobStatusEnum;
	parenet: unknown;
	config: JobEventConfigDto;
};

export type ExportItem = {
	id: string;
	createdAt?: string;
	username: string;
	publicationId: string;
	status: JobStatusEnum;
	publicationTitle: string;
	finished: boolean;
};

export type ExportDto = {
	id: string;
	created?: string;
	username: string;
	publicationId: string;
	status: JobStatusEnum;
	publicationTitle: string;
	format: string;
	parameters: string;
	teiParameters: string;
	delimiter: string;
	items: ExportItem[];
	finished: boolean;
};

//bez ALTA  http://localhost:3000/view/uuid:0e5a5df0-4462-11dd-aadb-000d606f5dc6

export type AltoCheckProgress = {
	current: number;
	total: number;
	msg: string;
	mode: 'CHILDREN' | 'ALTO';
};

export type NameTagExportOption = {
	id: TagParam;
	labelCode: string;
	label: string;
};
