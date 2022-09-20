export function deepSearchByKeyRecursive(
	object: unknown,
	originalKey: string,
	matches: unknown[] = [],
) {
	if (object !== null) {
		if (Array.isArray(object)) {
			for (const arrayItem of object) {
				deepSearchByKeyRecursive(arrayItem, originalKey, matches);
			}
		} else if (typeof object == 'object' && object !== null) {
			for (const key of Object.keys(object)) {
				if (key === originalKey && object !== null) {
					matches.push(object[key] as unknown);
				} else if (object !== null) {
					deepSearchByKeyRecursive(object[key], originalKey, matches);
				}
			}
		}
	}

	return matches;
}

export const deepSearchByKey = (object: unknown, key: string): unknown[] => {
	const matches = [];
	deepSearchByKeyRecursive(object, key, matches);
	return matches;
};
