/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from '@emotion/react';
import { MdSearch, MdClear } from 'react-icons/md';
import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useMemo,
	useRef,
	useState,
} from 'react';
import { debounce } from 'lodash-es';
import useMeasure from 'react-use-measure';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import { ClickAway } from 'components/form/select/SimpleSelect';
import Checkbox from 'components/form/checkbox/Checkbox';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { useTheme } from 'theme';
import { api } from 'api';

import { TOperation } from 'hooks/useSearchContext';

export const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

type Props = {
	hintApi?: (q: string) => Promise<string[]>;
	onQueryUpdate: (query: string) => void;
	onQuerySubmit?: () => void;
	onQueryClear?: () => void;
	publicOnly?: boolean;
	setPublicOnly?: Dispatch<SetStateAction<boolean>>;
	placeholder?: string;
	urlKeyOfValue?: string;
	AdditionalLeftJSX?: JSX.Element;
	initialQuery?: string;
	value?: string;
	externalState?: boolean;
	customWrapperCss?: SerializedStyles;
};

const QuerySearchInput: FC<Props> = ({
	publicOnly,
	setPublicOnly,
	onQueryUpdate,
	hintApi,
	placeholder,
	urlKeyOfValue,
	onQueryClear,
	AdditionalLeftJSX,
	initialQuery,
	value,
	externalState,
	customWrapperCss,
	onQuerySubmit,
}) => {
	const theme = useTheme();
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});
	const mainInputRef = useRef<HTMLInputElement | null>(null);
	const keysNavigatorRef = useRef<HTMLInputElement | null>(null);
	const [hh, setHh] = useState(-1);
	const { t } = useTranslation();
	const [sp] = useSearchParams();
	const counter = useRef(0);
	const [localState, setLocalState] = useState(
		urlKeyOfValue ? sp.get(urlKeyOfValue) ?? '' : initialQuery ?? '',
	);

	const [hintLoading, setHintLoading] = useState(false);

	const query = externalState ? value : localState;

	const [hints, setHints] = useState<string[]>([]);

	const handleUpdateContext = onQueryUpdate;

	const getHint = useCallback(
		async (q: string) => {
			if (!q) {
				return;
			}
			setHintLoading(true);
			setHints([]);
			const cnt = ++counter.current;
			const fhints = hintApi
				? await hintApi(q).catch(r => console.log(r))
				: await api()
						.post(`search/hint?q=${q}`, {
							body: JSON.stringify({
								availability: publicOnly ? 'PUBLIC' : 'ALL',
							}),
						})
						.json<string[]>()
						.catch(r => console.log(r));
			setHintLoading(false);

			if (fhints && cnt === counter.current) {
				counter.current = 0;
				setHints(fhints);
				setHh(-1);
			}
		},
		[hintApi, publicOnly],
	);

	const debouncedHint = useMemo(() => debounce(getHint, 50), [getHint]);

	return (
		<>
			<Flex
				width={1}
				position="relative"
				overflow="visible"
				zIndex={2}
				ref={wrapperRef}
			>
				<TextInput
					placeholder={
						placeholder ? placeholder : t('homepage:hp_search_placeholder')
					}
					label=""
					labelType="inline"
					color="primary"
					value={query}
					ref={mainInputRef}
					onChange={e => {
						setLocalState(e.target.value);
						debouncedHint(e.target.value);
						if (externalState) {
							handleUpdateContext(e.target.value);
						}
					}}
					onKeyPress={e => {
						if (e.key === 'Enter' && query !== '') {
							e.preventDefault();
							e.stopPropagation();
							handleUpdateContext(query ?? '');
							onQuerySubmit?.();
						}
					}}
					onKeyDown={e => {
						if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
							e.stopPropagation();
							e.preventDefault();
							if (e.key === 'ArrowDown') {
								setHh(0);
							} else {
								setHh(hints.length - 1);
							}

							keysNavigatorRef.current?.focus();
						}
					}}
					iconLeft={
						<Flex color="textCommon" ml={2} alignItems="center">
							<MdSearch size={26} />
							{AdditionalLeftJSX && AdditionalLeftJSX}
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
								{query !== '' ? (
									<Flex mr={3} color="primary">
										<MdClear
											onClick={() => {
												setLocalState('');
												onQueryClear?.();
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
					wrapperCss={
						customWrapperCss
							? customWrapperCss
							: css`
									border-top: none;
									border-left: none;
									border-right: none;
							  `
					}
				/>
				<div style={{ position: 'absolute', left: '-1000px', opacity: 0 }}>
					<input
						width={0}
						height={0}
						ref={keysNavigatorRef}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								e.stopPropagation();
								setLocalState(hints[hh]);
								handleUpdateContext(hints[hh]);
								setHh(-1);
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
								if (hh < hints.length - 1) {
									setHh(p => p + 1);
								}
								if (hh === hints.length - 1) {
									mainInputRef.current?.focus?.();
									setHh(-1);
								}
							}
							if (e.key === 'ArrowUp') {
								e.stopPropagation();
								setHh(p => {
									if (p <= 0) {
										mainInputRef.current?.focus?.();
										return -1;
									} else {
										return p - 1;
									}
								});
							}
						}}
					/>
				</div>

				{hints.length > 0 && query !== '' && (
					<ClickAway onClickAway={() => setHints([])}>
						<Flex
							position="absolute"
							left={-1}
							top={43}
							bg="white"
							color="text"
							css={css`
								border: 1px solid ${theme.colors.border};
								&:focus {
									border: 1px solid ${theme.colors.border};
								}
								border-top: none;
								/* box-shadow: 0px 5px 4px 2px rgba(0, 0, 0, 0.2); */
								box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
							`}
						>
							<Flex
								position="relative"
								flexDirection="column"
								overflowY="auto"
								maxHeight="80vh"
								width={wrapperWidth}
							>
								{hints.map((h, index) => {
									const qindex = h
										.toLocaleUpperCase()
										.indexOf(query?.toUpperCase() ?? '');

									const qEnd = qindex + (query?.length ?? 0);
									const part1 = h.slice(0, qindex);
									const part2 = h.slice(qindex, qEnd);
									const part3 = h.slice(qEnd);
									//TODO: fixnut, nefunguje ked nie su pri sebe najdene vyrazy
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
											//color={index === hh ? 'white' : 'initial'}
											css={css`
												cursor: default;
												border-bottom: 1px solid ${theme.colors.primaryLight};
												&:hover {
													background-color: ${theme.colors.primaryBright};
												}
											`}
										>
											<Text fontSize="md" my="2px">
												{part1}
												<Text as="span" color="primary" fontWeight="bold">
													{part2}
												</Text>
												{part3}
											</Text>
										</Flex>
									);
								})}
							</Flex>
						</Flex>
					</ClickAway>
				)}
				{setPublicOnly && (
					<Flex alignItems="center" minWidth={105} ml={[0, 3]} mt={[3, 0]}>
						<Checkbox
							checked={publicOnly}
							onChange={() => setPublicOnly(p => !p)}
							aria-label={t('homepage:public_only')}
							label={t('homepage:public_only')}
						/>
					</Flex>
				)}
			</Flex>
		</>
	);
};
export default QuerySearchInput;
