import { useQuery } from 'react-query';

import { api, infiniteEndpoint } from 'api';
import { responseWithData } from 'utils';

import { EASParams } from 'utils/EASTypes';

import { Backend } from './endpoints';

/**EXTERNAL */

export const checkReading = async (barcode: string) => {
	return await responseWithData<Backend.ReadingPublicView & { code?: string }>(
		api().post(`reading/check?barcode=${barcode}`, {
			throwHttpErrors: false,
		}),
		async r => (r.ok ? await r.json() : undefined),
	);
};

export const submitReadingOldToDelete = async (
	externalId: string,
	json: Backend.ReadingSubmitDto,
): Promise<Response & { code: string }> =>
	api()
		.post(`reading/${externalId}/submit`, {
			json,
			throwHttpErrors: false,
		})
		.then(async r => await r.json());

export const submitReading = (
	externalId: string,
	json: Backend.ReadingSubmitDto,
): Promise<readonly [Response, Backend.Reading | undefined]> =>
	api()
		.post(`reading/${externalId}/submit`, {
			json,
			throwHttpErrors: false,
		})
		.then(async r =>
			r.ok
				? ([r, (await r.json()) as unknown as Backend.Reading] as const)
				: ([r, undefined] as const),
		);

export const useCustomerReadingsOverview = infiniteEndpoint<
	Backend.ReadingPublicView,
	[token: string | null, json: EASParams]
>(['external-my-readings'], (api, token, json) =>
	api.post(`reading/my-readings?token=${token as unknown as string}`, { json }),
);

/**ADMIN */

export const useAdminReadingsOverview = infiniteEndpoint<
	Backend.Reading,
	[json: EASParams]
>(['internal-admin-readings-overview'], (api, json) =>
	api.post('reading/list', { json }),
);

export const useExternalReading = (id: string, token: string | null) =>
	useQuery(
		['external-customer-reading-detail', id],
		() =>
			api()
				.get(`reading/${id}?token=${token}`, { throwHttpErrors: false })
				.then(r =>
					r.ok ? (r.json() as unknown as Backend.Reading) : undefined,
				),
		{ retry: 3, staleTime: 10000 },
	);

export const useInternalReading = (id: string) =>
	useQuery(
		['internal-admin-reading-detail', id],
		() =>
			api()
				.get(`reading/${id}`, { throwHttpErrors: false })
				.then(async r =>
					r.ok ? ((await r.json()) as unknown as Backend.Reading) : undefined,
				),
		{ retry: 3, staleTime: 10000 },
	);

export const verifyReading = (
	id: string,
	note: string,
): Promise<readonly [Response, Backend.Reading | undefined]> =>
	api()
		.put(`reading/${id}/verify`, {
			json: { note },
			throwHttpErrors: false,
		})
		.then(async r =>
			r.ok
				? ([r, (await r.json()) as unknown as Backend.Reading] as const)
				: ([r, undefined] as const),
		);
export const declineReading = (
	id: string,
	note: string,
): Promise<readonly [Response, Backend.Reading | undefined]> =>
	api()
		.put(`reading/${id}/decline`, {
			json: { note },
			throwHttpErrors: false,
		})
		.then(async r =>
			r.ok
				? ([r, (await r.json()) as unknown as Backend.Reading] as const)
				: ([r, undefined] as const),
		);

export const updateReading = (
	id: string,
	json: Backend.Reading,
): Promise<{ response: Response; data: Backend.Reading | undefined }> =>
	api()
		.put(`reading/${id}`, { json, throwHttpErrors: false })
		.then(async r =>
			r.ok
				? ({
						response: r,
						data: (await r.json()) as unknown as Backend.Reading,
				  } as const)
				: ({ response: r, data: undefined } as const),
		);
