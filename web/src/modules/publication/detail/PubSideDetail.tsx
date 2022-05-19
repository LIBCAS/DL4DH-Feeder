/** @jsxImportSource @emotion/react */

import { FC } from 'react';
import { MdDownload, MdPrint, MdShare, MdTextFields } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';

type Props = {
	nic?: boolean;
};

const PubSideDetail: FC<Props> = () => {
	return (
		<Box width={1}>
			<Flex
				my={3}
				color="primary"
				justifyContent="space-between"
				alignItems="center"
				px={3}
			>
				<IconButton color="primary">
					<MdPrint size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdDownload size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdTextFields size={24} />
				</IconButton>
				<IconButton color="primary">
					<MdShare size={24} />
				</IconButton>
			</Flex>
			<Divider />
			<Flex p={3}>
				<Text>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam,
					eum!
				</Text>
			</Flex>
			<Divider />
			<Flex p={3}>
				<Text>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam,
					eum!
				</Text>
			</Flex>
			<Divider />
			<Flex p={3}>
				<Text>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam,
					eum!
				</Text>
			</Flex>
		</Box>
	);
};

export default PubSideDetail;
