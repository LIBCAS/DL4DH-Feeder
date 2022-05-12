/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import useMeasure from 'react-use-measure';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import Text from 'components/styled/Text';
import { Dot, Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Checkbox from 'components/form/checkbox/Checkbox';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';
import { getScrollBarWidth } from 'utils';

import useHeaderHeight from 'utils/useHeaderHeight';

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

	isLoading?: boolean;

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
	isLoading,
	marginTop,
	hideEditButton,
	maxTableWidth,
}: Props<T>) => {
	const [wrapperRef, { width: wrapperWidthAbs, height: wrapperHeight }] =
		useMeasure({
			debounce: 10,
		});

	const gridRef = React.createRef<FixedSizeGrid>();
	const scWidth = useMemo(() => getScrollBarWidth(), []);
	const webHeaderHeight = useHeaderHeight();
	const theme = useTheme();

	const [tempAllChecked, setTempAllChecked] = useState(false);

	const wrapperWidth = wrapperWidthAbs;
	const tableHeight = useMemo(
		() => (wrapperHeight - 10 < 400 ? 400 : wrapperHeight - 100),
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
						: `${wrapperWidth - hasVerticalScroll * scWidth - 4}px !important`};
					border-top: 1px solid ${theme.colors.border};

					&:hover,
					&:hover .table-row-edit-button {
						background-color: ${theme.colors.primaryLight};
					}
				`}
			>
				<Flex mt={2} mx={2}>
					<Checkbox checked={tempAllChecked} />
				</Flex>
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
							// border-left: 1px solid ${theme.colors.lightGrey};
							/* border-right: 1px solid ${theme.colors.lightGrey}; */
						`}
					>
						<NavLinkButton variant="text" to={`/view/${data[rowIndex].id}`}>
							<Dot />
							<Dot />
							<Dot />
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
			tempAllChecked,
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
				<Flex mt={2} mx={2}>
					<Checkbox
						checked={tempAllChecked}
						onChange={() => setTempAllChecked(p => !p)}
					/>
				</Flex>
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
		[
			wrapperWidth,
			renderHeader,
			minWidth,
			headerHeight,
			scWidth,
			setTempAllChecked,
			tempAllChecked,
		],
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
					height: `calc(100vh - ${webHeaderHeight + (marginTop ?? 0) + 100}px)`,
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
										columnWidth={wrapperWidth - (scWidth + 30)}
										rowHeight={rowHeight}
										width={wrapperWidth}
									>
										{RenderRow}
									</FixedSizeGrid>
								</Flex>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Table;
