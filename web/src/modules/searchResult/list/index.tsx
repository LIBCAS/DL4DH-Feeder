/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { FC, useCallback } from 'react';
import useMeasure from 'react-use-measure';

import { Flex } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';
import Table from 'components/table';
import Text from 'components/styled/Text';

import { ArrowDownIcon, ArrowUpIcon } from 'assets';
import { getDateString } from 'utils';

import { Backend } from 'api/endpoints';
import { TPublication } from 'api/models';

import { useSearchContext } from 'hooks/useSearchContext';

import {
	colorFromStatus,
	readingStateText,
	readingStateTextCustomer,
} from 'utils/enumsMap';

import { colsOrder, headerLabels, rowLayout, TColumnsLayout } from './helpers';
import useAdminFilter from './useAdminFilter';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

export const StateBadge: FC<{ state?: Backend.ReadingState; admin?: boolean }> =
	({ state, admin }) => {
		const color = state ? colorFromStatus[state] : 'textLight';
		// eslint-disable-next-line no-nested-ternary
		const label = state
			? admin
				? readingStateText[state]
				: readingStateTextCustomer[state]
			: 'Neznámy';
		return (
			<Flex
				px={1}
				color={color}
				css={css`
					background: linear-gradient(
							0deg,
							rgba(255, 255, 255, 0.9),
							rgba(255, 255, 255, 0.9)
						),
						${color};
					border: 1px solid rgba(255, 255, 255, 0.5);
					box-sizing: border-box;
					border-radius: 4px;
				`}
			>
				<Text
					css={css`
						text-overflow: ellipsis;
						overflow: hidden;
					`}
				>
					{label}
				</Text>
			</Flex>
		);
	};

const renderCell = (row: TColumnsLayout, cellKey: keyof TColumnsLayout) => {
	/* if (cellKey === 'toExport') {
		return <Checkbox />;
	} */

	/* if (cellKey === 'published') {
		return <Cell>{getDateString(row[cellKey]) ?? '--'}</Cell>;
	} */
	if (cellKey === 'published') {
		return <Cell>{getDateString(row[cellKey]) ?? '--'}</Cell>;
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
	count: number;
	isLoading: boolean;
	hasMore: boolean;
}> = ({ data, count, isLoading, hasMore }) => {
	const [wrapperRef, { height: filterHeight }] = useMeasure({
		debounce: 200,
	});

	const { state, dispatch } = useSearchContext();

	const setPageLimit = useCallback(
		(p: number) => dispatch?.({ type: 'setPageSize', pageSize: p }),
		[dispatch],
	);

	const { params, filters, sort } = useAdminFilter();
	const offset = state?.offset ?? 0;
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
					onClick={() => {
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
					}
				>
					<Cell>{headerLabels[cellKey].text}</Cell>

					{sort.selected.key === cellKey &&
						(sort.selected.order === 'ASC' ? (
							<ArrowDownIcon ml={2} />
						) : (
							<ArrowUpIcon ml={2} />
						))}
				</Flex>
			)),
		[sort],
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
