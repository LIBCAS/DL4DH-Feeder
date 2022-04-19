/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdCalendarToday, MdPerson } from 'react-icons/md';

import TileGrid from 'components/tiles';
import { Box, Dot, Flex } from 'components/styled';
import AspectRatio from 'components/styled/AspectRatio';
import { Wrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { theme } from 'theme';
import { getDateString } from 'utils';

import placeholder from 'assets/title_placeholder.png';

import { TPublication } from 'api/models';

type Props = {
	data?: TPublication[];
};

const TileView: FC<Props> = ({ data }) => {
	return (
		<Wrapper p={2}>
			<TileGrid tileSize="350px" isEmpty={data === undefined}>
				{(data ?? []).map(d => (
					<AspectRatio key={d.id} ratio={[2.5, 1]} width="100%">
						<Flex height="100%" bg="primaryLight" p={2}>
							<Flex
								minWidth="100px"
								bg="white"
								justifyContent="center"
								alignItems="center"
							>
								<img src={placeholder} height={30} />
							</Flex>
							<Flex flexDirection="column" pl={2} width={1}>
								<Text fontSize="lg" fontFamily="RobotoCondensed-bold">
									{d.title}
								</Text>
								<Flex fontSize="sm" mt={2}>
									<Flex alignItems="center">
										<MdPerson color="primary" />
										<Text ml={2}>{d.author}</Text>
									</Flex>
									<Flex alignItems="center" ml={3}>
										<MdCalendarToday color="primary" />
										<Text ml={2}>{getDateString(d.published)}</Text>
									</Flex>
								</Flex>
								<Flex fontSize="sm" mt={2}>
									<Flex alignItems="center">
										<Dot color="primary" size={3} />
										<Text ml={2}>{d.meta1}</Text>
									</Flex>
									<Flex alignItems="center" ml={2}>
										<Dot color="primary" size={3} />
										<Text ml={2}>{d.meta2}</Text>
									</Flex>
								</Flex>
								<Flex fontSize="sm" mt={2}>
									<Flex alignItems="center">
										<Dot color="primary" size={3} />
										<Text ml={2}>{d.meta3}</Text>
									</Flex>
									<Flex alignItems="center" ml={2}>
										<Dot color="primary" size={3} />
										<Text ml={2}>{d.meta1}</Text>
									</Flex>
								</Flex>
								<Flex flexGrow={1} />
								<Flex justifyContent="flex-end" alignItems="flex-end" width={1}>
									<Flex bg="primary" color="white" opacity="0.5">
										<Text py={1} my={0} px={3} fontSize="sm">
											Tag
										</Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</AspectRatio>
				))}
			</TileGrid>
		</Wrapper>
	);
};

export default TileView;
