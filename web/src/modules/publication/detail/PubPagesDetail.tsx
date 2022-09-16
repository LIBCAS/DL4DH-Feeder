/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import MainSearchInput from 'components/search/MainSearchInput';
import QuerySearchInput from 'components/search/QuerySearchInput';
import TagNameDropDown from 'components/search/TagNameDropDown';

import { api } from 'api';

import { useChildrenSearch } from 'api/childrenSearchApi';
import { TagNameEnum } from 'api/models';

import { usePublicationContext } from '../ctx/pub-ctx';

import PubThumbnails from './PubThumbnails';

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
	const pctx = usePublicationContext();
	const [sp, setSp] = useSearchParams();

	const [nameTag, setNameTag] = useState<TagNameEnum | null>(
		(sp.get(NT_KEY) as TagNameEnum) ?? null,
	);
	const [query, setQuery] = useState(sp.get(SP_KEY) ?? '');
	const uuid = isSecond
		? pctx.secondPublication?.pid ?? ''
		: pctx.publication?.pid ?? '';
	const response = useChildrenSearch(uuid, query, query !== '');

	const results = useMemo(() => response?.data ?? {}, [response.data]);

	const children = pctx.publicationChildren;

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

	return (
		<Flex flexDirection="column" width={1}>
			{/* <TagNameDropDown
				onTagNameSelected={tag => {
					setNameTag(tag);
					sp.set(NT_KEY, tag);
					setSp(sp);
				}}
				selectedItemView="TEXT"
				selectedNameTag={nameTag}
			/> */}
			<QuerySearchInput
				AdditionalLeftJSX={
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
				placeholder="Vyhledávat v publikaci"
				urlKeyOfValue={SP_KEY}
				onQueryClear={() => {
					setQuery('');
					setNameTag(null);
					sp.delete(SP_KEY);
					sp.delete(NT_KEY);
					setSp(sp);
				}}
			/>
			{/* <MainSearchInput updateSearchQuery={q => setQuery(q)} /> */}
			{/* <TextInput
				placeholder="Vyhledávat v publikaci"
				label=""
				labelType="inline"
				color="primary"
				value={toSearch}
				wrapperCss={css`
					border-top: none;
					border-left: none;
					border-right: none;
				`}
				iconLeft={
					<Flex color="primary" ml={2}>
						<MdSearch size={26} />
					</Flex>
				}
				iconRight={
					toSearch !== '' ? (
						<Flex mr={3} color="primary">
							<MdClear
								onClick={() => {
									setToSearch('');
									setQuery('');
								}}
								css={css`
									cursor: pointer;
								`}
							/>
						</Flex>
					) : (
						<></>
					)
				}
				onChange={e => {
					debouncedSubmit(toSearch);

					setToSearch(e.target.value);
				}}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						setQuery(toSearch);
					}
				}}
			/>
 */}
			<PubThumbnails
				isSecond={isSecond}
				marginTop={120}
				pagesSearchResult={filtered}
				searchMode={query !== ''}
			/>
		</Flex>
	);
};
export default PubPagesDetail;
