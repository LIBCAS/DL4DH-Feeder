/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useEffect, useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import Store from 'utils/Store';

const defaultPageLimitOptions = [15, 30, 50, 100];
const defaultStorageKey = 'feeder-pagination-limit';
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
	limitOptions?: number[];
	localStorageKey?: string;
	stored?: boolean;
	hideLimitOptions?: boolean;
};

const CircleButton: FC<{
	page: number;
	changePage: (page: number) => void;
	active?: boolean;
}> = ({ page, active, changePage }) => {
	const theme = useTheme();
	return (
		<Button
			width={PAG_BOX_SIZE}
			height={PAG_BOX_SIZE}
			minWidth={0}
			px={1}
			onClick={() => changePage(page)}
			css={css`
				background-color: ${active ? theme.colors.primary : 'transparent'};
				font-weight: ${active ? 'bold' : 'normal'};
				color: ${active ? 'white' : 'black'};
				cursor: pointer;
				&:hover {
					background-color: ${active
						? theme.colors.primary
						: 'rgba(0,0,0,0.1)'};
					transition: background-color 200ms;
				}
			`}
		>
			{page}
		</Button>
	);
};

const collapseWidth = 800;

const Pagination: FC<Props> = ({
	changeLimit,
	page,
	changePage,
	pageLimit,
	totalCount,
	hasMore,
	loading,
	limitOptions,
	localStorageKey,
	stored,
	hideLimitOptions,
}) => {
	const [ref, { width: viewportWidth }] = useMeasure({
		polyfill: ResizeObserver,
		debounce: 100,
	});
	const isMobile = useMemo(
		() => viewportWidth < collapseWidth,
		[viewportWidth],
	);
	const { t } = useTranslation('common');
	const pageLimitOptions = limitOptions ?? defaultPageLimitOptions;

	const pagesCount = Math.ceil(totalCount / pageLimit);
	const MAX_PAGES_DISPLAY = isMobile ? 3 : 10;

	const middlePages = useMemo(
		() =>
			// eslint-disable-next-line no-nested-ternary
			pagesCount <= MAX_PAGES_DISPLAY
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
		if (stored) {
			const limit = parseInt(
				Store.get<string>(localStorageKey ?? defaultStorageKey) ?? '',
			);
			if (limit && pageLimitOptions.some(l => l === limit)) {
				changeLimit(limit);
			}
		}
	}, [changeLimit, pageLimitOptions, localStorageKey, stored]);

	return (
		<Flex
			ref={ref}
			width="100%"
			justifyContent="space-between"
			alignItems={['flex-end', 'center']}
			flexDirection={['column', 'row']}
		>
			{!hideLimitOptions && (
				<Flex pr={2}>
					<label htmlFor="pagination-select">
						<Text mr={1}>{t('pagination.page_limit')}</Text>
					</label>
					<select
						id="pagination-select"
						style={{ ...selectStyle, border: 'none' }}
						value={pageLimit}
						onChange={e => {
							const limit = parseInt(e.target.value);
							changeLimit(limit);
							if (stored) {
								Store.set<number>(localStorageKey ?? defaultStorageKey, limit);
							}

							changePage(1);
						}}
					>
						{pageLimitOptions.map(o => (
							<option key={o} value={o} style={selectStyle}>
								{nameFromOption(o)}
							</option>
						))}
					</select>
				</Flex>
			)}
			{pageLimit > 0 && totalCount > pageLimit ? (
				<Flex alignItems="center" justifyContent="center">
					<Button
						p={2}
						m={0}
						minWidth={0}
						tooltip={t('pagination.prev_page')}
						disabled={page === 1 || loading}
						variant="text"
						color="text"
						onClick={() => changePage(page - 1)}
						css={css`
							cursor: ${page === 1 ? 'initial' : 'pointer'};
							filter: ${page === 1 ? 'opacity(0.5)' : 'none'};
							&:hover {
								background-color: ${page === 1
									? 'transparent'
									: 'rgba(0,0,0,0.1)'};
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
					<Button
						disabled={!hasMore || loading}
						variant="text"
						tooltip={t('pagination.next_page')}
						onClick={() => changePage(page + 1)}
						color="text"
						p={2}
						m={0}
						css={css`
							cursor: ${!hasMore ? 'not-allowed' : 'pointer'};
							filter: ${!hasMore ? 'opacity(0.5)' : 'none'};
							&:hover {
								background-color: ${page === pagesCount
									? 'transparent'
									: 'rgba(0, 0, 0, 0.1)'};
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
							{t('pagination.total_count')} {totalCount}
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
