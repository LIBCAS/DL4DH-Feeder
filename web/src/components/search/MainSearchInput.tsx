/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { debounce, isEqual } from 'lodash-es';
import useMeasure from 'react-use-measure';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';
import Button from 'components/styled/Button';

import { useTheme } from 'theme';
import { api } from 'api';

import { NameTagCode, OperationCode, TagNameEnum } from 'api/models';

import {
	fieldsTuple,
	operationsTuple,
	TOperation,
	useSearchContext,
} from 'hooks/useSearchContext';
import useSanitizeSearchQuery from 'hooks/useSanitizeSearchQuery';

import { NameTagToText } from 'utils/enumsMap';

export const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();
	const theme = useTheme();
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});
	const mainInputRef = useRef<HTMLInputElement | null>(null);
	const testRef = useRef<HTMLInputElement | null>(null);
	const [hh, setHh] = useState(0);

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
	const nav = useNavigate();
	const location = useLocation();

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
				//TODO: FIXME: ked je uzivatel na inej stranke nez search, poriesit aby sa dodali spravne search params
				if (!location.pathname.includes('/search?')) {
					nav('/search?' + searchParams);
				}
			} else {
				searchParams.set('query', newState ?? localState);
				setLocalState('');
				setSelectedTagName(null);
				setSelectedTagOp(null);
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

	const { search } = useLocation();
	const parsed = useSanitizeSearchQuery(search);

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
					placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
					label=""
					labelType="inline"
					color="primary"
					value={localState}
					ref={mainInputRef}
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
									options={fieldsTuple}
									onChange={field => {
										setShowTagNameMenu(false);
										setShowTagOpMenu(true);
										if (field) {
											setSelectedTagName(field);
										}
									}}
									keyFromOption={item => (item ? item : '')}
									nameFromOption={item => (item ? NameTagToText[item] : '')}
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
											console.log({ ss: 'defocusing' });
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
								top={45}
								bg="white"
								color="text"
								css={css`
									border: 1px solid ${theme.colors.border};
									border-top: none;
									box-shadow: 0px 5px 8px 2px rgba(0, 0, 0, 0.2);
								`}
							>
								<Flex
									position="relative"
									flexDirection="column"
									overflowY="auto"
									maxHeight="80vh"
									width={wrapperWidth - 16}
								>
									{hints.map((h, index) => (
										<Flex
											px={3}
											py={1}
											key={index}
											onClick={() => {
												setLocalState(h);
												handleUpdateContext(h);
												setHints([]);
											}}
											bg={index === hh ? 'primary' : 'initial'}
											color={index === hh ? 'white' : 'initial'}
											css={css`
												cursor: default;
												border-bottom: 1px solid ${theme.colors.primaryLight};
												&:hover {
													color: white;
													background-color: ${theme.colors.primary};
												}
											`}
										>
											<Text fontSize="md">{h}</Text>
										</Flex>
									))}
								</Flex>
							</Flex>
						</ClickAway>
					)}
			</Flex>
			<Flex flexShrink={0}>
				<Button
					width={120}
					variant="primary"
					py={2}
					mr={[2, 2, 2, 0]}
					onClick={() => localState !== '' && handleUpdateContext()}
					css={css`
						box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.15);
					`}
					//disabled={localState === ''}
				>
					Hledat v K+
				</Button>
			</Flex>
		</>
	);
};
export default MainSearchInput;
