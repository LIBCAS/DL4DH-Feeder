/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import SimpleSelect from 'components/form/select/SimpleSelect';

import { useSearchContext } from 'hooks/useSearchContext';

const filterOperation = [
	{ label: '=', id: 'eq' },
	{ label: '!=', id: 'neq' },
	{ label: '<', id: 'gt' },
];

const filterField = [
	{ label: 'Autor', id: 'author' },
	{ label: 'Titul', id: 'title' },
	{ label: 'Caption', id: 'longer' },
];

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();

	return (
		<>
			<TextInput
				placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
				label=""
				labelType="inline"
				color="primary"
				value={state.searchQuery}
				iconLeft={
					<Flex color="primary" ml={2} alignItems="center">
						<MdSearch size={26} />
						<SimpleSelect
							value={filterOperation[0]}
							options={filterOperation}
							onChange={() => null}
							keyFromOption={item => item?.id ?? ''}
							width={50}
							nameFromOption={item => (item !== null ? item.label : '')}
							wrapperCss={css`
								border: none;
							`}
						/>
						<SimpleSelect
							value={filterField[2]}
							options={filterField}
							onChange={() => null}
							keyFromOption={item => item?.id ?? ''}
							width={100}
							nameFromOption={item => (item !== null ? item.label : '')}
							wrapperCss={css`
								border: none;
							`}
						/>
					</Flex>
				}
				iconRight={
					state.searchQuery !== '' ? (
						<Flex mr={3} color="primary">
							<MdClear
								onClick={() =>
									dispatch?.({ type: 'setSearchQuery', searchQuery: '' })
								}
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
					dispatch?.({
						type: 'setSearchQuery',
						searchQuery: e.currentTarget.value,
					});
				}}
			/>
		</>
	);
};
export default MainSearchInput;
