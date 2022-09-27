/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { createRef, FC, useEffect, useMemo, useState } from 'react';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import { FixedSizeGrid } from 'react-window';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { usePublicationContext } from '../ctx/pub-ctx';

import { PagesSearchResult } from './PubPagesDetail';

type Props = {
	marginTop?: number;
	isSecond?: boolean;
	pagesSearchResult?: PagesSearchResult[];
	searchMode?: boolean;
};
//TODO: refactor!!

const PubThumbnails: FC<Props> = ({
	marginTop = 0,
	isSecond,
	pagesSearchResult,
	searchMode,
}) => {
	const COLUMNS_COUNT = pagesSearchResult?.length ?? 0 > 0 ? 1 : 3;
	const pubCtx = usePublicationContext();
	const pageId = isSecond
		? pubCtx.currentPageOfSecond?.uuid ?? 'ctx-right-current_page_uuid_error'
		: pubCtx.currentPage?.uuid ?? 'ctx-left-current_page_uuid_error';

	const pagesRaw = useMemo(
		() =>
			isSecond
				? pubCtx.publicationChildrenOfSecond ?? []
				: pubCtx.publicationChildren ?? [],
		[pubCtx.publicationChildren, pubCtx.publicationChildrenOfSecond, isSecond],
	);

	const pages = useMemo(
		() =>
			(pagesSearchResult?.length ?? 0) > 0
				? pagesRaw.filter(pr =>
						(pagesSearchResult ?? []).some(x => x.pid === pr.pid),
				  )
				: pagesRaw,
		[pagesSearchResult, pagesRaw],
	);

	const theme = useTheme();
	const [wrapperRef, { height: wrapperHeight }] = useMeasure({
		debounce: 10,
	});

	const [selectedPage, setSelectedPage] =
		useState<{ pid: string; rowIndex: number; index: number }>();

	// jump to specific page (text input)
	const [goToPage, setGoToPage] = useState<number | string | null>('');

	const [ref, { height: resultsMargin }] = useMeasure();

	const [sp, setSp] = useSearchParams();

	const gridRef = createRef<FixedSizeGrid>();

	useEffect(() => {
		const index = pages.findIndex(p => p.pid === pageId);
		setSelectedPage({
			pid: pageId,
			rowIndex: Math.floor(index / COLUMNS_COUNT),
			index,
		});
	}, [pageId, pages, COLUMNS_COUNT]);

	useEffect(() => {
		gridRef.current?.scrollToItem({
			rowIndex: selectedPage?.rowIndex,
			align: 'start',
		});
	}, [selectedPage, pages, gridRef]);

	useEffect(() => {
		setGoToPage((selectedPage?.index ?? 0) + 1);
	}, [selectedPage?.index]);

	if (searchMode && (pagesSearchResult?.length ?? 0) === 0) {
		return <></>;
	}

	return (
		<Box width={1}>
			<div ref={ref}>
				<Flex py={2} px={2} justifyContent="space-between" alignItems="center">
					<IconButton
						onClick={() => {
							gridRef.current?.scrollToItem({
								rowIndex: 0,
								align: 'start',
							});
						}}
						css={css`
							border-top: 2px solid ${theme.colors.text};
							color: ${theme.colors.text};
						`}
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
									sp.set(
										isSecond ? 'page2' : 'page',
										pages[Math.min(pages.length - 1, Math.max(parsed, 0))].pid,
									);
									setSp(sp);
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
						css={css`
							border-bottom: 2px solid ${theme.colors.text};
							color: ${theme.colors.text};
						`}
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
				//bg="border"
				height={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 1
				}px)`}
				maxHeight={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 1
				}px)`}
				overflow="hidden"
				id="ejciboha"
			>
				<FixedSizeGrid
					rowCount={Math.ceil(pages.length / COLUMNS_COUNT)}
					rowHeight={126}
					height={wrapperHeight}
					columnCount={COLUMNS_COUNT}
					columnWidth={COLUMNS_COUNT === 3 ? 90 : 300}
					width={300}
					ref={gridRef}
					css={css`
						overflow-x: hidden !important;
					`}
				>
					{({ style, rowIndex, columnIndex }) => {
						const index = COLUMNS_COUNT * rowIndex + columnIndex;
						const url = `/api/item/${pages[index]?.pid ?? ''}/thumb`;
						if (index >= pages.length) {
							return <></>;
						}
						return (
							<Flex
								style={style}
								width={300}
								css={css`
									${searchMode &&
									css`
										width: fill-available !important;
										cursor: pointer;
										box-sizing: border-box;
										background-color: ${selectedPage?.pid === pages[index].pid
											? 'white'
											: 'unset'};
										${isSecond
											? css`
													border-left: ${selectedPage?.pid === pages[index].pid
															? 3
															: 0}px
														solid ${theme.colors.primary};
											  `
											: css`
													border-right: ${selectedPage?.pid === pages[index].pid
															? 3
															: 0}px
														solid ${theme.colors.primary};
											  `}

										&:hover {
											background-color: white;
										}
									`}
								`}
								onClick={() => {
									if (searchMode) {
										sp.set(isSecond ? 'page2' : 'page', pages[index].pid);
										setSp(sp);
										setSelectedPage({ pid: pages[index].pid, rowIndex, index });
									}
								}}
							>
								<Flex
									alignItems="center"
									width={80}
									maxWidth={80}
									flexShrink={0}
									height={120}
									maxHeight={120}
									m={1}
									ml={2}
									css={css`
										border: ${selectedPage?.pid === pages[index].pid ? 5 : 1}px
											solid ${theme.colors.primary};
										box-sizing: border-box;
										cursor: pointer;
										background-image: url(${url});
										background-size: cover;
										background-repeat: no-repeat;
										&:hover {
											box-shadow: 0 0px 3px 3px rgba(0, 0, 0, 0.2);
										}
									`}
									onClick={() => {
										sp.set(isSecond ? 'page2' : 'page', pages[index].pid);
										setSp(sp);
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
								<Flex fontSize="sm" width="auto" flexGrow={1}>
									{pagesSearchResult
										?.filter(p => p.pid === pages[index].pid)
										.map((k, i) => (
											<Flex
												flexDirection="column"
												key={k.title + i}
												my={2}
												justifyContent="flex-start"
												alignItems="flex-start"
												width="100%"
											>
												<Flex
													flexDirection="column"
													key={k?.pid}
													my={0}
													width="100%"
													justifyContent="flex-start"
													alignItems="flex-start"
													css={css`
														> p > strong {
															color: ${theme.colors.primary};
														}
													`}
												>
													<Text
														dangerouslySetInnerHTML={{
															__html: k?.ocr?.[0] ?? '',
														}}
													/>
													<Text>
														{Object.keys(k?.nameTag ?? {}).map(
															key => k?.nameTag?.[key]?.[0],
														)}
													</Text>
												</Flex>
											</Flex>
										))}
								</Flex>
							</Flex>
						);
					}}
				</FixedSizeGrid>
			</Box>
		</Box>
	);
};

export default PubThumbnails;
