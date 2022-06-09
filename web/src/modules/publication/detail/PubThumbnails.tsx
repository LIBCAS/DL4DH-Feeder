/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { MdClear, MdSearch } from 'react-icons/md';
import useMeasure from 'react-use-measure';
import { useParams, useSearchParams } from 'react-router-dom';
import { InfiniteScroll } from 'libreact/lib/InfiniteScroll';
import { useQueryClient } from 'react-query';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import TextInput from 'components/form/input/TextInput';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';
import { useThumbnails } from 'api/publicationsApi';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { usePublicationCtx } from '../ctx/pub-ctx';

/** TODO: PUBLICATION THUMBNAILS AND SEARCHING WITHIN */

type Props = {
	marginTop: number;
	pages: PublicationChild[];
};

const PubThumbnails: FC<Props> = ({ marginTop, pages }) => {
	const { id } = useParams<{ id: string }>();
	//const pctx = usePublicationCtx();
	const [toSearch, setToSearch] = useState('');
	const [selected, setSelected] = useState(
		/* pctx.currentPage?.childIndex ?? 0) */ 0,
	);
	const [pagescroll, setPageScroll] = useState(20);
	const [ref, { height: resultsMargin }] = useMeasure();
	const theme = useTheme();
	const [page, setPage] = useSearchParams();
	const thumbnails = useThumbnails(pages, pagescroll);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	const onScroll = useCallback(props => {
		const { scrollUpdateWasRequested, scrollTop } = props.currentTarget;
		if (!scrollUpdateWasRequested) {
			//	scrollRef?.current?.scrollTo({ scrollLeft: scrollLeft });
			// console.log(scrollTop);
			// console.log('client height', scrollRef.current?.clientHeight);
			// console.log('client scroll post', scrollRef.current?.scrollTop);
		}
	}, []);

	//const cache = useQueryClient().getQueryCache();

	// useEffect(() => {
	// 	const hash = pages.some(p =>
	// 		cache.get(JSON.stringify(['thumbnail', p.pid]))?.isStale(),
	// 	);
	// 	if (!hash) {
	// 		setPageScroll(pages.length);
	// 	}
	// }, [pages, setPageScroll, cache]);

	// useEffect(() => {
	// 	setSelected(pctx.currentPage?.childIndex ?? 0);
	// }, [pctx.currentPage?.childIndex]);

	// console.log(pagescroll);
	// console.log('client height', scrollRef.current?.clientHeight);
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
				ref={scrollRef}
				onScroll={onScroll}
				p={2}
				flexWrap="wrap"
				maxHeight={`calc(100vh - ${
					INIT_HEADER_HEIGHT + marginTop + resultsMargin + 30
				}px)`}
				overflowY="auto"
			>
				<InfiniteScroll
					cursor={Math.min(pagescroll, pages.length)}
					loadMore={() => {
						console.log('loading more', pagescroll);
						// if (!thumbnails[pagescroll]?.isLoading) {
						// 	setPageScroll(p => p + 15);
						// }
						if (pagescroll < pages.length - 1) {
							setPageScroll(p => p + 10);
						}
						/* if (
							(scrollRef.current?.clientHeight ?? 0) <
							(scrollRef.current?.scrollTop ?? 0) +
								(scrollRef.current?.clientHeight ?? 0)
						) {
							setPageScroll(p => p + 10);
						} */
					}}
					hasMore={pagescroll < pages.length}
					sentinel={
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								width: '100%',
								marginTop: 32,
								marginBottom: 32,
							}}
						>
							<LoaderSpin />
						</div>
					}
				>
					{
						//(pages ?? []).map((p, index) => (
						(pages.slice(0, pagescroll) ?? []).map((p, index) => (
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
									background-image: url(${thumbnails[index]?.data ?? ''});
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
						))
					}
				</InfiniteScroll>
			</Flex>
		</Box>
	);
};

export default PubThumbnails;
