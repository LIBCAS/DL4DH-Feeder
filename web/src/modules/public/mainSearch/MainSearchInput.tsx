/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { stringify } from 'query-string';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect from 'components/form/select/SimpleSelect';
import Button from 'components/styled/Button';

import {
	fieldsTuple,
	operationsTuple,
	TField,
	TOperation,
	useSearchContext,
} from 'hooks/useSearchContext';

const OperationToTextLabel: Record<TOperation, string> = {
	eq: '=',
	neq: '!=',
	gt: '<',
};

const FieldToTextLabel: Record<TField, string> = {
	author: 'Autor',
	keyword: 'Klucove slovo',
	title: 'Titul',
};

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();
	const { push } = useHistory();
	const [localState, setLocalState] = useState('');
	useEffect(() => {
		setLocalState(state.searchQuery?.q ?? '');
	}, [state.searchQuery]);

	const handleUpdateContext = () => {
		const url = stringify({ ...state.searchQuery, q: localState });
		push(`/search?${url}`);
	};
	console.log(state);
	return (
		<>
			<Flex pr={3} width={1} flexShrink={1}>
				<TextInput
					placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
					label=""
					labelType="inline"
					color="primary"
					value={localState}
					onChange={e => setLocalState(e.target.value)}
					iconLeft={
						<Flex color="primary" ml={2} alignItems="center">
							<MdSearch size={26} />

							<SimpleSelect
								value={state.searchQuery?.field}
								options={fieldsTuple}
								onChange={field =>
									dispatch?.({
										type: 'setSearchQuery',
										searchQuery: { ...state.searchQuery, field },
									})
								}
								keyFromOption={item => (item ? FieldToTextLabel[item] : '')}
								width={100}
								nameFromOption={item => (item ? FieldToTextLabel[item] : '')}
								wrapperCss={css`
									border: none;
								`}
							/>
							<SimpleSelect
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
								nameFromOption={item =>
									item ? OperationToTextLabel[item] : ''
								}
								wrapperCss={css`
									border: none;
								`}
							/>
						</Flex>
					}
					iconRight={
						localState !== '' ? (
							<Flex mr={3} color="primary">
								<MdClear
									onClick={() => {
										dispatch?.({ type: 'setSearchQuery', searchQuery: null });
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
			</Flex>
			<Flex flexShrink={0}>
				<Button
					width={150}
					variant="primary"
					py={2}
					mr={[2, 2, 2, 0]}
					onClick={handleUpdateContext}
					disabled={localState === ''}
				>
					Hledat v K+
				</Button>
			</Flex>
		</>
	);
};
export default MainSearchInput;
