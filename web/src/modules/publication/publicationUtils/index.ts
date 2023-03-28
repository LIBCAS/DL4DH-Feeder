import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

//const err_msg = 'pparts_parent_out_of_bounds';

export const useParseUrlIdsAndParams = () => {
	const isMultiview = useMemo(
		() => window.location.pathname.includes('/multiview/'),
		[],
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
	const page = sp.get('page');
	const page2 = sp.get('page2');
	const fulltext = sp.get('fulltext');
	const fulltext2 = sp.get('fulltext2');
	const nameTag = sp.get('nameTag');
	const nameTag2 = sp.get('nameTag2');
	const navLeft = useCallback(
		() =>
			nav({
				pathname: `/view/${mIdLeft}`,
				search: createSearchParamsString([
					{ name: 'page', value: page },
					{ name: 'fulltext', value: fulltext },
				]),
			}),
		[fulltext, mIdLeft, nav, page],
	);

	const navRight = useCallback(
		() =>
			nav({
				pathname: `/view/${mIdRight}`,
				search: createSearchParamsString([
					{ name: 'page', value: page2 },
					{ name: 'fulltext', value: fulltext2 },
				]),
			}),
		[fulltext2, mIdRight, nav, page2],
	);

	const getApropriateIds = useCallback(
		(isSecond?: boolean) => {
			if (isMultiview) {
				if (isSecond) {
					return { id: mIdRight, pageId: page2, fulltext: fulltext2 };
				} else {
					return { id: mIdLeft, pageId: page, fulltext };
				}
			} else {
				return { id: singleId, pageId: page, fulltext };
			}
		},
		[
			fulltext,
			fulltext2,
			isMultiview,
			mIdLeft,
			mIdRight,
			page,
			page2,
			singleId,
		],
	);
todo bug: --- ked dam vyhladat vec s nametagom ale nenajde sa nic, tak to neajk pri multiview cykly
plus zvyraznovanie slov pri obohatenych a nametag nejde, BE by mal zachovat format z neobohatenych
//http://localhost:3000/multiview/uuid:21426150-9e46-11dc-a259-000d606f5dc6/uuid:1f0db940-6404-11e8-8637-005056827e51?fulltext2=cici&nameTag2=GEOGRAPHICAL_NAMES&page=uuid%3A4c66f50f-a6f7-4e59-a1ee-945cb226944a&page2=uuid%3A8df2ad00-68de-11e8-828b-005056825209
	const formatViewLink = useCallback(
		(uuid: string, isSecond?: boolean) => {
			if (!isMultiview) {
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
		},
		[
			fulltext,
			fulltext2,
			isMultiview,
			mIdLeft,
			mIdRight,
			nameTag,
			nameTag2,
			page,
			page2,
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
	};
};

export const createSearchParamsString = (
	params: { name: string; value: number | string | undefined | null }[],
) => {
	const filtered = params.filter(p => p.value && p.value !== '');
	const pairs = filtered.map(f => `${f.name}=${f.value}`).join('&');
	return pairs.length > 0 ? `?${pairs}` : '';
};
