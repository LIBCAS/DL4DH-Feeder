/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { FC, useCallback } from 'react';
import useMeasure from 'react-use-measure';

import { Flex } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';
import Table from 'components/table';
import Text from 'components/styled/Text';

// import { ArrowDownIcon, ArrowUpIcon } from 'assets';
// import { getDateString } from 'utils';

import { TPublication } from 'api/models';

import { modelToText } from 'utils/enumsMap';

import { colsOrder, headerLabels, rowLayout, TColumnsLayout } from './helpers';
// import useAdminFilter from './useAdminFilter';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

const renderCell = (row: TColumnsLayout, cellKey: keyof TColumnsLayout) => {
	/* if (cellKey === 'toExport') {
		return <Checkbox />;
	} */

	/* if (cellKey === 'published') {
		return <Cell>{getDateString(row[cellKey]) ?? '--'}</Cell>;
	} */
	if (cellKey === 'model') {
		return <Cell>{modelToText(row[cellKey]) ?? '--'}</Cell>;
	}
	return <Cell title="cell">{row[cellKey] ?? '--'}</Cell>;
	// return <Cell title={row[cellKey]}>{row[cellKey]}</Cell>;
};

const renderRow = (row: TColumnsLayout) => (
	<>
		{colsOrder.map(cellKey => (
			<Flex
				key={cellKey}
				alignItems="center"
				justifyContent="flex-start"
				flex={rowLayout[cellKey]}
				fontSize="md"
				p={2}
				pl={[2, 3]}
			>
				{renderCell(row, cellKey)}
			</Flex>
		))}
	</>
);

const ListView: FC<{
	data?: TPublication[];
	isLoading: boolean;
}> = ({ data, isLoading }) => {
	const [wrapperRef, { height: filterHeight }] = useMeasure({
		debounce: 200,
	});

	//	const { sort } = useAdminFilter();

	const renderHeader = useCallback(
		() =>
			colsOrder.map(cellKey => (
				<Flex
					key={cellKey}
					alignItems="center"
					justifyContent="flex-start"
					flex={rowLayout[cellKey]}
					p={2}
					pl={[2, 3]}
					fontWeight="bold"
					css={css``}
					/* onClick={() => {
						if (sort.options[cellKey]) {
							sort.setSelected(cellKey);
						}
					}}
					css={css`
						cursor: ${sort.options[cellKey] ? 'pointer' : 'unset'};
					`}
					title={
						sort.options[cellKey]
							? `Zoradiť podľa ${headerLabels[cellKey].text}`
							: ''
					} */
				>
					<Cell>{headerLabels[cellKey].text}</Cell>

					{/* {sort.selected.key === cellKey &&
						(sort.selected.order === 'ASC' ? (
							<ArrowDownIcon ml={2} />
						) : (
							<ArrowUpIcon ml={2} />
						))} */}
				</Flex>
			)),
		[],
	);
	const items = data ?? [];

	return (
		<>
			<Wrapper p={2}>
				<Flex flexDirection="column" position="relative">
					<div ref={wrapperRef}>
						{/* 	<FiltersForm filters={filters} sort={sort} isLoading={isLoading} /> */}
					</div>

					<Table
						data={items as unknown as TColumnsLayout[]}
						isLoading={isLoading}
						renderRow={renderRow}
						renderHeader={renderHeader}
						marginTop={filterHeight}
						minWidth={1500}
					/>
				</Flex>
			</Wrapper>
		</>
	);
};

export default ListView;
