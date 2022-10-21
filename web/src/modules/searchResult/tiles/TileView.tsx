/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/core';
import { FC, ReactNode } from 'react';
import { MdCalendarToday, MdLock, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled/macro';

import TileGrid from 'components/tiles';
import { Flex } from 'components/styled';
import AspectRatio from 'components/styled/AspectRatio';
import { Wrapper } from 'components/styled/Wrapper';
import Text, { H3 } from 'components/styled/Text';

import { updateVisited } from 'modules/public/homepage/homepageFeeds/VisitedHomepageFeed';

import { theme } from 'theme';

import { ModelsEnum, PublicationDto } from 'api/models';

import { modelToText, modelToColor } from 'utils/enumsMap';

export const PubModelTagBadge: FC<{ model: ModelsEnum }> = ({ model }) => {
	const color = modelToColor(model);
	return (
		<Flex bg={color} color="white">
			<Text py={1} my={0} px={3} fontSize="sm">
				{modelToText(model)}
			</Text>
		</Flex>
	);
};

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

type Props = {
	data?: PublicationDto[];
	tileWrapperCss?: (uuid: string) => SerializedStyles;
	onSelect?: (uuid: string) => void;
	noResultsMsg?: string | ReactNode;
};

const TileView: FC<Props> = ({
	data,
	tileWrapperCss,
	onSelect,
	noResultsMsg,
}) => {
	const push = useNavigate();

	return (
		<Wrapper p={2}>
			<TileGrid
				tileSize="300px"
				isEmpty={data === undefined || data.length < 1}
				noResults={noResultsMsg}
			>
				{(data ?? []).map(d => {
					const isPeriodical = d.model.includes('periodical');
					const url = `/${isPeriodical ? 'periodical' : 'view'}/${d.pid}`;
					return (
						<AspectRatio
							key={d.pid}
							as="a"
							ratio={[2.5, 1]}
							width="100%"
							onClick={e => {
								e.preventDefault();
								if (onSelect) {
									onSelect(d.pid);
								} else {
									push(url);
								}
							}}
						>
							<a
								href={url}
								onClick={e => {
									e.preventDefault();
									updateVisited(d);
								}}
								css={css`
									text-decoration: none;
								`}
							>
								<Flex
									bg="white"
									position="relative"
									height="100%"
									p={2}
									css={css`
										border: 1px solid ${theme.colors.border};
										&:hover {
											box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
											cursor: pointer;
										}
										${tileWrapperCss?.(d.pid) ?? ``}
									`}
								>
									{d.enriched && (
										<Flex
											bg="#E4F0F3"
											css={css`
												border: 1px solid #0389a74f;
												position: absolute;
												width: 100%;
												height: 39px;
												margin-left: -9px;
												margin-top: 1px;
												bottom: 0;
											`}
										/>
									)}
									<Flex
										minWidth="80px"
										//bg="white"
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
										{(d.availability === 'private' ||
											d.policy === 'private') && (
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
										pl={2}
										width={1}
										color={d.enriched ? 'black' : 'text'}
									>
										<H3
											css={css`
												text-overflow: ellipsis;
												overflow: hidden;
												white-space: nowrap;
											`}
										>
											{d.title}
										</H3>

										<Flex
											fontSize="sm"
											mt={2}
											flexDirection="column"
											color="textCommon"
										>
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
													{/* {getDateString(d?.published ?? d.date)} */}
													{d.date}
												</Text>
											</Flex>
										</Flex>

										<Flex flexGrow={1} />

										<Flex
											justifyContent="flex-end"
											alignItems="flex-end"
											width={1}
											//bg="red"
											position="relative"
										>
											{d.enriched && (
												<Flex bg="primary" color="white" opacity="0.8" mr={2}>
													<Text py={1} my={0} px={3} fontSize="sm">
														Obohacená
													</Text>
												</Flex>
											)}
											<PubModelTagBadge model={d.model} />
										</Flex>
									</Flex>
								</Flex>
							</a>
						</AspectRatio>
					);
				})}
			</TileGrid>
		</Wrapper>
	);
};

export default TileView;
