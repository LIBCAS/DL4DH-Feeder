/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/core';
import { FC } from 'react';
import { MdCalendarToday, MdLock, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled/macro';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import AspectRatio from 'components/styled/AspectRatio';
import Text, { H3 } from 'components/styled/Text';

import { updateVisited } from 'modules/public/homepage/homepageFeeds/VisitedHomepageFeed';

import { theme } from 'theme';

import { ModelsEnum, PublicationDto } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

import { modelToText, modelToColor } from 'utils/enumsMap';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

export const PubModelTagBadge: FC<{ model: ModelsEnum }> = ({ model }) => {
	const color = modelToColor(model);
	const { t } = useTranslation('model');
	return (
		<Flex bg={color} color="white">
			<Text py={1} my={0} px={3} fontSize="sm">
				{t(modelToText(model))}
			</Text>
		</Flex>
	);
};

type Props = {
	publication: PublicationDto;
	onSelect?: (uuid: string) => void;
	tileWrapperCss?: (uuid: string) => SerializedStyles;
};
const GenericTileItem: React.FC<Props> = ({
	publication,
	onSelect,
	tileWrapperCss,
}) => {
	const { exportModeOn, uuidHeap, setUuidHeap } = useBulkExportContext();
	const push = useNavigate();
	const { t } = useTranslation('search');
	const isPeriodical = publication.model.includes('periodical');
	const url = `/${isPeriodical ? 'periodical' : 'view'}/${publication.pid}`;
	const isSelected = exportModeOn && uuidHeap[publication.pid]?.selected;

	console.log('TILE VIEW');
	console.log({ exportModeOn });
	return (
		<AspectRatio
			key={publication.pid}
			as="a"
			ratio={[2.5, 1]}
			width="100%"
			opacity={!exportModeOn || isSelected ? 1 : 0.6}
			onClick={e => {
				e.preventDefault();
				if (exportModeOn) {
					const selected = !(uuidHeap[publication.pid]?.selected ?? false);

					setUuidHeap?.(p => ({
						...p,
						[publication.pid]: {
							selected,
							enriched: publication.enriched,
							publication,
							title: publication.title,
						},
					}));
				} else if (onSelect) {
					onSelect(publication.pid);
				} else {
					push(url);
				}
			}}
		>
			<a
				href={url}
				onClick={e => {
					e.preventDefault();
					updateVisited(publication);
				}}
				css={css`
					text-decoration: none;
				`}
			>
				<Flex
					bg={isSelected ? 'enrichedTransparent' : 'white'}
					position="relative"
					height="100%"
					p={2}
					css={css`
						${isSelected
							? css`
									border: 2px solid ${theme.colors.enriched};
									&::after {
										content: '';
										display: block;
										color: white;
										padding-bottom: 8px;
										position: absolute;
										background-image: url('/assets/checkmark.svg');
										filter: invert();
										background-repeat: no-repeat;
										background-position: center;
										background-color: #fc7658;
										border: 1px solid #fc7658;
										border-radius: 50%;
										opacity: 0.8;
										top: 5px;
										left: 5px;
										width: 40px;
										height: 30px;
									}
							  `
							: css`
									border: 1px solid ${theme.colors.border};
							  `}
						&:hover {
							box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.2);
							cursor: pointer;
						}
						${tileWrapperCss?.(publication.pid) ?? ``}
					`}
				>
					{exportModeOn && (
						<Flex
							display="none"
							bg="#E4F0F3"
							opacity={0.1}
							css={css`
								border: 1px solid #0389a74f;
								position: absolute;
								width: 100%;
								height: 100%;
								margin-left: -9px;
								margin-top: 0px;
								top: 0;
								/* bottom: 0; */
							`}
						/>
					)}
					{publication.enriched && (
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
							background-image: url(${`api/item/${publication.pid}/thumb`});
							background-repeat: no-repeat;
							background-size: cover;
						`}
					>
						{(publication.availability === 'private' ||
							publication.policy === 'private') && (
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
						color={publication.enriched ? 'black' : 'text'}
					>
						<H3
							css={css`
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							`}
						>
							{publication.title}
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
									{typeof publication.authors === 'object'
										? publication.authors.map(a => a)
										: publication.authors}
								</Cell>
							</Flex>
							<Flex alignItems="center">
								<MdCalendarToday color="primary" />
								<Text ml={2}>
									{/* {getDateString(d?.published ?? publication.date)} */}
									{publication.date}
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
							{publication.enriched && (
								<Flex bg="primary" color="white" opacity="0.8" mr={2}>
									<Text py={1} my={0} px={3} fontSize="sm">
										{t('enrichment.is_enriched')}
									</Text>
								</Flex>
							)}
							<PubModelTagBadge model={publication.model} />
						</Flex>
					</Flex>
				</Flex>
			</a>
		</AspectRatio>
	);
};

export default GenericTileItem;