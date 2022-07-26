/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import TileGrid from 'components/tiles';
import { Flex } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';
import Text from 'components/styled/Text';

import { theme } from 'theme';

import { PublicationChild } from 'api/models';

type Props = {
	data?: PublicationChild[];
};

const PeriodicalTiles: FC<Props> = ({ data }) => {
	const push = useNavigate();

	return (
		<Wrapper p={2}>
			<TileGrid tileSize="90px" isEmpty={data === undefined || data.length < 1}>
				{(data ?? []).map(d => {
					const isPeriodical = d.model.includes('periodical');
					const url = `/${isPeriodical ? 'periodical' : 'view'}/${d.pid}`;
					return (
						<a
							key={d.pid}
							href={url}
							onClick={e => {
								e.preventDefault();
								push(url);
							}}
							css={css`
								text-decoration: none;
							`}
						>
							<Flex
								bg={d.enriched ? 'enriched' : 'white'}
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
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
									fontSize="md"
									color="primary"
									flexDirection="column"
									alignItems="center"
								>
									<Text mb={2} color="primary" fontWeight="bold">
										{d.details.year}
									</Text>

									{/* {d.details.partNumber && (
										<Text mb={2} color="primary" fontWeight="bold">
											{d.details.partNumber}
										</Text>
									)} */}
									{d.details.title && (
										<Text mb={2} color="primary" fontWeight="bold">
											{d.details.title}
										</Text>
									)}
								</Flex>
								<Flex
									width="95px"
									height={140}
									justifyContent="center"
									alignItems="center"
									color="text"
									position="relative"
									p={1}
									css={css`
										border: 1px solid ${theme.colors.border};
										background-image: url(${`api/item/${d.pid}/thumb`});
										background-repeat: no-repeat;
										background-size: cover;
									`}
								>
									{d.policy === 'private' && (
										<Flex
											position="absolute"
											width="100%"
											height="100%"
											justifyContent="center"
											alignItems="center"
										>
											<Flex
												justifyContent="center"
												alignItems="center"
												position="relative"
												width="80px"
												height="80px"
												opacity={0.7}
												bg="white"
												css={css`
													border: 1px solid white;
													border-radius: 100%;
												`}
											>
												<MdLock size={50} />
											</Flex>
										</Flex>
									)}
								</Flex>
								<Flex
									flexDirection="column"
									width={1}
									alignItems="center"
									color={d.enriched ? 'black' : 'textCommon'}
								>
									{d.details.volumeNumber !== undefined && (
										<Text
											css={css`
												text-overflow: ellipsis;
												overflow: hidden;
												white-space: nowrap;
											`}
										>
											Ročník {d.details.volumeNumber}
										</Text>
									)}
									{d.details.partNumber !== null && (
										<Text
											css={css`
												text-overflow: ellipsis;
												overflow: hidden;
												white-space: nowrap;
											`}
										>
											{d.details.partNumber}
										</Text>
									)}
								</Flex>
							</Flex>
						</a>
					);
				})}
			</TileGrid>
		</Wrapper>
	);
};

export default PeriodicalTiles;
