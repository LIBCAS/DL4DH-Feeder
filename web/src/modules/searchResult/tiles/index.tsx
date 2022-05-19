/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdCalendarToday, MdImage, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled/macro';

import TileGrid from 'components/tiles';
import { Dot, Flex } from 'components/styled';
import AspectRatio from 'components/styled/AspectRatio';
import { Wrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { theme } from 'theme';

import { TPublication } from 'api/models';

import { modelToText } from 'utils/enumsMap';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

type Props = {
	data?: TPublication[];
};

const TileView: FC<Props> = ({ data }) => {
	const push = useNavigate();

	return (
		<Wrapper p={2}>
			<TileGrid
				tileSize="350px"
				isEmpty={data === undefined || data.length < 1}
			>
				{(data ?? []).map(d => (
					<AspectRatio
						key={d.pid}
						ratio={[2.5, 1]}
						width="100%"
						onClick={() => push(`/view/${d.pid}`)}
					>
						<Flex
							height="100%"
							bg="primaryLight"
							p={2}
							css={css`
								border: 1px solid ${theme.colors.border};
								&:hover {
									box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
									cursor: pointer;
								}
							`}
						>
							<Flex
								minWidth="80px"
								//bg="white"
								justifyContent="center"
								alignItems="center"
								color="text"
								p={1}
								css={css`
									border: 1px solid ${theme.colors.border};
									background-image: url(${`api/item/${d.pid}/thumb`});
								`}
							>
								{/* <MdImage size={30} /> */}
							</Flex>
							<Flex flexDirection="column" pl={2} width={1}>
								<Cell fontSize="lg" fontFamily="RobotoCondensed-bold">
									{d.rootTitle}
								</Cell>

								<Flex fontSize="sm" mt={2} flexDirection="column">
									<Flex alignItems="center">
										<MdPerson color="primary" />
										{'  '}
										<Cell>
											{typeof d.authors === 'object'
												? d.authors.map(a => a)
												: d.authors}
										</Cell>
									</Flex>
									<Flex alignItems="center">
										<MdCalendarToday color="primary" />
										<Text ml={2}>
											{/* {getDateString(d?.published ?? d.date )} */}
											{d.date}
										</Text>
									</Flex>
								</Flex>
								{/* <Flex fontSize="sm" mt={2}>
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
								</Flex> */}
								<Flex flexGrow={1} />
								<Flex justifyContent="flex-end" alignItems="flex-end" width={1}>
									<Flex bg="primary" color="white" opacity="0.5">
										<Text py={1} my={0} px={3} fontSize="sm">
											{modelToText(d.model)}
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
