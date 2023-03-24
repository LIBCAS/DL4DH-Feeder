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
	};
};

export const createSearchParamsString = (
	params: { name: string; value: number | string | undefined | null }[],
) => {
	const filtered = params.filter(p => p.value && p.value !== '');
	const pairs = filtered.map(f => `${f.name}=${f.value}`).join('&');
	return pairs.length > 0 ? `?${pairs}` : '';
};
