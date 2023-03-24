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

import { usePublicationContext } from '../ctx/pub-ctx';

import PubThumbnails from './PubThumbnails';
import BibInternalParts from './biblio/bib-internalparts';

type Props = {
	isSecond?: boolean;
};

export type PagesSearchResult = {
	title: string;
	pid: string;
	ocr: string[];
	nameTag: Record<TagNameEnum, string[]>;
};

const PubPagesDetail: React.FC<Props> = ({ isSecond }) => {
	const SP_KEY = isSecond ? 'fulltext2' : 'fulltext';
	const NT_KEY = isSecond ? 'nameTag2' : 'nameTag';
	const PAGE_KEY = isSecond ? 'page2' : 'page';
	//TODO: refactor using  useParseUrlIdsAndParams()
	// const { getApropriateIds } = useParseUrlIdsAndParams();
	// const {} = getApropriateIds(isSecond);

	const pctx = usePublicationContext();
	const [sp, setSp] = useSearchParams();
	const { t } = useTranslation();
	//TODO: tabs ako na krameriovi
	//const [tab, setTab] = useState<'pages' | 'internalparts'>('pages');

	const [nameTag, setNameTag] = useState<TagNameEnum | null>(
		(sp.get(NT_KEY) as TagNameEnum) ?? null,
	);
	const [query, setQuery] = useState(sp.get(SP_KEY) ?? '');
	const uuid = isSecond
		? pctx.secondPublication?.pid ?? ''
		: pctx.publication?.pid ?? '';

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
		const cp = sp.get(PAGE_KEY);
		const fltx = sp.get(SP_KEY);
		if (
			!response.isLoading &&
			!filteredChildren.some(fc => fc?.pid === cp) &&
			fltx
		) {
			if (!filteredChildren[0]?.pid) {
				sp.delete(PAGE_KEY);
				setSp(sp);
				return;
			} else {
				sp.set(PAGE_KEY, filteredChildren[0]?.pid);
				setSp(sp);
			}
		}
	}, [filteredChildren, sp, setSp, SP_KEY, PAGE_KEY, response.isLoading]);

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
									sp.set(NT_KEY, tag);
								} else {
									sp.delete(NT_KEY);
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
					sp.set(SP_KEY, q);
					setSp(sp);
				}}
				placeholder={t('search:search_in_publication')}
				urlKeyOfValue={SP_KEY}
				onQueryClear={() => {
					setQuery('');
					setNameTag(null);
					sp.delete(SP_KEY);
					sp.delete(NT_KEY);
					setSp(sp);
					if (isSecond) {
						pctx.setPublicationChildrenFilteredOfSecond?.(null);
					} else {
						pctx.setPublicationChildrenFiltered?.(null);
						//pctx.setIsLoadingLeft(true);
					}
				}}
			/>
			<BibInternalParts isSecond={isSecond} />
			<PubThumbnails
				isSecond={isSecond}
				marginTop={150}
				pagesSearchResult={filtered}
				searchMode={query !== ''}
			/>
		</Flex>
	);
};
export default PubPagesDetail;
