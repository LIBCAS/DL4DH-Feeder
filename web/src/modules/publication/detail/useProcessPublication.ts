import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';
import { useChildrenSearch } from 'api/childrenSearchApi';
import { PublicationChild } from 'api/models';

import { useParseUrlIdsAndParams } from '../publicationUtils';
import { CurrentPage, PublicationContextSingleType } from '../ctx/pubContext';

import { PagesSearchResult } from './PubPagesDetail';

const useSearchPageDetail = (
	publicationChildren: PublicationChild[],
	multiview?: 'left' | 'right',
) => {
	const { getApropriateIds } = useParseUrlIdsAndParams();
	const { id, fulltext } = getApropriateIds(multiview);

	const searchResponse = useChildrenSearch(id, fulltext, !!fulltext);
	const results = useMemo(() => searchResponse.data ?? {}, [searchResponse]);
	const filteredChildren = useMemo(
		() => (publicationChildren ?? []).filter(child => results[child.pid]),
		[publicationChildren, results],
	);
	//for word highlighting
	const filteredOcrResults: PagesSearchResult[] = useMemo(
		() =>
			(publicationChildren ?? [])
				.filter(child => results[child.pid])
				.map(fil => ({
					title: fil.details.pagenumber,
					ocr: results[fil.pid].textOcr,
					pid: fil.pid,
					nameTag: results[fil.pid].nameTag,
				})),
		[publicationChildren, results],
	);
	const notFound =
		searchResponse.isSuccess &&
		(filteredChildren.length === 0 || !filteredChildren);
	return {
		notFound,
		isActive:
			notFound || (searchResponse.isSuccess && filteredChildren.length > 0),
		isLoading: searchResponse.isLoading,
		filteredOcrResults,
		filteredChildren,
	};
};

const useProcessPublication = (
	multiview?: 'left' | 'right',
): PublicationContextSingleType => {
	const { getApropriateIds } = useParseUrlIdsAndParams();
	const { id, pageId, keys } = getApropriateIds(multiview);

	// TODO: treba vyfiltrovat kapitoly zase
	// viz error
	//	http://localhost:3000/view/uuid:21426150-9e46-11dc-a259-000d606f5dc6?page=uuid%3A10367700-a71c-11dc-9cac-000d606f5dc6
	//TODO:
	//periodicals
	//http://localhost:3000/view/uuid:a9e0a9a0-3ec2-11e7-a7ae-001018b5eb5c?page=uuid%3A8afa1b60-2677-11e7-a38c-005056827e51

	// zhrnute
	//- kapitoly (filtrovat v childrenoch)
	// - periodika
	// - query search homepage, nameTag, mainSearch
	// - homepage - search input brat do uvahy ked len kliknem na  tlacitko

	const pubChildrenResponse = usePublicationChildren(id);
	const detailResponse = usePublicationDetail(id);
	const pubChildren = useMemo(
		() =>
			(pubChildrenResponse.data ?? []).filter(c => c.model !== 'internalpart'),

		[pubChildrenResponse],
	);
	const filtered = useSearchPageDetail(pubChildren, multiview);
	const [sp, setSp] = useSearchParams();
	const childrenToUse = filtered.isActive
		? filtered.filteredChildren
		: pubChildren;

	useEffect(() => {
		if (filtered.isLoading) {
			return;
		}
		if (!filtered.isActive) {
			if (!pageId && childrenToUse?.[0]?.pid) {
				sp.set(keys.page, childrenToUse?.[0]?.pid ?? 'index-detail-undefined');
				setSp(sp, { replace: true });
			}
		} else {
			if (filtered.notFound) {
				if (pageId) {
					sp.delete(keys.page);
					setSp(sp, { replace: true });
				}
			} else {
				if (pageId && !childrenToUse.some(c => c.pid === pageId)) {
					sp.set(
						keys.page,
						childrenToUse?.[0]?.pid ?? 'index-detail-undefined',
					);
					setSp(sp, { replace: true });
				} else {
					if (!pageId && childrenToUse?.[0]?.pid) {
						sp.set(
							keys.page,
							childrenToUse?.[0]?.pid ?? 'index-detail-undefined',
						);
						setSp(sp, { replace: true });
					}
				}
			}
		}
	}, [
		childrenToUse,
		keys.page,
		pageId,
		pubChildren,
		setSp,
		sp,
		filtered.notFound,
		filtered.isActive,
		filtered.isLoading,
	]);

	const childIndex = childrenToUse.findIndex(p => p.pid === pageId);
	const currentPage: CurrentPage = {
		uuid: pageId,
		childIndex,
		prevPid: childrenToUse[childIndex - 1]?.pid,
		nextPid: childrenToUse[childIndex + 1]?.pid,
	};

	return {
		publicationChildren: pubChildren,
		publication: detailResponse.data,
		filtered,
		currentPage,
		isLoading:
			detailResponse.isLoading ||
			pubChildrenResponse.isLoading ||
			filtered.isLoading,
	};
};
export default useProcessPublication;
