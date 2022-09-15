/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import Text, { H4 } from 'components/styled/Text';

import { useTheme } from 'theme';

import { useChildrenSearch } from 'api/childrenSearchApi';

import { usePublicationContext } from '../ctx/pub-ctx';

const PubSearchWithin: React.FC = () => {
	const pctx = usePublicationContext();

	const [toSearch, setToSearch] = useState('');
	const [query, setQuery] = useState('');
	const theme = useTheme();
	const response = useChildrenSearch(
		pctx.publication?.pid ?? '',
		query,
		query !== '',
	);
	//const debouncedSubmit = useMemo(() => debounce(setQuery, 500), [setQuery]);
	const results = response?.data ?? {};
	console.log({ query });
	console.log({ results });

	const filtered = (pctx.publicationChildren ?? []).filter(
		child => results[child.pid],
	);

	const filtered2 = filtered.map(fil => ({
		title: fil.details.pagenumber,
		ocr: results[fil.pid].textOcr,
	}));
	console.log({ filtered });

	return (
		<Box>
			<Flex>
				<TextInput
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
									onClick={() => setToSearch('')}
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
						console.log(e.target.value);

						setToSearch(e.target.value);
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							console.log(toSearch);

							setQuery(toSearch);
						}
					}}
				/>
			</Flex>
			{filtered2.length > 0 && (
				<Flex
					maxHeight={400}
					overflowY="auto"
					flexDirection="column"
					p={1}
					m={1}
					bg="white"
				>
					{filtered2.map((k, i) => (
						<Flex
							flexDirection="column"
							key={k.title + i}
							my={2}
							justifyContent="flex-start"
							alignItems="flex-start"
						>
							<H4>{k.title}</H4>
							{k.ocr.map(ocr => (
								<Flex
									flexDirection="column"
									key={k + ocr}
									my={0}
									justifyContent="flex-start"
									alignItems="flex-start"
									css={css`
										> p > strong {
											color: ${theme.colors.primary};
										}
									`}
								>
									<Text dangerouslySetInnerHTML={{ __html: ocr }}></Text>
								</Flex>
							))}
							<Divider />
						</Flex>
					))}
				</Flex>
			)}
		</Box>
	);
};

export default PubSearchWithin;
