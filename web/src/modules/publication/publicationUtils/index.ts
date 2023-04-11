import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useSidepanelContext } from 'hooks/useSidepanelContext';

//const err_msg = 'pparts_parent_out_of_bounds';

export const useParseUrlIdsAndParams = () => {
	const sidepanel = useSidepanelContext();

	const isMultiview = useMemo(
		() => window.location.pathname.includes('/multiview/'),
		[],
	);

	const isSecond = useMemo(
		() => sidepanel === 'right' && isMultiview,
		[sidepanel, isMultiview],
	);

	const isSingleView = useMemo(
		() => window.location.pathname.includes('/view/'),
		[],
	);

	const isDetailView = useMemo(
		() => isMultiview || isSingleView,
		[isMultiview, isSingleView],
	);
	const nav = useNavigate();
	const {
		id: singleId,
		id1: mIdLeft,
		id2: mIdRight,
	} = useParams<{ id: string; id1: string; id2: string }>();
	const [sp] = useSearchParams();
	const page = sp.get('page') ?? undefined;
	const page2 = sp.get('page2') ?? undefined;
	const fulltext = sp.get('fulltext') ?? undefined;
	const fulltext2 = sp.get('fulltext2') ?? undefined;
	const nameTag = sp.get('nameTag') ?? undefined;
	const nameTag2 = sp.get('nameTag2') ?? undefined;
	const navLeft = useCallback(
		() =>
			nav({
				pathname: `/view/${mIdLeft}`,
				search: createSearchParamsString([
					{ name: 'page', value: page },
					{ name: 'fulltext', value: fulltext },
					{ name: 'nameTag', value: nameTag },
				]),
			}),
		[fulltext, mIdLeft, nameTag, nav, page],
	);

	const navRight = useCallback(
		() =>
			nav({
				pathname: `/view/${mIdRight}`,
				search: createSearchParamsString([
					{ name: 'page', value: page2 },
					{ name: 'fulltext', value: fulltext2 },
					{ name: 'nameTag', value: nameTag2 },
				]),
			}),
		[fulltext2, mIdRight, nameTag2, nav, page2],
	);

	const getApropriateIds = useCallback(
		(multiview?: 'left' | 'right') => {
			if (isMultiview) {
				if ((multiview && multiview === 'right') || isSecond) {
					return {
						id: mIdRight,
						pageId: page2,
						fulltext: fulltext2,
						nameTag: nameTag2,
						keys: {
							page: 'page2',
							fulltext: 'fulltext2',
							nameTag: 'nameTag2',
						},
					};
				} else {
					return {
						id: mIdLeft,
						pageId: page,
						fulltext,
						nameTag,
						keys: {
							page: 'page',
							fulltext: 'fulltext',
							nameTag: 'nameTag',
						},
					};
				}
			} else {
				return {
					id: singleId,
					pageId: page,
					fulltext,
					nameTag,
					keys: {
						page: 'page',
						fulltext: 'fulltext',
						nameTag: 'nameTag',
					},
				};
			}
		},
		[
			isMultiview,
			isSecond,
			mIdRight,
			page2,
			fulltext2,
			nameTag2,
			mIdLeft,
			page,
			fulltext,
			nameTag,
			singleId,
		],
	);
	const formatViewLink = useCallback(
		(uuid: string, forceMultiview?: boolean) => {
			if (!isDetailView) {
				return `/periodical/${uuid}`;
			} else {
				if (!isMultiview) {
					if (forceMultiview) {
						if (sidepanel === 'right') {
							console.log({ mIdLeft, page, fulltext });
							return `/multiview/${singleId}/${uuid}${createSearchParamsString([
								{ name: 'page', value: page },
								{ name: 'fulltext', value: fulltext },
								{ name: 'nameTag', value: nameTag },
							])}`;
						} else {
							return `/multiview/${uuid}/${singleId}${createSearchParamsString([
								{ name: 'page2', value: page },
								{ name: 'fulltext2', value: fulltext },
								{ name: 'nameTag2', value: nameTag },
							])}`;
						}
					}
					return `/view/${uuid}`;
				} else {
					if (isSecond) {
						return `/multiview/${mIdLeft}/${uuid}${createSearchParamsString([
							{ name: 'page', value: page },
							{ name: 'fulltext', value: fulltext },
							{ name: 'nameTag', value: nameTag },
						])}`;
					}
					return `/multiview/${uuid}/${mIdRight}${createSearchParamsString([
						{ name: 'page2', value: page2 },
						{ name: 'fulltext2', value: fulltext2 },
						{ name: 'nameTag2', value: nameTag2 },
					])}`;
				}
			}
		},
		[
			isDetailView,
			isMultiview,
			sidepanel,
			mIdLeft,
			page,
			fulltext,
			singleId,
			nameTag,
			isSecond,
			mIdRight,
			page2,
			fulltext2,
			nameTag2,
		],
	);

	return {
		isSingleView,
		isMultiview,
		isDetailView,
		singleId,
		multiviewIdLeft: mIdLeft,
		multiviewIdRight: mIdRight,
		page,
		page2,
		fulltext,
		fulltext2,
		navLeft,
		navRight,
		getApropriateIds,
		formatViewLink,
		isSecond,
	};
};

export const createSearchParamsString = (
	params: { name: string; value: number | string | undefined | null }[],
) => {
	const filtered = params.filter(p => p.value && p.value !== '');
	const pairs = filtered.map(f => `${f.name}=${f.value}`).join('&');
	return pairs.length > 0 ? `?${pairs}` : '';
};
