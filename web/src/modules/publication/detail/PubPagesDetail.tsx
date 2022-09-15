/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { debounce } from 'lodash-es';
import { useMemo, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import MainSearchInput from 'components/search/MainSearchInput';
import QuerySearchInput from 'components/search/QuerySearchInput';
import TagNameDropDown from 'components/search/TagNameDropDown';

import { api } from 'api';

import { useChildrenSearch } from 'api/childrenSearchApi';

import { usePublicationContext } from '../ctx/pub-ctx';

import PubThumbnails from './PubThumbnails';

type Props = {
	isSecond?: boolean;
};

export type PagesSearchResult = {
	title: string;
	pid: string;
	ocr: string[];
};

const PubPagesDetail: React.FC<Props> = ({ isSecond }) => {
	const pctx = usePublicationContext();

	const [toSearch, setToSearch] = useState('');
	const [query, setQuery] = useState('');
	const uuid = isSecond
		? pctx.secondPublication?.pid ?? ''
		: pctx.publication?.pid ?? '';
	const response = useChildrenSearch(uuid, query, query !== '');
	const debouncedSubmit = useMemo(() => debounce(setQuery, 950), [setQuery]);
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
				})),
		[children, results],
	);

	return (
		<Flex flexDirection="column" width={1}>
			<TagNameDropDown />
			<QuerySearchInput
				hintApi={async q =>
					api().get(`item/${uuid}/children/search/hint?q=${q}`).json<string[]>()
				}
				onQueryUpdate={q => setQuery(q)}
				placeholder="Vyhledávat v publikaci"
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
