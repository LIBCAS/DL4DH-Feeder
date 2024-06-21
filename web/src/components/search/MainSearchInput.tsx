/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash-es';
import useMeasure from 'react-use-measure';
import { useTranslation } from 'react-i18next';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';
import Button from 'components/styled/Button';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { useTheme } from 'theme';
import { api } from 'api';
import { nameTagQueryCtor } from 'utils';

import { TagNameEnum } from 'api/models';

import {
	fieldsTuple,
	operationsTuple,
	TOperation,
} from 'hooks/useSearchContext';
import useNameTagLocalizedLabel from 'hooks/useNameTagLabel';

import { NameTagIcon } from 'utils/enumsMap';

export const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

export const OperationToWord: Record<TOperation, string> = {
	EQUAL: 'je',
	NOT_EQUAL: 'není',
};

const MainSearchInput = () => {
	const theme = useTheme();
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});
	const mainInputRef = useRef<HTMLInputElement | null>(null);
	const testRef = useRef<HTMLInputElement | null>(null);
	const [hh, setHh] = useState(0);
	const [hintLoading, setHintLoading] = useState(false);
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
	const localizeNameTag = useNameTagLocalizedLabel();
	const nav = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	// counter to prevent older hints promises to rewrite newer
	const counter = useRef(0);

	const [hints, setHints] = useState<string[]>([]);
	/* useEffect(() => {
		setLocalState(state.searchQuery?.query ?? '');
	}, [state.searchQuery]); */

	useEffect(() => {
		if (localState === '') {
			if (selectedTagName && !selectedTagOp) {
				setShowTagNameMenu(false);
				setShowTagOpMenu(true);
			}
			if (selectedTagName && selectedTagOp) {
				setShowTagNameMenu(false);
				setShowTagOpMenu(false);
			}
		}
	}, [localState, selectedTagName, selectedTagOp]);

	const handleUpdateContext = useCallback(
		(newState?: string) => {
			if (selectedTagName) {
				const nameTagQuery = nameTagQueryCtor(
					selectedTagName,
					selectedTagOp ?? 'EQUAL',
					newState ?? localState,
				);
				if (nameTagQuery) {
					searchParams.append(nameTagQuery.name, nameTagQuery.value);
				}

				setLocalState('');
				setSelectedTagName(null);
				setSelectedTagOp(null);
				//TODO: remove all params (like page, fulltext, etc...)
				searchParams.delete('page');
				setSearchParams(searchParams);

				//TODO: FIXME: ked je uzivatel na inej stranke nez search, poriesit aby sa dodali spravne search params
				if (!location.pathname.includes('/search?')) {
					nav('/search?' + searchParams);
				}
			} else {
				searchParams.set('query', newState ?? localState);
				setLocalState('');
				setSelectedTagName(null);
				setSelectedTagOp(null);
				//TODO: remove all params (like page, fulltext, etc...)
				searchParams.delete('page');
				setSearchParams(searchParams);

				//TODO: FIXME: ked je uzivatel na inej stranke nez search, poriesit aby sa dodali spravne search params
				if (!location.pathname.includes('/search?')) {
					nav('/search?' + searchParams);
				}
			}
		},
		[
			localState,
			location.pathname,
			nav,
			searchParams,
			selectedTagName,
			selectedTagOp,
			setSearchParams,
		],
	);

	const getHint = useCallback(
		async (q: string) => {
			const nameTagMode = selectedTagName && selectedTagOp;
			setHintLoading(true);
			setHints([]);
			const cnt = ++counter.current;
			const hints = await api()
				.post(
					`search/hint?${
						nameTagMode ? `nameTagType=${selectedTagName}&` : ''
					}q=${q}`,
				)
				.json<string[]>()
				.catch(r => console.log(r));
			setHintLoading(false);

			if (hints && cnt === counter.current) {
				counter.current = 0;
				setHints(hints);
			}
		},
		[selectedTagName, selectedTagOp],
	);

	const debouncedHint = useMemo(() => debounce(getHint, 100), [getHint]);

	return (
		<>
			<Flex
				pr={3}
				width={1}
				flexShrink={1}
				position="relative"
				overflow="visible"
				zIndex={2}
				ref={wrapperRef}
			>
				<TextInput
					placeholder={t('homepage:main_search_placeholder')}
					label=""
					labelType="inline"
					color="primary"
					value={localState}
					ref={mainInputRef}
					inputPadding="10px 8px"
					wrapperCss={css`
						border: 1px solid white !important;
					`}
					onChange={e => {
						setShowTagNameMenu(false);
						setShowTagOpMenu(false);
						setLocalState(e.target.value);
						debouncedHint(e.target.value);
					}}
					onKeyPress={e => {
						if (e.key === 'Enter' && localState !== '') {
							e.preventDefault();
							e.stopPropagation();
							handleUpdateContext();
						}
					}}
					onKeyDown={e => {
						if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
							e.stopPropagation();
							e.preventDefault();
							testRef.current?.focus();
						}
					}}
					onClick={() => {
						if (localState === '') {
							if (selectedTagName && !selectedTagOp) {
								setShowTagOpMenu(true);
								setShowTagNameMenu(false);
							}
							if (!selectedTagName) {
								setShowTagNameMenu(true);
								setShowTagOpMenu(false);
							}
						}
					}}
					iconLeft={
						<Flex color="textCommon" ml={2} alignItems="center">
							<MdSearch size={26} />
							<ClickAway onClickAway={() => setShowTagNameMenu(false)}>
								<SimpleSelect
									isExpanded={showTagNameMenu}
									value={selectedTagName}
									nameFromOption={item => (item ? localizeNameTag(item) : '')}
									options={fieldsTuple}
									onChange={field => {
										setShowTagNameMenu(false);
										setShowTagOpMenu(true);
										if (field) {
											setSelectedTagName(field);
										}
									}}
									keyFromOption={item => (item ? item : '')}
									renderMenuItem={(item, currentValue) => {
										if (!item) {
											return <></>;
										}
										const Icon = NameTagIcon[item];
										return (
											<Flex
												px={1}
												py={1}
												alignItems="center"
												color={item === currentValue ? 'primary' : 'unset'}
											>
												<Icon size={22} />
												<Text
													fontWeight={item === currentValue ? 'bold' : 'normal'}
													ml={2}
												>
													{localizeNameTag(item)}
												</Text>
											</Flex>
										);
									}}
									placeholder=""
									arrowHidden
									zIndex={5}
									menuFixedSize
									wrapperCss={css`
										z-index: 3;
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
										min-width: 200px;
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
											mainInputRef.current?.focus();
										}}
										keyFromOption={item =>
											item ? OperationToTextLabel[item] : ''
										}
										width={50}
										arrowHidden
										menuFixedSize
										nameFromOption={item =>
											item ? OperationToTextLabel[item] : ''
										}
										renderMenuItem={(item, currentValue) => {
											if (!item) {
												return <></>;
											}

											return (
												<Flex
													px={1}
													py={1}
													alignItems="center"
													color={item === currentValue ? 'primary' : 'unset'}
												>
													<Text
														fontWeight={
															item === currentValue ? 'bold' : 'normal'
														}
													>
														{OperationToTextLabel[item]}
													</Text>
													<Text ml={4}>{t(`nametag:${item}`)}</Text>
												</Flex>
											);
										}}
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
											font-size: 16px !important;
										`}
									/>
								</ClickAway>
							)}
						</Flex>
					}
					iconRight={
						hintLoading ? (
							<Flex mr={3} color="primary">
								<LoaderSpin
									size={24}
									css={css`
										padding: 0 !important;
									`}
								/>
							</Flex>
						) : (
							<>
								{localState !== '' || selectedTagName || selectedTagOp ? (
									<Flex mr={3} color="primary">
										<MdClear
											onClick={() => {
												setLocalState('');
												setSelectedTagName(null);
												setSelectedTagOp(null);
											}}
											css={css`
												cursor: pointer;
											`}
										/>
									</Flex>
								) : (
									<></>
								)}
							</>
						)
					}
				/>
				<div style={{ position: 'absolute', left: '-1000px', opacity: 0 }}>
					<input
						width={0}
						height={0}
						ref={testRef}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								e.stopPropagation();
								setLocalState(hints[hh]);
								handleUpdateContext(hints[hh]);
								setHh(0);
								setHints([]);
							}
						}}
						onKeyDown={e => {
							if (e.key === 'Escape') {
								e.preventDefault();
								e.stopPropagation();
								mainInputRef.current?.focus();
								setHh(0);
								setHints([]);
							}
							if (e.key === 'ArrowDown') {
								e.stopPropagation();
								setHh(p => (p + 1) % hints.length);
							}
							if (e.key === 'ArrowUp') {
								e.stopPropagation();
								setHh(p => {
									if (p <= 0) {
										return hints.length - 1;
									} else {
										return p - 1;
									}
								});
							}
						}}
					/>
				</div>

				{hints.length > 0 &&
					localState !== '' &&
					(!showTagNameMenu || !showTagOpMenu) && (
						<ClickAway onClickAway={() => setHints([])}>
							<Flex
								position="absolute"
								left={0}
								top={41}
								bg="white"
								color="text"
								css={css`
									border: 1px solid ${theme.colors.border};
									border-top: none;
									/* box-shadow: 0px 5px 8px 2px rgba(0, 0, 0, 0.2); */
									box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
								`}
							>
								<Flex
									position="relative"
									flexDirection="column"
									overflowY="auto"
									maxHeight="80vh"
									width={wrapperWidth - 16}
								>
									{hints.map((h, index) => {
										const hintWords = (h ?? '').split(' ');
										const query = localState;

										const result = hintWords.map(hw => ({
											highlight:
												hw.length > 2 &&
												query
													?.toLocaleUpperCase()
													?.includes(hw.toLocaleUpperCase()),
											word: hw + ' ',
										}));
										return (
											<Flex
												px={3}
												py={1}
												key={index}
												onClick={() => {
													setLocalState(h);
													handleUpdateContext(h);
													setHints([]);
												}}
												bg={index === hh ? 'primaryBright' : 'initial'}
												css={css`
													cursor: default;
													border-bottom: 1px solid ${theme.colors.primaryLight};
													&:hover {
														background-color: ${theme.colors.primaryBright};
													}
												`}
											>
												<Text fontSize="md" my="2px">
													{result.map(w =>
														w.highlight ? (
															<Text as="span" color="primary" fontWeight="bold">
																{w.word}
															</Text>
														) : (
															<>{w.word}</>
														),
													)}
												</Text>
											</Flex>
										);
									})}
								</Flex>
							</Flex>
						</ClickAway>
					)}
			</Flex>
			<Flex flexShrink={0}>
				<Button
					width={80}
					minWidth={80}
					variant="primary"
					py={2}
					px={0}
					mr={[2, 2, 2, 0]}
					onClick={() => localState !== '' && handleUpdateContext()}
					css={css`
						box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.12);
					`}
					//disabled={localState === ''}
				>
					{t('search:main_button')}
				</Button>
			</Flex>
		</>
	);
};
export default MainSearchInput;
