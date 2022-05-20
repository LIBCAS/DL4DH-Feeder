/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { parse } from 'query-string';
import { debounce, isEqual, omit } from 'lodash-es';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';
import Button from 'components/styled/Button';

import { useTheme } from 'theme';
import { api } from 'api';

import {
	FiltersDto,
	ModelsEnum,
	NameTagCode,
	NameTagFilterDto,
	OperationCode,
	TagNameEnum,
} from 'api/models';

import {
	fieldsTuple,
	operationsTuple,
	TOperation,
	TSearchQuery,
	useSearchContext,
} from 'hooks/useSearchContext';

import { NameTagToText } from 'utils/enumsMap';

export const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

/* const FieldToTextLabel: Record<TagNameEnum, string> = {
	author: 'Autor',
	keyword: 'Klucove slovo',
	title: 'Titul',
}; */

function getKeyByValue(object: Record<string, string>, value: string) {
	return Object.keys(object).find(key => object[key] === value);
}

type TRawSearchQuery = Omit<TSearchQuery, 'nameTagFilters'> & {
	NT: string | string[];
};

const sanitizeSearchQuery = (q: TRawSearchQuery) => {
	const sanitized = { ...omit(q, 'NT') } as TSearchQuery;
	let NT = q?.NT;
	if (typeof q.models === 'string') {
		sanitized.models = [q.models];
	}
	if (typeof q.keywords === 'string') {
		sanitized.keywords = [q.keywords];
	}
	if (typeof q.authors === 'string') {
		sanitized.authors = [q.authors];
	}
	if (typeof q.languages === 'string') {
		sanitized.languages = [q.languages];
	}

	if (sanitized.models) {
		sanitized.models = sanitized.models.map(
			m => m.toLocaleUpperCase() as ModelsEnum,
		);
	}

	if (typeof NT === 'string') {
		NT = [NT];
	}
	if (NT) {
		const parsedNT = NT.map(nt => {
			const type = getKeyByValue(NameTagCode, nt[0]) as TagNameEnum;
			const operator = getKeyByValue(OperationCode, nt[1]) as
				| 'EQUAL'
				| 'NOT_EQUAL';
			const value = nt.slice(2);
			const filter: NameTagFilterDto = {
				type,
				operator,
				values: [value],
			};
			return filter;
		});
		sanitized.nameTagFilters = parsedNT;
	}

	return sanitized;
};

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();
	const theme = useTheme();
	const push = useNavigate();
	const [localState, setLocalState] = useState('');
	const [showTagNameMenu, setShowTagNameMenu] = useState(false);
	const [showTagOpMenu, setShowTagOpMenu] = useState(false);
	const [selectedTagName, setSelectedTagName] = useState<TagNameEnum | null>(
		null,
	);
	const [selectedTagOp, setSelectedTagOp] = useState<
		'EQUAL' | 'NOT_EQUAL' | null
	>(null);

	const [searchParams, setSearchParams] = useSearchParams();

	const [hints, setHints] = useState<string[]>([]);
	useEffect(() => {
		setLocalState(state.searchQuery?.query ?? '');
	}, [state.searchQuery]);

	const handleUpdateContext = (newState?: string) => {
		if (selectedTagName) {
			searchParams.append(
				'NT',
				`${NameTagCode[selectedTagName]}${
					OperationCode[selectedTagOp ?? 'EQUAL']
				}${newState ?? localState}`,
			);
			setLocalState('');
			setSelectedTagName(null);
			setSelectedTagOp(null);
			setSearchParams(searchParams);
		} else {
			searchParams.set('query', newState ?? localState);
			setLocalState('');
			setSelectedTagName(null);
			setSelectedTagOp(null);
			setSearchParams(searchParams);
		}
	};

	const { search } = useLocation();
	const parsed = useMemo(
		() => sanitizeSearchQuery(parse(search) as unknown as TRawSearchQuery),
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

	const getHint = useCallback(
		async (q: string) => {
			const nameTagMode = selectedTagName && selectedTagOp;
			const hints = await api()
				.post(
					`search/hint?${
						nameTagMode ? `nameTagType=${selectedTagName}&` : ''
					}q=${q}`,
				)
				.json<string[]>()
				.catch(r => console.log(r));
			if (hints) {
				setHints(hints);
			}
		},
		[selectedTagName, selectedTagOp],
	);

	const debouncedHint = useMemo(() => debounce(getHint, 200), [getHint]);

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
						setShowTagNameMenu(false);
						setShowTagOpMenu(false);
						setLocalState(e.target.value);
						debouncedHint(e.target.value);
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							handleUpdateContext();
						}
					}}
					onClick={() => {
						if (localState === '') {
							if (selectedTagName && !selectedTagOp) {
								setShowTagOpMenu(true);
							}
							if (!selectedTagName) {
								setShowTagNameMenu(true);
								setShowTagOpMenu(false);
							}
						}
					}}
					iconLeft={
						<Flex color="primary" ml={2} alignItems="center">
							<MdSearch size={26} />
							<ClickAway onClickAway={() => setShowTagNameMenu(false)}>
								<SimpleSelect
									isExpanded={showTagNameMenu}
									value={selectedTagName}
									options={fieldsTuple}
									onChange={field => {
										setShowTagNameMenu(false);
										setShowTagOpMenu(true);
										if (field) {
											setSelectedTagName(field);
										}
										/* field
											? dispatch?.({
													type: 'changeNameTagFilter',
													nameTagFilter: {
														type: field,
														operator: 'EQUAL',
														values: ['ahoj'],
													},
											  })
											: null; */
									}}
									keyFromOption={item => (item ? item : '')}
									nameFromOption={item => (item ? NameTagToText[item] : '')}
									placeholder=""
									arrowHidden
									wrapperCss={css`
										border: 1px solid ${theme.colors.primaryLight};
										background: ${theme.colors.primaryLight};
										visibility: ${selectedTagName ? 'visible' : 'hidden'};
										justify-content: center;
										margin-left: 2px;
										margin-right: 2px;
										&:hover {
											border: 1px solid ${theme.colors.border};
										}
									`}
									menuItemCss={css`
										padding-left: 16px;
										padding-right: 16px;
									`}
								/>
							</ClickAway>
							{selectedTagName && (
								<ClickAway onClickAway={() => setShowTagOpMenu(false)}>
									<SimpleSelect
										isExpanded={showTagOpMenu}
										value={selectedTagOp}
										options={operationsTuple}
										onChange={operation => {
											setShowTagOpMenu(false);
											setSelectedTagOp(operation);
										}}
										keyFromOption={item =>
											item ? OperationToTextLabel[item] : ''
										}
										width={50}
										arrowHidden
										nameFromOption={item =>
											item ? OperationToTextLabel[item] : ''
										}
										wrapperCss={css`
											font-size: ${theme.fontSizes.xl}px;
											border: none;
											background: ${theme.colors.primaryLight};
											justify-content: center;
											margin-left: 2px;
											margin-right: 2px;
											&:hover {
												border: 1px solid ${theme.colors.border};
											}
										`}
										menuItemCss={css`
											padding-left: 16px;
											padding-right: 16px;
											font-size: 20px !important;
										`}
									/>
								</ClickAway>
							)}
						</Flex>
					}
					iconRight={
						localState !== '' || selectedTagName || selectedTagOp ? (
							<Flex mr={3} color="primary">
								<MdClear
									onClick={() => {
										setLocalState('');
										setSelectedTagName(null);
										setSelectedTagOp(null);
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
				{hints.length > 0 &&
					localState !== '' &&
					(!showTagNameMenu || !showTagOpMenu) && (
						<ClickAway onClickAway={() => setHints([])}>
							<Flex
								position="absolute"
								// left={200 + menuOffset}
								left={50}
								top={50}
								bg="white"
								color="text"
								css={css`
									border: 1px solid ${theme.colors.border};
									box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
								`}
							>
								<Flex
									position="relative"
									flexDirection="column"
									overflowY="auto"
									maxHeight="80vh"
								>
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
												cursor: default;
												border-bottom: 1px solid ${theme.colors.primaryLight};
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
