/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parse, stringify } from 'query-string';
import { debounce, isEqual } from 'lodash-es';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';
import Button from 'components/styled/Button';

import { useTheme } from 'theme';
import { api } from 'api';

import { NameTagFilterDto } from 'api/models';

import {
	fieldsTuple,
	operationsTuple,
	TField,
	TOperation,
	TSearchQuery,
	useSearchContext,
} from 'hooks/useSearchContext';

const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

/* const FieldToTextLabel: Record<TagNameEnum, string> = {
	author: 'Autor',
	keyword: 'Klucove slovo',
	title: 'Titul',
}; */

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();
	const theme = useTheme();
	const { push } = useHistory();
	const [localState, setLocalState] = useState('');
	const [hints, setHints] = useState<string[]>([]);
	useEffect(() => {
		setLocalState(state.searchQuery?.query ?? '');
	}, [state.searchQuery]);

	const handleUpdateContext = (newState?: string) => {
		const nameTagFilters = JSON.stringify(state.searchQuery?.nameTagFilters);
		const url = stringify({
			...state.searchQuery,
			query: newState ?? localState,
			nameTagFilters: [],
		});
		/* dispatch?.({
			type: 'setSearchQuery',
			searchQuery: { ...state.searchQuery, query: parsed.query },
		}); */
		push(`/search?${url}`);
	};

	const { search } = useLocation();
	const parsed = useMemo(
		() => parse(search) as unknown as Partial<TSearchQuery>,
		[search],
	);

	useEffect(() => {
		if (!isEqual(parsed, state.searchQuery)) {
			console.log('not equal .. dispatching');
			dispatch?.({
				type: 'setSearchQuery',
				searchQuery: {
					...parsed,
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parsed]);

	const getHint = useCallback(async (q: string) => {
		const hints = await api()
			.post('search/hint', { json: { query: q } })
			.json<string[]>()
			.catch(r => console.log(r));
		if (hints) {
			setHints(hints);
		}
	}, []);

	const debouncedHint = useMemo(() => debounce(getHint, 200), [getHint]);
	const menuOffset = useMemo(
		() => Math.min(localState.length * 5, 500),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[hints],
	);
	console.log('state');
	console.log(state);
	console.log('parsed');
	console.log(parsed);

	return (
		<>
			<Flex
				pr={3}
				width={1}
				flexShrink={1}
				position="relative"
				overflow="visible"
				zIndex={1}
			>
				<TextInput
					placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
					label=""
					labelType="inline"
					color="primary"
					value={localState}
					onChange={e => {
						setLocalState(e.target.value);
						debouncedHint(e.target.value);
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							handleUpdateContext();
						}
					}}
					iconLeft={
						<Flex color="primary" ml={2} alignItems="center">
							<MdSearch size={26} />

							<SimpleSelect
								value={state.searchQuery?.nameTagFilters?.[0].type}
								options={fieldsTuple}
								onChange={field =>
									field
										? dispatch?.({
												type: 'changeNameTagFilter',
												nameTagFilter: {
													type: field,
													operator: 'EQUAL',
													values: ['ahoj'],
												},
										  })
										: null
								}
								keyFromOption={item => (item ? item : '')}
								nameFromOption={item => (item ? item : '')}
								placeholder="Filter"
								arrowHidden
								wrapperCss={css`
									border: 1px solid ${theme.colors.primaryLight};
									background: ${theme.colors.primaryLight};
									justify-content: center;
									margin-left: 2px;
									margin-right: 2px;
									&:hover {
										border: 1px solid ${theme.colors.border};
									}
								`}
							/>
							{/*<SimpleSelect
								value={state.searchQuery?.operation}
								options={operationsTuple}
								onChange={operation =>
									dispatch?.({
										type: 'setSearchQuery',
										searchQuery: { ...state.searchQuery, operation },
									})
								}
								keyFromOption={item => (item ? OperationToTextLabel[item] : '')}
								width={50}
								arrowHidden
								nameFromOption={item =>
									item ? OperationToTextLabel[item] : ''
								}
								wrapperCss={css`
									border: none;
									background: ${theme.colors.primaryLight};
									justify-content: center;
									margin-left: 2px;
									margin-right: 2px;
									&:hover {
										border: 1px solid ${theme.colors.border};
									}
								`}
							/> */}
						</Flex>
					}
					iconRight={
						localState !== '' ? (
							<Flex mr={3} color="primary">
								<MdClear
									onClick={() => {
										push(`/search`);
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
				/>
				{hints.length > 0 && localState !== '' && (
					<ClickAway onClickAway={() => setHints([])}>
						<Flex
							position="absolute"
							left={200 + menuOffset}
							top={50}
							bg="white"
							color="text"
							css={css`
								border: 1px solid ${theme.colors.border};
								box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
							`}
						>
							<Flex position="relative" flexDirection="column">
								{hints.map((h, index) => (
									<Flex
										px={3}
										py={2}
										key={index}
										onClick={() => {
											setLocalState(h);
											handleUpdateContext(h);
											setHints([]);
										}}
										css={css`
											cursor: pointer;
											&:hover {
												color: white;
												background-color: ${theme.colors.primary};
											}
										`}
									>
										<Text>{h}</Text>
									</Flex>
								))}
							</Flex>
						</Flex>
					</ClickAway>
				)}
			</Flex>
			<Flex flexShrink={0}>
				<Button
					width={150}
					variant="primary"
					py={2}
					mr={[2, 2, 2, 0]}
					onClick={() => handleUpdateContext()}
					disabled={localState === ''}
				>
					Hledat v K+
				</Button>
			</Flex>
		</>
	);
};
export default MainSearchInput;
