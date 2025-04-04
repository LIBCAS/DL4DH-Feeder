/** @jsxImportSource @emotion/react */

import { css, SerializedStyles } from '@emotion/core';
import React, { FC, useCallback } from 'react';
import styled from '@emotion/styled/macro';

import Text from 'components/styled/Text';
import { Box, Dot, Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

/** FLAGS */

const EDIT_COL_WIDTH = 60;

/** Types */

type TableItem = {
	pid?: string;
	id?: string;
};

/** Table cell */

export const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

/** Table interface */

type Props<T extends TableItem> = {
	minWidth?: number;
	headerHeight?: number;
	rowHeight?: number;
	data: T[];
	renderRow: (row: T, rowIndex: number) => React.ReactNode;
	renderHeader?: (
		collapsed: boolean,
		setSortColumn?: (key: string) => void,
	) => React.ReactNode;

	isLoading?: boolean;
	height?: number;
	hideEditButton?: boolean;
	openInNewTab?: boolean;
	rowWrapperCss?: SerializedStyles;
	borderless?: boolean;
	NoResultsComponent?: React.ReactNode;
};

/** Table implementation */

const ClassicTable = <T extends TableItem>({
	data,
	renderRow,
	renderHeader,
	minWidth = 1000,
	headerHeight = 40,
	rowHeight,
	isLoading,
	hideEditButton,
	rowWrapperCss,
	borderless,
	NoResultsComponent,
}: Props<T>) => {
	const theme = useTheme();
	const RenderRow: FC<{ rowIndex: number }> = ({ rowIndex }) => (
		<Flex
			height={rowHeight ?? 'unset'}
			css={css`
				min-width: ${minWidth}px;
				border-bottom: ${rowIndex + 1 === data.length ? 0 : 1}px solid
					${theme.colors.primary};
				background-color: ${rowIndex % 2
					? theme.colors.tableRowEven
					: theme.colors.tableRow};
				&:hover,
				&:hover .table-row-edit-button {
					background-color: ${theme.colors.primaryLight};
					/* background-color: red; */
					color: ${theme.colors.text};
				}
				&:hover .table-row-three-dots {
					cursor: pointer;
				}
				${rowWrapperCss}
			`}
		>
			{renderRow(data[rowIndex], rowIndex)}
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
						right: -1px;
						background-color: ${rowIndex % 2
							? theme.colors.tableRowEven
							: theme.colors.tableRow};
						/* border-left: 1px solid white; */

						box-shadow: -2px 0px 8px 1px rgba(0, 0, 0, 0.05);
					`}
				>
					<NavLinkButton
						variant="text"
						to={`/view/${data[rowIndex].pid}`}
						className="table-row-three-dots"
						color="primary"
					>
						<Dot />
						<Dot />
						<Dot />
						{/* 	<ThreeDotsIcon /> */}
					</NavLinkButton>
				</Flex>
			)}
		</Flex>
	);

	const renderTableHeader = useCallback(
		(isEmpty?: boolean) =>
			renderHeader ? (
				<Flex
					bg="primary"
					color="white"
					position="sticky"
					zIndex={1}
					top={0}
					left={0}
					css={css`
						height: ${headerHeight}px;
						min-width: ${isEmpty ? 'unset' : minWidth}px;
					`}
				>
					{renderHeader?.(false) ?? <></>}

					{!hideEditButton && (
						<Flex
							alignItems="center"
							justifyContent="center"
							flex={1}
							p={2}
							bg="primary"
							css={css`
								min-width: ${EDIT_COL_WIDTH}px;
								max-width: ${EDIT_COL_WIDTH}px;
								padding: 0;
								position: sticky;
								right: 0;
								box-shadow: -2px 0px 8px 1px rgba(0, 0, 0, 0.05);
							`}
						>
							<Flex justifyContent="flex-end" height={headerHeight}></Flex>
						</Flex>
					)}
				</Flex>
			) : (
				<></>
			),
		[renderHeader, minWidth, headerHeight, hideEditButton],
	);

	return (
		<Box
			width={1}
			position="relative"
			overflowX="auto"
			css={css`
				${!borderless &&
				css`
					border: ${data.length < 1
						? `1px solid ${theme.colors.border}`
						: `1px solid ${theme.colors.border}`};
				`}
			`}
		>
			{renderTableHeader(data.length < 1)}
			{isLoading ? (
				<Flex height={300}>
					<Loader />
				</Flex>
			) : (
				<>
					{data.length < 1 ? (
						<>
							{NoResultsComponent ? (
								<>{NoResultsComponent}</>
							) : (
								<Flex
									width={1}
									height="300px"
									alignItems="center"
									justifyContent="center"
									bg="formBg"
								>
									<Text fontSize="xl" fontWeight="600">
										Upozornění! Nebyly nalezeny žádné výsledky. Prosím, zkuste
										jiný dotaz.
									</Text>
								</Flex>
							)}
						</>
					) : (
						<Flex flexDirection="column">
							{data.map((d, i) => (
								<RenderRow key={i} rowIndex={i} />
							))}
						</Flex>
					)}
				</>
			)}
		</Box>
	);
};

export default ClassicTable;
