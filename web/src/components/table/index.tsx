/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import React, {
	CSSProperties,
	SetStateAction,
	useCallback,
	useMemo,
} from 'react';
import { FixedSizeGrid } from 'react-window';
import useMeasure from 'react-use-measure';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';

import Text from 'components/styled/Text';
import { Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';
import { getScrollBarWidth } from 'utils';
import { ThreeDotsIcon } from 'assets';

import useHeaderHeight from 'utils/useHeaderHeight';
import { isIntern } from 'utils/FEVersion';

import Pagination from './Pagination';

/** FLAGS */
const TableHeader = FixedSizeGrid;

const EDIT_COL_WIDTH = 60;

/** Types */

type TableItem = {
	id?: string;
};

type RenderCallback = ({
	style,
	rowIndex,
}: {
	style: CSSProperties;
	rowIndex: number;
}) => EmotionJSX.Element;

/** Table interface */

type Props<T extends TableItem> = {
	minWidth?: number;
	headerHeight?: number;
	rowHeight?: number;
	data: T[];
	renderRow: (row: T) => React.ReactNode;
	renderHeader: (
		collapsed: boolean,
		setSortColumn?: (key: string) => void,
	) => React.ReactNode;
	page?: number;
	pageLimit?: number;
	changeLimit: (limit: number) => void;
	changePage: (page: number) => void;
	totalCount: number;
	isLoading?: boolean;
	hasMore?: boolean;
	offset: number;
	marginTop?: number;
	hideEditButton?: boolean;
	maxTableWidth?: number;
};

/** Table implementation */

const Table = <T extends TableItem>({
	data,
	renderRow,
	renderHeader,
	minWidth = 1000,
	headerHeight = 50,
	rowHeight = 48,
	page = 0,
	pageLimit = 15,
	changeLimit,
	changePage,
	totalCount,
	isLoading,
	hasMore,
	offset,
	marginTop,
	hideEditButton,
	maxTableWidth,
}: Props<T>) => {
	const [wrapperRef, { width: wrapperWidthAbs, height: wrapperHeight }] =
		useMeasure({
			debounce: 1,
		});

	const gridRef = React.createRef<FixedSizeGrid>();
	const scWidth = useMemo(() => getScrollBarWidth(), []);
	const webHeaderHeight = useHeaderHeight();
	console.log('webHeaderHeight');
	console.log(webHeaderHeight);
	const theme = useTheme();

	const wrapperWidth = wrapperWidthAbs;
	const tableHeight = useMemo(
		() => (wrapperHeight - 10 < 400 ? 400 : wrapperHeight - 30),
		[wrapperHeight],
	);

	const hasVerticalScroll = useMemo(
		() => (rowHeight * data.length >= tableHeight ? 1 : 0),
		[rowHeight, data, tableHeight],
	);

	const RenderRow: RenderCallback = useCallback(
		({ style, rowIndex }) => (
			<Flex
				style={style}
				css={css`
					width: ${wrapperWidth < minWidth
						? `${minWidth}px !important`
						: `${wrapperWidth - hasVerticalScroll * scWidth - 3}px !important`};
					border-top: 1px solid ${theme.colors.lightGrey};

					&:hover,
					&:hover .table-row-edit-button {
						background-color: ${theme.colors.lightGrey};
					}
				`}
			>
				{renderRow(data[rowIndex])}
				{!hideEditButton && (
					<Flex
						className="table-row-edit-button"
						alignItems="center"
						justifyContent="center"
						flex={1}
						p={2}
						css={css`
							min-width: ${EDIT_COL_WIDTH}px;
							max-width: ${EDIT_COL_WIDTH}px;
							padding: 0;
							position: sticky;
							right: 0;
							background-color: rgba(255, 255, 255, 0.95);
							border-left: 1px solid ${theme.colors.lightGrey};
							/* border-right: 1px solid ${theme.colors.lightGrey}; */
						`}
					>
						<NavLinkButton variant="text" to={`/reading/${data[rowIndex].id}`}>
							<ThreeDotsIcon />
						</NavLinkButton>
					</Flex>
				)}
			</Flex>
		),
		[
			minWidth,
			wrapperWidth,
			theme,
			data,
			renderRow,
			hasVerticalScroll,
			scWidth,
			hideEditButton,
		],
	);

	const renderTableHeader: RenderCallback = useCallback(
		() => (
			<Flex
				bg="primaryLight"
				color="primary"
				css={css`
					width: ${wrapperWidth < minWidth
						? `${minWidth}px!important`
						: 'unset'};
					height: ${headerHeight}px;
				`}
			>
				{renderHeader(false)}

				<Flex
					alignItems="center"
					justifyContent="center"
					flex={1}
					p={2}
					bg="primaryLight"
					css={css`
						min-width: ${EDIT_COL_WIDTH + scWidth}px;
						max-width: ${EDIT_COL_WIDTH + scWidth}px;
						padding: 0;
						position: sticky;
						right: 0;
					`}
				>
					F
				</Flex>
			</Flex>
		),
		[wrapperWidth, renderHeader, minWidth, headerHeight, scWidth],
	);

	const headerGridRef = React.useRef<FixedSizeGrid<HTMLDivElement>>(null);
	const onScroll = React.useCallback(props => {
		const { scrollUpdateWasRequested, scrollLeft } = props;
		if (!scrollUpdateWasRequested) {
			headerGridRef?.current?.scrollTo({ scrollLeft: scrollLeft });
		}
	}, []);

	return (
		<div>
			<div
				ref={wrapperRef}
				style={{
					height: `calc(90vh - ${webHeaderHeight + (marginTop ?? 0)}px)`,
					maxWidth: maxTableWidth ? `${maxTableWidth}px` : 'unset',
				}}
			>
				<div
					css={css`
						width: ${wrapperWidth};
						position: 'relative';
						overflow: 'hidden';
						border: 1px solid ${theme.colors.border};
					`}
				>
					<TableHeader
						ref={headerGridRef}
						style={{ overflow: 'hidden' }}
						columnCount={1}
						columnWidth={wrapperWidth - 2} // -2 = 2x borderWidth
						height={headerHeight}
						rowCount={1}
						rowHeight={headerHeight}
						width={wrapperWidth - 2} // -2 = 2x borderWidth
					>
						{renderTableHeader}
					</TableHeader>

					{isLoading ? (
						<Flex width={`${wrapperWidth}px`} height={tableHeight}>
							<Loader />
						</Flex>
					) : (
						<>
							{data.length < 1 ? (
								<Flex
									width={1}
									height="300px"
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize="xl" fontWeight="600">
										Nenašli sa žiadne záznamy.
									</Text>
								</Flex>
							) : (
								<Flex>
									<FixedSizeGrid
										ref={gridRef}
										onScroll={onScroll}
										style={{
											position: 'relative',
											borderRight: `1px solid ${theme.colors.lightGrey}`,
											borderLeft: `1px solid ${theme.colors.lightGrey}`,
										}}
										height={tableHeight}
										columnCount={1}
										rowCount={data.length}
										columnWidth={wrapperWidth - scWidth - 3}
										rowHeight={rowHeight}
										width={wrapperWidth}
									>
										{RenderRow}
									</FixedSizeGrid>
								</Flex>
							)}
						</>
					)}
					<Flex
						width={1}
						height={1}
						css={css`
							border-top: 1px solid ${theme.colors.lightGrey};
						`}
					/>
				</div>
				<Pagination
					page={page}
					changePage={changePage}
					changeLimit={changeLimit}
					pageLimit={pageLimit}
					totalCount={totalCount}
					hasMore={hasMore}
					offset={offset}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};

export default Table;
