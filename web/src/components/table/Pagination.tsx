/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useEffect, useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import Store from 'utils/Store';

const pageLimitOptions = [15, 30, 50, 100];
const nameFromOption = (n: number) => (n !== -1 ? n : 'Všetko');

const selectStyle = { fontFamily: 'Calibri', fontSize: '16px' };
const PAG_BOX_SIZE = 40;
const ARROW_SIZE = 24;

type Props = {
	changeLimit: (newLimit: number) => void;
	pageLimit: number;
	changePage: (page: number) => void;
	page: number;
	totalCount: number;
	offset: number;
	hasMore?: boolean;
	loading?: boolean;
};

const CircleButton: FC<{
	page: number;
	changePage: (page: number) => void;
	active?: boolean;
}> = ({ page, active, changePage }) => {
	const theme = useTheme();
	return (
		<Flex
			width={PAG_BOX_SIZE}
			height={PAG_BOX_SIZE}
			alignItems="center"
			px={1}
			justifyContent="center"
			onClick={() => changePage(page - 1)}
			css={css`
				background-color: ${active ? theme.colors.primary : theme.colors.white};
				border-radius: 0px;
				border: 1px solid ${active ? theme.colors.primary : 'white'};
				font-weight: ${active ? 'bold' : 'normal'};
				color: ${active ? 'white' : 'black'};
				cursor: pointer;
				&:hover {
					background-color: ${active
						? theme.colors.primary
						: theme.colors.lightGrey};
					transition: background-color 200ms;
				}
			`}
		>
			{page}
		</Flex>
	);
};

const collapseWidth = 800;

const Pagination: FC<Props> = ({
	changeLimit,
	page: orgPage,
	changePage,
	pageLimit,
	totalCount,
	hasMore,
	loading,
}) => {
	const [ref, { width: viewportWidth }] = useMeasure({
		polyfill: ResizeObserver,
		debounce: 100,
	});
	const theme = useTheme();
	const isMobile = useMemo(
		() => viewportWidth < collapseWidth,
		[viewportWidth],
	);

	const pagesCount = Math.ceil(totalCount / pageLimit);
	const page = orgPage + 1;
	const MAX_PAGES_DISPLAY = isMobile ? 3 : 10;

	const middlePages = useMemo(
		() =>
			// eslint-disable-next-line no-nested-ternary
			pagesCount < MAX_PAGES_DISPLAY
				? [...Array(pagesCount).keys()].map(a => a + 1)
				: // eslint-disable-next-line no-nested-ternary
				page > MAX_PAGES_DISPLAY - 1
				? // eslint-disable-next-line no-nested-ternary
				  page >= pagesCount - MAX_PAGES_DISPLAY
					? [...Array(MAX_PAGES_DISPLAY + 1).keys()]
							.map(a => pagesCount - a)
							.reverse()
					: isMobile
					? [...[...Array(MAX_PAGES_DISPLAY - 1).keys()].map(a => page + a)]
					: [
							page - 1,
							...[...Array(MAX_PAGES_DISPLAY - 2).keys()].map(a => page + a),
					  ]
				: //[page - 1, page, page + 1, page + 2]
				  [...Array(MAX_PAGES_DISPLAY + 1).keys()].map(a => a + 1),
		[MAX_PAGES_DISPLAY, page, pagesCount, isMobile],
	);

	useEffect(() => {
		const limit = parseInt(Store.get<string>('vsd-pagination-limit') ?? '');
		if (limit && pageLimitOptions.some(l => l === limit)) {
			changeLimit(limit);
		}
	}, [changeLimit]);

	return (
		<Flex
			ref={ref}
			width="100%"
			justifyContent="space-between"
			alignItems={['flex-end', 'center']}
			flexDirection={['column', 'row']}
		>
			<Flex pr={2}>
				<label htmlFor="pagination-select">
					<Text mr={1}>Počet záznamov na stránku:</Text>
				</label>
				<select
					id="pagination-select"
					style={{ ...selectStyle, border: 'none' }}
					value={pageLimit}
					onChange={e => {
						const limit = parseInt(e.target.value);
						changeLimit(limit);
						Store.set<number>('vsd-pagination-limit', limit);
						changePage(0);
					}}
				>
					{pageLimitOptions.map(o => (
						<option key={o} value={o} style={selectStyle}>
							{nameFromOption(o)}
						</option>
					))}
				</select>
			</Flex>
			{pageLimit > 0 && totalCount > pageLimit ? (
				<Flex alignItems="center" justifyContent="center">
					<Button
						p={2}
						m={0}
						disabled={page === 1 || loading}
						variant="text"
						onClick={() => changePage(orgPage - 1)}
						css={css`
							border-radius: 0px;
							border: 1px solid white;
							cursor: ${page === 1 ? 'initial' : 'pointer'};
							filter: ${page === 1 ? 'opacity(0.5)' : 'none'};
							&:hover {
								background-color: ${page === 1
									? 'white'
									: theme.colors.lightGrey};
							}
						`}
					>
						<MdArrowBackIos size={ARROW_SIZE} />
					</Button>
					{page > MAX_PAGES_DISPLAY - 1 && pagesCount > MAX_PAGES_DISPLAY + 1 && (
						<>
							<CircleButton
								active={page === 1}
								page={1}
								changePage={changePage}
							/>
							<Flex
								width={PAG_BOX_SIZE}
								height={PAG_BOX_SIZE}
								alignItems="center"
								justifyContent="center"
							>
								...
							</Flex>
						</>
					)}
					{middlePages.map(p => (
						<CircleButton
							key={p}
							active={page === p}
							page={p}
							changePage={changePage}
						/>
					))}

					{page < pagesCount - MAX_PAGES_DISPLAY && (
						<>
							<Flex
								width={PAG_BOX_SIZE}
								height={PAG_BOX_SIZE}
								alignItems="center"
								justifyContent="center"
							>
								...
							</Flex>
							<CircleButton
								active={page === pagesCount}
								page={pagesCount}
								changePage={changePage}
							/>
						</>
					)}
					{/* <Text style={selectStyle}>
						{`${offset + 1} - ${
							hasMore ? offset + pageLimit : totalCount
						} zo ${totalCount} záznamov`}
					</Text>
					
					{page + 1} */}
					<Button
						disabled={!hasMore || loading}
						style={{}}
						variant="text"
						onClick={() => changePage(orgPage + 1)}
						p={2}
						m={0}
						css={css`
							cursor: ${!hasMore ? 'not-allowed' : 'pointer'};
							border-radius: 0px;
							border: 1px solid white;
							filter: ${!hasMore ? 'opacity(0.5)' : 'none'};
							&:hover {
								background-color: ${theme.colors.lightGrey};
							}
						`}
					>
						<MdArrowForwardIos size={ARROW_SIZE} />
					</Button>
				</Flex>
			) : (
				<>
					{totalCount ? (
						<Flex alignItems="center" justifyContent="center">
							Celkový počet záznamov: {totalCount}
						</Flex>
					) : (
						<></>
					)}
				</>
			)}
		</Flex>
	);
};

export default Pagination;
