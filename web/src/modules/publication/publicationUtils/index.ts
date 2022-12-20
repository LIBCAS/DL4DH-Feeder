import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

//const err_msg = 'pparts_parent_out_of_bounds';

export const usePeriodicalParts = (uuid: string) => {
	const [parts, setParts] = useState<{
		next: string | undefined;
		prev: string | undefined;
	}>({ next: undefined, prev: undefined });
	const { data: detail, isLoading: isDetailLoading } =
		usePublicationDetail(uuid);

	const ctx = detail?.context?.flat(1) ?? [];
	const parentUuid = ctx[ctx?.length - 2]?.pid;
	const { data: otherChildren, isLoading: isChildrenLoading } =
		usePublicationChildren(parentUuid);

	useEffect(() => {
		if (!isDetailLoading && !isChildrenLoading) {
			if (otherChildren && otherChildren.length > 0) {
				const currentIndex = otherChildren?.findIndex(ch => ch.pid === uuid);
				setParts({
					next:
						currentIndex !== undefined
							? otherChildren?.[currentIndex + 1]?.pid
							: undefined,
					prev:
						currentIndex !== undefined
							? otherChildren?.[currentIndex - 1]?.pid
							: undefined,
				});
			}
		}
	}, [isChildrenLoading, isDetailLoading, otherChildren, uuid]);

	return { isLoading: isDetailLoading || isChildrenLoading, parts };
};

export const useParseUrlIdsAndParams = () => {
	const isMultiview = window.location.pathname.includes('/multiview/');
	const nav = useNavigate();
	const {
		id: singleId,
		id1: mIdLeft,
		id2: mIdRight,
	} = useParams<{ id: string; id1: string; id2: string }>();
	const [sp] = useSearchParams();
	const page = sp.get('page') ?? '';
	const page2 = sp.get('page2') ?? '';
	const fulltext = sp.get('fulltext') ?? '';
	const fulltext2 = sp.get('fulltext2') ?? '';
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
	return {
		isMultiview,
		singleId,
		mIdLeft,
		mIdRight,
		page,
		page2,
		fulltext,
		fulltext2,
		navLeft,
		navRight,
	};
};

export const createSearchParamsString = (
	params: { name: string; value: number | string | undefined | null }[],
) => {
	const filtered = params.filter(p => p.value && p.value !== '');
	const pairs = filtered.map(f => `${f.name}=${f.value}`).join('&');
	return pairs.length > 0 ? `?${pairs}` : '';
};
