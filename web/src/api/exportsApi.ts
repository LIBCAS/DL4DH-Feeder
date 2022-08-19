import { useQuery } from 'react-query';

import { Sort } from 'modules/export/PublicationExportDialog';

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
	status: JobStatusEnum;
};

export type PageExportDto = {
	totalPages: number;
	totalElements: number;
	first: boolean;
	last: boolean;

	numberOfElements: number;
	sort: unknown;
	size: number;
	content: ExportDto[];
	number: number;
	empty: boolean;
	pageable: {
		offset: number;
		page: number;
	};
};

export type ExportListParams = { sort: Sort; size: number; page: number };

export const useExportList = ({ sort, size, page }: ExportListParams) =>
	useQuery(
		['export-list', { sort, size, page }],
		() =>
			api()
				.get(
					`exports?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
				)
				.json<PageExportDto>(),
		{
			refetchOnMount: true,
			refetchOnWindowFocus: true,
			refetchInterval: 60000,
		},
	);
//?sort=${sort.field},${sort.direction}&page=${page}&size=${size}
