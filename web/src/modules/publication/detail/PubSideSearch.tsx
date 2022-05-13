/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';
import TextInput from 'components/form/input/TextInput';

import { useTheme } from 'theme';

type Props = {
	nic?: boolean;
};

const testPubs = Array.from(Array(20).keys());

const PubSideSearch: FC<Props> = () => {
	const [toSearch, setToSearch] = useState('');
	const [selected, setSelected] = useState(1);
	const theme = useTheme();
	return (
		<Box width={1}>
			<Flex p={3}>
				<Text>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam,
					eum!
				</Text>
			</Flex>
			<Divider />
			<Flex p={3}>
				<TextInput
					placeholder="Vyhledávat v publikaci"
					label=""
					labelType="inline"
					color="primary"
					value={toSearch}
					iconLeft={
						<Flex color="primary" ml={2}>
							<MdSearch size={26} />
						</Flex>
					}
					iconRight={
						toSearch !== '' ? (
							<Flex mr={3} color="primary">
								<MdClear
									onClick={() => setToSearch('')}
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
						setToSearch(e.currentTarget.value);
					}}
				/>
			</Flex>
			<Divider />
			<Flex p={2} flexWrap="wrap">
				{testPubs.map(p => (
					<Box
						key={p}
						width={80}
						height={120}
						bg="darkerGrey"
						m={1}
						position="relative"
						css={css`
							border: ${selected === p ? 5 : 1}px solid ${theme.colors.primary};
							box-sizing: border-box;
							cursor: pointer;
							background-image: url('pubtest.jpg');
							background-size: contain;
							&:hover {
								box-shadow: 0 0px 3px 3px rgba(0, 0, 0, 0.2);
							}
						`}
						onClick={() => setSelected(p)}
					>
						<Box
							position="absolute"
							right={0}
							top={0}
							bg="white"
							color="text"
							opacity={0.7}
							p={1}
						>
							<Text my={0} fontSize="sm">
								{p}
							</Text>
						</Box>
					</Box>
				))}
			</Flex>
		</Box>
	);
};

export default PubSideSearch;
