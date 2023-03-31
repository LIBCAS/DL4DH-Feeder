/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import QuerySearchInput from 'components/search/QuerySearchInput';
import TagNameDropDown from 'components/search/TagNameDropDown';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { api } from 'api';

import { useChildrenSearch } from 'api/childrenSearchApi';
import { TagNameEnum } from 'api/models';

import { useWordHighlightContext } from 'hooks/useWordHighlightContext';
import { useMultiviewContext } from 'hooks/useMultiviewContext';

import { usePublicationContext } from '../ctx/pub-ctx';
import { useParseUrlIdsAndParams } from '../publicationUtils';

import PubThumbnails from './PubThumbnails';
import BibInternalParts from './biblio/bib-internalparts';

export type PagesSearchResult = {
	title: string;
	pid: string;
	ocr: string[];
	nameTag: Record<TagNameEnum, string[]>;
};

const PubPagesDetail = () => {
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';
	const { getApropriateIds } = useParseUrlIdsAndParams();

	const {
		id: uuid,
		fulltext,
		pageId,
		keys,
		nameTag: urlNameTag,
	} = getApropriateIds();

	const pctx = usePublicationContext();
	const [sp, setSp] = useSearchParams();
	const { t } = useTranslation();

	const [nameTag, setNameTag] = useState<TagNameEnum | null>(
		(urlNameTag as TagNameEnum) ?? null,
	);
	const [query, setQuery] = useState(fulltext ?? '');

	const isEnriched = isSecond
		? pctx.secondPublication?.enriched
		: pctx.publication?.enriched;

	const response = useChildrenSearch(uuid, query, query !== '');
	const { setResult2, setResult1 } = useWordHighlightContext();

	useEffect(() => {
		if (!response.isLoading && response.data) {
			if (isSecond) {
				setResult2?.(response.data);
			} else {
				setResult1?.(response.data);
			}
		}
	}, [response, setResult1, setResult2, isSecond]);

	const results = useMemo(() => response?.data ?? {}, [response.data]);

	const children = isSecond
		? pctx.publicationChildrenOfSecond
		: pctx.publicationChildren;

	const filteredChildren = useMemo(
		() => (children ?? []).filter(child => results[child.pid]),
		[children, results],
	);
	useEffect(() => {
		isSecond
			? pctx.setIsLoadingRight(response.isLoading)
			: pctx.setIsLoadingLeft(response.isLoading);
	}, [response, pctx, isSecond]);

	useEffect(() => {
		if (isSecond) {
			pctx.setPublicationChildrenFilteredOfSecond(
				filteredChildren.length > 0 ? filteredChildren : null,
			);
		} else {
			pctx.setPublicationChildrenFiltered(
				filteredChildren.length > 0 ? filteredChildren : null,
			);
		}
	}, [results, filteredChildren, pctx, isSecond]);

	const filtered: PagesSearchResult[] = useMemo(
		() =>
			(children ?? [])
				.filter(child => results[child.pid])
				.map(fil => ({
					title: fil.details.pagenumber,
					ocr: results[fil.pid].textOcr,
					pid: fil.pid,
					nameTag: results[fil.pid].nameTag,
				})),
		[children, results],
	);
	useEffect(() => {
		const cp = pageId;
		const fltx = fulltext;
		if (
			!response.isLoading &&
			!filteredChildren.some(fc => fc?.pid === cp) &&
			fltx
		) {
			if (!filteredChildren[0]?.pid) {
				sp.delete(keys.page);
				setSp(sp);
			} else {
				sp.set(keys.page, filteredChildren[0]?.pid);
				setSp(sp);
			}
		}
	}, [filteredChildren, sp, setSp, keys, response.isLoading, pageId, fulltext]);

	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<Flex flexDirection="column" width={1} height="100%">
			<QuerySearchInput
				AdditionalLeftJSX={
					isEnriched ? (
						<TagNameDropDown
							onTagNameSelected={tag => {
								setNameTag(tag);
								if (tag) {
									sp.set(keys.nameTag, tag);
								} else {
									sp.delete(keys.nameTag);
								}

								setSp(sp);
							}}
							selectedItemView="ICON"
							selectedNameTag={nameTag}
						/>
					) : undefined
				}
				hintApi={async q =>
					api()
						.get(
							`item/${uuid}/children/search/hint?q=${q}${
								nameTag ? `&nameTagType=${nameTag}` : ''
							}`,
						)
						.json<string[]>()
				}
				onQueryUpdate={q => {
					setQuery(q);
					sp.set(keys.fulltext, q);
					setSp(sp);
				}}
				placeholder={t('search:search_in_publication')}
				urlKeyOfValue={keys.fulltext}
				onQueryClear={() => {
					setQuery('');
					setNameTag(null);
					sp.delete(keys.fulltext);
					sp.delete(keys.nameTag);
					setSp(sp);
					if (isSecond) {
						pctx.setPublicationChildrenFilteredOfSecond?.(null);
						setResult2?.({});
					} else {
						pctx.setPublicationChildrenFiltered?.(null);
						setResult1?.({});
					}
				}}
			/>
			<BibInternalParts>
				<PubThumbnails
					isSecond={isSecond}
					marginTop={150}
					pagesSearchResult={filtered}
					searchMode={query !== ''}
				/>
			</BibInternalParts>
		</Flex>
	);
};
export default PubPagesDetail;
