/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { createRef, FC, useEffect, useState } from 'react';
import {
	MdArrowDownward,
	MdArrowUpward,
	MdClear,
	MdSearch,
} from 'react-icons/md';
import useMeasure from 'react-use-measure';
import { useParams, useSearchParams } from 'react-router-dom';
import { FixedSizeGrid } from 'react-window';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import TextInput from 'components/form/input/TextInput';
import IconButton from 'components/styled/IconButton';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

/** TODO: PUBLICATION THUMBNAILS AND SEARCHING WITHIN */

type Props = {
	marginTop: number;
	pages: PublicationChild[];
};

const PubThumbnails: FC<Props> = ({ marginTop, pages }) => {
	const { id } = useParams<{ id: string }>();
	const theme = useTheme();
	const [toSearch, setToSearch] = useState('');
	const [wrapperRef, { height: wrapperHeight }] = useMeasure({
		debounce: 10,
	});

	const [selectedPage, setSelectedPage] =
		useState<{ pid: string; rowIndex: number; index: number }>();
	const [goToPage, setGoToPage] = useState<number | string | null>('');

	const [ref, { height: resultsMargin }] = useMeasure();

	const [page, setPage] = useSearchParams();

	const gridRef = createRef<FixedSizeGrid>();

	useEffect(() => {
		const pid = page.get('page') ?? '';
		const x = pages.findIndex(p => p.pid === pid);
		setSelectedPage({ pid, rowIndex: Math.floor(x / 3), index: x });
	}, [page, pages]);

	useEffect(() => {
		gridRef.current?.scrollToItem({
			rowIndex: selectedPage?.rowIndex,
			align: 'start',
		});
	}, [selectedPage, pages, gridRef]);

	useEffect(() => {
		setGoToPage((selectedPage?.index ?? 0) + 1);
	}, [selectedPage?.index]);

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

				<Flex py={3} px={3} justifyContent="space-between" alignItems="center">
					<IconButton
						onClick={() => {
							gridRef.current?.scrollToItem({
								rowIndex: 0,
								align: 'start',
							});
						}}
					>
						<MdArrowUpward size={20} />
					</IconButton>

					<Flex
						width={1}
						height="30px"
						justifyContent="center"
						alignItems="center"
						fontSize="md"
					>
						<TextInput
							label=""
							labelType="inline"
							width="unset"
							hideArrows
							type="number"
							fontSize="24px!important"
							wrapperCss={css`
								background-color: transparent;
								height: 25px;
								border: none;
								border-bottom: 1px solid black;
								width: 50px !important;
								max-width: 50px;
								padding-left: 0;
								text-align: left;
							`}
							value={isNaN(goToPage as number) ? '' : goToPage ?? ''}
							onChange={e => setGoToPage(parseInt(e.target.value))}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									const parsed = parseInt((goToPage ?? Infinity) as string) - 1;
									page.set(
										'page',
										pages[Math.min(pages.length - 1, Math.max(parsed, 0))].pid,
									);
									setPage(page);
								}
							}}
						/>
						<Text fontSize="md">
							z <strong>{pages.length}</strong> stránek
						</Text>
					</Flex>

					<IconButton
						onClick={() => {
							gridRef.current?.scrollToItem({
								rowIndex: pages.length - 2,
								align: 'start',
							});
						}}
					>
						<MdArrowDownward size={20} />
					</IconButton>
				</Flex>
				<Divider />
			</div>
			<Box
				ref={wrapperRef}
				width={300}
				maxWidth={300}
				bg="darkGrey"
				height={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 1
				}px)`}
				maxHeight={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 1
				}px)`}
				overflow="hidden"
			>
				<FixedSizeGrid
					rowCount={Math.ceil(pages.length / 3)}
					rowHeight={126}
					height={wrapperHeight}
					columnCount={3}
					columnWidth={90}
					width={300}
					ref={gridRef}
				>
					{({ style, rowIndex, columnIndex }) => {
						const index = 3 * rowIndex + columnIndex;
						if (index >= pages.length) {
							return <></>;
						}
						return (
							<Flex
								alignItems="center"
								style={style}
								width={80}
								maxWidth={80}
								height={120}
								maxHeight={120}
								m={1}
								ml={2}
								css={css`
									border: ${selectedPage?.pid === pages[index].pid ? 5 : 1}px
										solid ${theme.colors.primary};
									box-sizing: border-box;
									cursor: pointer;
									background-image: url('/api/item/${pages[index].pid}/thumb');
									background-size: cover;
									background-repeat: no-repeat;
									&:hover {
										box-shadow: 0 0px 3px 3px rgba(0, 0, 0, 0.2);
									}
								`}
								onClick={() => {
									page.set('page', pages[index].pid);
									setPage(page);
									setSelectedPage({ pid: pages[index].pid, rowIndex, index });
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
										{pages[index].title}
									</Text>
								</Box>
							</Flex>
						);
					}}
				</FixedSizeGrid>
			</Box>
		</Box>
	);
};

export default PubThumbnails;
