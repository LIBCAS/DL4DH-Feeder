import { useQuery } from 'react-query';

import { ExportSort } from 'modules/export/exportModels';

import { api } from 'api';

import { PagableResponse } from './models';

export type ExportApiResponse = {
	limit: number;
	offset: number;
	total: number;
	empty: boolean;
};

export type JobStatusEnum =
	| 'CREATED'
	| 'COMPLETED'
	| 'SUCCESSFUL'
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
	status: JobStatusEnum;
	publicationTitle: string;
	format: string;
	parameters: string;
	teiParameters: string;
	delimiter: string;
};

export type PageExportDto = PagableResponse<ExportDto>;

export type ExportListParams = { sort: ExportSort; size: number; page: number };

export const useExportList = (
	{ sort, size, page }: ExportListParams,
	enabled?: boolean,
) =>
	useQuery(
		['export-list', { sort, size, page }],
		() =>
			api()
				.get(
					`exports?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
				)
				.json<PageExportDto>(),
		{
			refetchOnMount: 'always',
			refetchOnWindowFocus: 'always',
			refetchInterval: 10000,
			enabled,
		},
	);
