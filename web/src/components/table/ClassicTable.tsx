/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import React, { FC, useCallback, useState } from 'react';

import Text from 'components/styled/Text';
import { Box, Dot, Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Checkbox from 'components/form/checkbox/Checkbox';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

/** FLAGS */

const EDIT_COL_WIDTH = 60;

/** Types */

type TableItem = {
	pid?: string;
};

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
	height?: number;
	hideEditButton?: boolean;
};

/** Table implementation */

const Table2 = <T extends TableItem>({
	data,
	renderRow,
	renderHeader,
	minWidth = 1000,
	headerHeight = 40,
	//rowHeight = 40,
	isLoading,
	hideEditButton,
	height = 500,
}: Props<T>) => {
	const theme = useTheme();
	const [tempAllChecked, setTempAllChecked] = useState(false);
	const RenderRow: FC<{ rowIndex: number }> = ({ rowIndex }) => (
		<Flex
			css={css`
				min-width: ${minWidth}px;
				border-bottom: 1px solid ${theme.colors.primary};
				border-left: 1px solid ${theme.colors.primary};
				border-right: 1px solid ${theme.colors.primary};

				background-color: ${rowIndex % 2
					? theme.colors.tableRowEven
					: theme.colors.tableRow};
				&:hover,
				&:hover .table-row-edit-button {
					background-color: ${theme.colors.primaryBright};
					color: white;
				}
				&:hover .table-row-three-dots {
					cursor: pointer;
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
						right: -1px;
						background-color: ${rowIndex % 2
							? theme.colors.tableRowEven
							: theme.colors.tableRow};
						/* border-left: 1px solid white; */

						box-shadow: -6px 0px 4px rgba(0, 0, 0, 0.05);
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
		(isEmpty?: boolean) => (
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
				<Flex mt={2} mx={2}>
					<Checkbox
						checked={tempAllChecked}
						onChange={() => setTempAllChecked(p => !p)}
						colorVariant="inverted"
					/>
				</Flex>
				{renderHeader(false)}

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
						box-shadow: -6px 0px 4px rgba(0, 0, 0, 0.05);
					`}
				>
					<Flex justifyContent="flex-end" height={headerHeight}></Flex>
				</Flex>
			</Flex>
		),
		[renderHeader, minWidth, headerHeight],
	);

	return (
		<Box
			width={1}
			position="relative"
			overflowX="auto"
			css={css`
				border: ${data.length < 1
					? `1px solid ${theme.colors.border}`
					: `1px solid white`};
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
						<Flex
							width={1}
							height="300px"
							alignItems="center"
							justifyContent="center"
							bg="formBg"
						>
							<Text fontSize="xl" fontWeight="600">
								Nenašli sa žiadne záznamy.
							</Text>
						</Flex>
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

export default Table2;
