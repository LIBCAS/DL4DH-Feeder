import { ResponsePromise } from 'ky';

import { AvailableNameTagFilters, TagNameEnum } from 'api/models';

import {
	NameTagCode,
	NameTagFilterToNameTagEnum,
	OperationCode,
} from './enumsMap';

export type FilteredKeys<T, C> = {
	[K in keyof T]: T[K] extends C ? K : never;
}[keyof T];

export function assert(
	condition: boolean | undefined,
	msg?: string,
): asserts condition {
	if (!condition) {
		throw new Error(msg);
	}
}

export const pluralRules = (
	count: number,
	options: { one: string; few: string; many: string },
	showCount = true,
) => {
	switch (Math.abs(count)) {
		case 1:
			return showCount ? `${count} ${options.one}` : options.one;
		case 2:
		case 3:
		case 4:
			return showCount ? `${count} ${options.few}` : options.few;
		default:
			return showCount ? `${count} ${options.many}` : options.many;
	}
};

export const responseWithData = <T>(
	response: ResponsePromise,
	getData: (r: Response) => Promise<T> | T = async r => (await r.json()) as T,
) => response.then(async r => [r, await getData(r)] as const);

export const asRecord = <T extends unknown>(...obj: T[]): Record<number, T> =>
	obj;

export const retryPromise = <T>(
	fn: () => Promise<T>,
	retriesLeft = 4,
	interval = 250,
) => {
	return new Promise<T>((resolve, reject) => {
		return fn()
			.then(resolve)
			.catch(error => {
				if (retriesLeft === 1) {
					reject(error);
					return;
				}

				setTimeout(() => {
					// Passing on "reject" is the important part
					retryPromise(fn, retriesLeft - 1, interval).then(resolve, reject);
				}, interval);
			});
	});
};

export const areEqualProps =
	<T extends Record<string, unknown>>(keys: (keyof T)[]) =>
	(lhs: T, rhs: T) =>
		keys.every(key => lhs[key] === rhs[key]);

export const asyncForEach = async <T>(
	array: T[],
	callback: (array: T, index: number, arr: T[]) => Promise<unknown>,
) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

// for testing, TODO: delete
export function wait(ms: number, value: Response): Promise<Response> {
	return new Promise(resolve => setTimeout(resolve, ms, value));
}

/**
 * Returns width of scrollbar on current browser
 */
export function getScrollBarWidth(): number {
	const inner = document.createElement('p');
	inner.style.width = '100%';
	inner.style.height = '200px';

	const outer = document.createElement('div');
	outer.style.position = 'absolute';
	outer.style.top = '0px';
	outer.style.left = '0px';
	outer.style.visibility = 'hidden';
	outer.style.width = '200px';
	outer.style.height = '150px';
	outer.style.overflow = 'hidden';
	outer.appendChild(inner);

	document.body.appendChild(outer);
	const w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	let w2 = inner.offsetWidth;
	if (w1 === w2) {
		w2 = outer.clientWidth;
	}

	document.body.removeChild(outer);

	const size = w1 - w2;

	return size;
}

export type Lookup<T, K> = K extends keyof T ? T[K] : never;

export const getDateString = (date: Date) =>
	(typeof date === 'string' ? new Date(date) : date)?.toLocaleDateString(
		'cs-CZ',
		{
			// you can use undefined as first argument
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		},
	);

export const getTimeString = (date: Date) =>
	(typeof date === 'string' ? new Date(date) : date)?.toLocaleTimeString(
		'cs-CZ',
	);

export const getDateTimeString = (date: Date) =>
	`${getDateString(date)} ${getTimeString(date)}`;

export const MakeTuple = <T extends string[]>(...args: T) => args;

export const nameTagQueryCtor = (
	nameTag?: keyof AvailableNameTagFilters | TagNameEnum,
	operation?: 'EQUAL' | 'NOT_EQUAL',
	value?: string,
) => {
	if (!nameTag || !operation || !value) {
		console.log({ error: 'invalid params', nameTag, operation, value });
		return null;
	}
	let tag = nameTag;
	if (nameTag in NameTagFilterToNameTagEnum) {
		tag = NameTagFilterToNameTagEnum[nameTag];
	}
	const tagCode = NameTagCode[tag];
	const opCode = OperationCode[operation];
	return { name: 'NT', value: `${tagCode}${opCode}${value}` };
};

export const downloadFile = (fileUrl: string, filename: string) => {
	if (fileUrl !== '') {
		const a = document.createElement('a');
		a.href = fileUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(a.href);
		try {
			document.body.removeChild(a);
		} catch (error) {
			console.log(error);
		}
	}
};
