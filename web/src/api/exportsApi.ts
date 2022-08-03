import { useQuery } from 'react-query';
import { boolean } from 'yup';

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

export type PageExportDto = {
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;
	pageable: unknown;
	numberOfElements: number;
	sort: unknown;
	size: number;
	content: ExportDto[];
	number: number;
	empty: boolean;
};

export const useExportList = () =>
	useQuery('export-list', () => api().get(`exports`).json<PageExportDto>());
