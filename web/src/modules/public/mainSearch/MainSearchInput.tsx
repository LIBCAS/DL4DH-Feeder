/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdSearch, MdClear } from 'react-icons/md';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';

import { useSearchContext } from 'hooks/useSearchContext';

const MainSearchInput = () => {
	const { state, dispatch } = useSearchContext();

	return (
		<TextInput
			placeholder="Vyhledejte v DL4DH Feeder (základ slova nebo filtrujte výsledky)..."
			label=""
			labelType="inline"
			color="primary"
			value={state.searchQuery}
			iconLeft={
				<Flex color="primary" ml={2}>
					<MdSearch size={26} />
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
	);
};
export default MainSearchInput;
