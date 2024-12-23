import { useQuery } from 'react-query';

import { api } from 'api';
import { PagableParams } from 'models/solr';
import {
	UserRequestType,
	UserRequestDto,
	UserRequestListDto,
	UserRequestCreateDto,
} from 'models/user-requests';
import { Result } from 'models/common';

type Props = {
	params: PagableParams;
	type: UserRequestType;
	enabled?: boolean;
};

const REQUEST_API_BASE = 'user-requests';

export const userRequestCreateNew = (json: UserRequestCreateDto) => {
	const formData = new FormData();
	formData.append('type', json.type);
	formData.append('message', json.message);
	json.publicationIds.forEach(id => formData.append('publicationIds', id));
	json.files.forEach(file => formData.append('files', file));

	return api().post(REQUEST_API_BASE + '/', {
		body: formData,
		throwHttpErrors: false,
	});
};

export const useUserRequestsList = ({
	params: { page, sort, size },
	type,
	enabled,
}: Props) =>
	useQuery(
		['requests-list', { page, sort, size, type }],
		() =>
			//later(PDATA, 100),
			api()
				.get(
					`${REQUEST_API_BASE}/?sort=${sort.field},${sort.direction}&page=${page}&size=${size}`,
				)
				.json<Result<UserRequestListDto>>(),
		{
			refetchOnMount: 'always',
			refetchOnWindowFocus: 'always',
			refetchInterval: Infinity, //TODO:
			enabled,
		},
	);

export const useUserRequestDetail = (id: string) =>
	useQuery(
		['request-detail', id],
		() => api().get(`${REQUEST_API_BASE}/${id}`).json<UserRequestDto>(),
		//later(MOCK_DATA_DETAIL, 100),
	);

export const getUserRequestFiles = (userRequestId: string, fileId: string) =>
	api().get(`${REQUEST_API_BASE}/${userRequestId}/file/${fileId}`, {
		retry: 0,
	});

export const postNewUserRequestMessage = (
	userRequestId: string,
	message: string,
	files: File[],
) => {
	const formData = new FormData();

	formData.append('message', message);
	files.forEach(file => formData.append('files', file));
	return api().post(`${REQUEST_API_BASE}/${userRequestId}/message`, {
		body: formData,
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*

const MOCK_DATA_LIST: UserRequestListDto = {
	created: new Date().toISOString(),
	id: '1',
	identification: 'indetifikace',
	state: UserRequestState.CREATED,
	type: UserRequestType.ENRICHMENT,
	updated: new Date().toISOString(),
};

const content = [MOCK_DATA_LIST];

const PDATA: PagableResponse<UserRequestListDto> = {
	content,
	size: content.length,
	totalPages: 1,
	totalElements: content.length,
	first: true,
	last: true,
	empty: false,
	number: 1,
	numberOfElements: content.length,
	pageable: { offset: 0, page: 0 },
	sort: '',
};

export const randomString = (length: number) =>
	(Math.random() + 1).toString(36).substring(3).slice(0, Math.floor(length));

const createMockParts = (count: number): UserRequestPartDto[] => {
	const arr: UserRequestPartDto[] = Array.from(
		{ length: count },
		(_, index) => ({
			note: randomString(10),
			publicationId: 'publicationId-' + index,
			state: UserRequestState.CREATED,
			stateUntil: new Date().toISOString(),
		}),
	);
	return arr;
};

const MOCK_DATA_DETAIL: UserRequestDto = {
	created: new Date().toISOString(),
	id: '1',
	identification: 'iden',
	messages: Array(3)
		.fill(0)
		.map((_, index) => ({
			files: Array(Math.floor(Math.random() * 5))
				.fill(0)
				.map((_, index) => ({
					id: 'fileId-' + index,
					name: 'file name - ' + index,
				})),
			id: `id-${index}`,
			message:
				'Sprava, ' +
				Array(Math.floor(Math.random() * 30))
					.fill(0)
					.map(() => ' ' + randomString(10)),
		})),
	parts: createMockParts(10),
	state: UserRequestState.CREATED,
	type: UserRequestType.ENRICHMENT,
	updated: '',
	username: 'username',
};
*/
