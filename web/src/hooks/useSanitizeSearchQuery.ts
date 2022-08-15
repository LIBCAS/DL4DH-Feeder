import { omit } from 'lodash-es';
import { parse } from 'query-string';
import { useMemo } from 'react';

import { ModelsEnum, NameTagFilterDto, TagNameEnum } from 'api/models';

import { NameTagCode, OperationCode } from 'utils/enumsMap';

import { TSearchQuery } from './useSearchContext';

function getKeyByValue(object: Record<string, string>, value: string) {
	return Object.keys(object).find(key => object[key] === value);
}

type TRawSearchQuery = Omit<TSearchQuery, 'nameTagFilters'> & {
	NT: string | string[];
};
//TODO: Main searchquery parser, make hook from it and call it somwhere else probably (header? app?)
const sanitizeSearchQuery = (q: TRawSearchQuery) => {
	const sanitized = { ...omit(q, ['NT']) } as TSearchQuery;
	const page = q.page;
	sanitized.page = page ?? 1;

	//sanitized.yearFrom = get(q, 'from') ?? null;
	//sanitized.yearTo = get(q, 'to') ?? null;

	let NT = q?.NT;
	if (typeof q.models === 'string') {
		sanitized.models = [q.models];
	}
	if (typeof q.keywords === 'string') {
		sanitized.keywords = [q.keywords];
	}
	if (typeof q.authors === 'string') {
		sanitized.authors = [q.authors];
	}
	if (typeof q.languages === 'string') {
		sanitized.languages = [q.languages];
	}

	if (sanitized.models) {
		sanitized.models = sanitized.models.map(
			m => m.toLocaleUpperCase() as ModelsEnum,
		);
	}

	if (typeof NT === 'string') {
		NT = [NT];
	}
	if (NT) {
		const parsedNT = NT.map(nt => {
			const type = getKeyByValue(NameTagCode, nt[0]) as TagNameEnum;
			const operator = getKeyByValue(OperationCode, nt[1]) as
				| 'EQUAL'
				| 'NOT_EQUAL';
			const value = nt.slice(2);
			const filter: NameTagFilterDto = {
				type,
				operator,
				values: [value],
			};
			return filter;
		});
		sanitized.nameTagFilters = parsedNT;
	}

	return sanitized;
};

const useSanitizeSearchQuery = (query: string) => {
	const sanitized = useMemo(
		() => sanitizeSearchQuery(parse(query) as unknown as TRawSearchQuery),
		[query],
	);
	return sanitized;
};

export default useSanitizeSearchQuery;
