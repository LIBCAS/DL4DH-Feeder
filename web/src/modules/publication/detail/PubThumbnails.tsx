/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';
import useMeasure from 'react-use-measure';
import { useParams, useSearchParams } from 'react-router-dom';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import TextInput from 'components/form/input/TextInput';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';
import { useThumbnails } from 'api/publicationsApi';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

/** TODO: PUBLICATION THUMBNAILS AND SEARCHING WITHIN */

type Props = {
	marginTop: number;
	pages: PublicationChild[];
};

const PubThumbnails: FC<Props> = ({ marginTop, pages }) => {
	const { id } = useParams<{ id: string }>();
	const [toSearch, setToSearch] = useState('');
	const [selected, setSelected] = useState(0);
	const [ref, { height: resultsMargin }] = useMeasure();
	const theme = useTheme();
	const [page, setPage] = useSearchParams();
	const thumbnails = useThumbnails(pages.slice(0, 20));

	return (
		<Box width={1}>
			<div ref={ref}>
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
			</div>
			<Flex
				p={2}
				flexWrap="wrap"
				maxHeight={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 30
				}px)`}
				overflowY="auto"
			>
				{(pages ?? []).map((p, index) => (
					<Box
						key={p.pid}
						width={80}
						height={120}
						bg="darkerGrey"
						m={1}
						position="relative"
						css={css`
							border: ${selected === index ? 5 : 1}px solid
								${theme.colors.primary};
							box-sizing: border-box;
							cursor: pointer;
							/* background-image: url(/api/item/${p.pid}/thumb); */
							background-image: url(${thumbnails[index]});
							background-size: contain;
							&:hover {
								box-shadow: 0 0px 3px 3px rgba(0, 0, 0, 0.2);
							}
						`}
						onClick={() => {
							page.set('page', p.pid);
							setPage(page);
							setSelected(index);
						}}
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
								{p.title}
							</Text>
						</Box>
					</Box>
				))}
			</Flex>
		</Box>
	);
};

export default PubThumbnails;
