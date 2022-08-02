import { useQuery } from 'react-query';

import { api } from 'api';

export type ExportApiResponse = {
	limit: number;
	offset: number;
	total: number;
	empty: boolean;
};

export type JobStatusEnum =
	| 'CREATED'
	| 'COMPLETED'
	| 'STARTING'
	| 'STARTED'
	| 'STOPPING'
	| 'STOPPED'
	| 'FAILED'
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

export type ExportDto = {
	id: string;
	created?: string;
	username: string;
	publicationId: string;
	status: JobEventDto;
};

export type QueryResultsExportDto = {
	results: ExportDto[];
} & ExportApiResponse;

export type QueryResultsJobEventDto = {
	results: JobEventDto[];
} & ExportApiResponse;

export const useJobsList = (page = 0, pageSize = 10) =>
	useQuery('export-list', () =>
		api()
			.get(`jobs/list/exporting?page=${page}&pageSize=${pageSize}`)
			.json<QueryResultsJobEventDto>(),
	);

export const useExportList = () =>
	useQuery('export-list', () => api().get(`exports`).json<ExportDto[]>());
