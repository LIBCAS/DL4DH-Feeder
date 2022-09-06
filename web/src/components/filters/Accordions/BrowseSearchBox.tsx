/** @jsxImportSource @emotion/react */
import { FC, useState } from 'react';
import { css } from '@emotion/core';
import { MdClear, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import TextInput from 'components/form/input/TextInput';
import { Flex } from 'components/styled';
import IconButton from 'components/styled/IconButton';

import { useTheme } from 'theme';

type Props = {
	isLoading?: boolean;
};

const BrowseSearchBox: FC<Props> = ({ isLoading }) => {
	const [sp, setSp] = useSearchParams();
	const [query, setQuery] = useState(sp.get('bq') ?? '');

	const theme = useTheme();

	return (
		<>
			<Flex
				p={3}
				css={css`
					border-bottom: 1px solid ${theme.colors.border};
				`}
			>
				<TextInput
					loading={isLoading}
					p={'0px!important'}
					inputPadding="8px 0px"
					label=""
					labelType="inline"
					labelMinWidth="30px"
					autoComplete="off"
					value={query}
					onChange={e => setQuery(e.target.value)}
					onKeyDown={e => {
						e.stopPropagation();
						if (e.key === 'Enter') {
							sp.set('bq', query);
							setSp(sp);
						}
					}}
					iconLeft={
						<Flex p={0} m={0} ml={1}>
							<MdSearch size={24} />
						</Flex>
					}
					iconRight={
						query !== '' ? (
							<Flex color="primary" mr={1}>
								<IconButton
									color="primary"
									tooltip="Smazat filtr"
									onClick={() => {
										sp.delete('bq');
										setSp(sp);
										setQuery('');
									}}
								>
									<MdClear
										size={24}
										css={css`
											cursor: pointer;
										`}
									/>
								</IconButton>
							</Flex>
						) : (
							<></>
						)
					}
				></TextInput>
			</Flex>
		</>
	);
};

export default BrowseSearchBox;
