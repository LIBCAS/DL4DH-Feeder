/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import useMeasure from 'react-use-measure';

import Text from 'components/styled/Text';
import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import { ClickAway } from 'components/form/select/SimpleSelect';

import { useTheme } from 'theme';
import { api } from 'api';

import { TOperation } from 'hooks/useSearchContext';

export const OperationToTextLabel: Record<TOperation, string> = {
	EQUAL: '=',
	NOT_EQUAL: '\u{2260}',
};

type Props = {
	hintApi?: string;
	onQueryUpdate: (query: string) => void;
};

const QuerySearchInput: FC<Props> = ({ onQueryUpdate }) => {
	const theme = useTheme();
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});
	const mainInputRef = useRef<HTMLInputElement | null>(null);
	const testRef = useRef<HTMLInputElement | null>(null);
	const [hh, setHh] = useState(0);

	const [localState, setLocalState] = useState('');

	const [hints, setHints] = useState<string[]>([]);

	const handleUpdateContext = onQueryUpdate;

	const getHint = useCallback(async (q: string) => {
		const hints = await api()
			.post(`search/hint?q=${q}`)
			.json<string[]>()
			.catch(r => console.log(r));

		if (hints) {
			setHints(hints);
		}
	}, []);

	const debouncedHint = useMemo(() => debounce(getHint, 100), [getHint]);

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
					placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
					label=""
					labelType="inline"
					color="primary"
					value={localState}
					ref={mainInputRef}
					onChange={e => {
						setLocalState(e.target.value);
						debouncedHint(e.target.value);
					}}
					onKeyPress={e => {
						if (e.key === 'Enter' && localState !== '') {
							e.preventDefault();
							e.stopPropagation();
							handleUpdateContext(localState);
						}
					}}
					onKeyDown={e => {
						if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
							e.stopPropagation();
							e.preventDefault();
							testRef.current?.focus();
						}
					}}
					iconLeft={
						<Flex color="textCommon" ml={2} alignItems="center">
							<MdSearch size={26} />
						</Flex>
					}
					iconRight={
						localState !== '' ? (
							<Flex mr={3} color="primary">
								<MdClear
									onClick={() => {
										setLocalState('');
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

				{hints.length > 0 && localState !== '' && (
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
		</>
	);
};
export default QuerySearchInput;
