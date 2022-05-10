import { ResponsePromise } from 'ky';
import normalizeUtility from 'normalize-url';

import { Backend } from 'api/endpoints';

import { EASFilter } from './EASTypes';

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

export const normalizeUrl = (url: string) => {
	try {
		return url ? normalizeUtility(url, { stripWWW: false }) : '';
	} catch (error) {
		return '';
	}
};

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

const formatDate = (d: Date) => {
	const date = new Date(d);
	const offset = new Date(date).getTimezoneOffset();
	const newDate = new Date(date.getTime() - offset * 60 * 1000);
	return newDate.toISOString().split('T')[0];
};

export const easRange = (field: string, date: Date): EASFilter[] => [
	{
		field,
		operation: 'GTE',
		value: formatDate(date) + 'T00:00:00.000Z' ?? '',
	},
	{
		field,
		operation: 'LTE',
		value: formatDate(date) + 'T23:59:59.999Z' ?? '',
	},
];

// for testing, TODO: delete
export function wait(ms: number, value: Response): Promise<Response> {
	return new Promise(resolve => setTimeout(resolve, ms, value));
}

// const czRes = await fetch(
// 	window.location.origin + '/locales/cz.json',
// ).then(val => wait(1000, val));

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

type KeysOfType<T, U, B = false> = {
	[P in keyof T]: B extends true
		? T[P] extends U
			? U extends T[P]
				? P
				: never
			: never
		: T[P] extends U
		? P
		: never;
}[keyof T];

type PickByType<T, U, B = false> = Pick<T, KeysOfType<T, U, B>>;
export type Lookup<T, K> = K extends keyof T ? T[K] : never;
type DateAttrs = Record<keyof PickByType<Backend.Reading, Date>, unknown>;

const Dates: DateAttrs = {
	created: null,
	deleted: null,
	evaluatedAdmin: null,
	record1evaluatedAi: null,
	record2evaluatedAi: null,
	responseFromSap: null,
	sentToAi: null,
	sentToSap: null,
	updated: null,
	definiteEvaluation: null,
};

export const isDateAttr = (key: string) => key in Dates;

export const getDateString = (date: Date) =>
	(typeof date === 'string' ? new Date(date) : date)?.toLocaleDateString(
		'cs-CZ',
	);

export const getTimeString = (date: Date) =>
	(typeof date === 'string' ? new Date(date) : date)?.toLocaleTimeString(
		'cs-CZ',
	);

export const getDateTimeString = (date: Date) =>
	`${getDateString(date)} ${getTimeString(date)}`;

export const MakeTuple = <T extends string[]>(...args: T) => args;
