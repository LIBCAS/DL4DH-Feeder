import { APP_CONTEXT } from 'utils/enumsMap';

import { Backend } from './endpoints';

import { api } from '.';

export const getFile = <T extends Backend.File | undefined>(file: T) =>
	(file
		? `${APP_CONTEXT}/api/files/${file.id}`
		: undefined) as T extends Backend.File ? string : undefined;

export const getFileUrl = (file?: Backend.File | File, placeholder?: string) =>
	file instanceof File
		? URL.createObjectURL(file)
		: getFile(file) ?? placeholder;

export const uploadPhoto = async (
	file: File,
): Promise<readonly [Response, Backend.File | undefined]> => {
	const formData = new FormData();
	formData.append('file', file);
	return await api()
		.post('photo', { body: formData, throwHttpErrors: false })
		.then(async r =>
			r.ok
				? ([r, (await r.json()) as unknown as Backend.File] as const)
				: ([r, undefined] as const),
		);
};

export const getPhoto = async (id: string) =>
	api()
		.get(`photo/${id}`, { timeout: 30000, throwHttpErrors: false })
		.then(async r =>
			r.ok ? await r.blob().then(r => URL.createObjectURL(r)) : undefined,
		)
		.catch(undefined);
