/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import QuerySearchInput from 'components/search/QuerySearchInput';
import TagNameDropDown from 'components/search/TagNameDropDown';
import { Flex } from 'components/styled';

import { api } from 'api';

import { TagNameEnum } from 'api/models';

import { useMultiviewContext } from 'hooks/useMultiviewContext';

import { usePublicationContext2 } from '../ctx/pubContext';
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
	const pctx = usePublicationContext2();

	const { id: uuid, fulltext, keys, nameTag: urlNameTag } = getApropriateIds();

	const [sp, setSp] = useSearchParams();
	const { t } = useTranslation();

	const [nameTag, setNameTag] = useState<TagNameEnum | null>(
		(urlNameTag as TagNameEnum) ?? null,
	);
	const [query, setQuery] = useState(fulltext ?? '');

	const hintApi = useCallback(
		async (q: string) =>
			api()
				.get(
					`item/${uuid}/children/search/hint?q=${q}${
						nameTag ? `&nameTagType=${nameTag}` : ''
					}`,
				)
				.json<string[]>(),
		[nameTag, uuid],
	);

	const isEnriched = pctx.publication?.enriched ?? false;

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
				hintApi={hintApi}
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
				}}
			/>
			<BibInternalParts>
				<PubThumbnails
					isSecond={isSecond}
					marginTop={150}
					searchMode={query !== ''}
				/>
			</BibInternalParts>
		</Flex>
	);
};
export default PubPagesDetail;
