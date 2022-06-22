/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { FC, useCallback, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';

import Checkbox from 'components/form/checkbox/Checkbox';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';

import { TPublication } from 'api/models';

import {
	availabilityToTextTag,
	modelToText,
	PUBLICATION_EXPORT_STORE_KEY,
} from 'utils/enumsMap';
import Store from 'utils/Store';

import { colsOrder, headerLabels, rowLayout, TColumnsLayout } from './helpers';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
	color: black;
`;

const renderCell = (row: TColumnsLayout, cellKey: keyof TColumnsLayout) => {
	if (cellKey === 'model') {
		return <Cell>{modelToText(row[cellKey]) ?? '--'}</Cell>;
	}
	if (cellKey === 'availability') {
		return (
			<Cell>{availabilityToTextTag(row[cellKey].toUpperCase()) ?? '--'}</Cell>
		);
	}
	return <Cell title="cell">{row[cellKey] ?? '--'}</Cell>;
};

const ListView: FC<{
	data?: TPublication[];
	isLoading: boolean;
}> = ({ data, isLoading }) => {
	const [wrapperRef, { height: filterHeight }] = useMeasure({
		debounce: 50,
	});

	const [toExport, setToExport] = useState<string | null>(null);
	useEffect(() => {
		Store.set(PUBLICATION_EXPORT_STORE_KEY, toExport);
	}, [toExport]);

	const renderRow = useCallback(
		(row: TColumnsLayout) => (
			<>
				<Flex
					pl={[2, 3]}
					alignItems="center"
					bg={row.pid === toExport ? 'enriched' : 'initial'}
				>
					<Checkbox
						label=""
						checked={row.pid === toExport}
						onChange={() => setToExport(row.pid)}
					/>
				</Flex>
				{colsOrder.map(cellKey => (
					<Flex
						bg={row.pid === toExport ? 'enriched' : 'initial'}
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
		),
		[toExport],
	);

	const renderHeader = useCallback(
		() => (
			<>
				<Flex pl={[2, 3]} alignItems="center">
					<Checkbox label="" colorVariant="inverted" />
				</Flex>
				{colsOrder.map(cellKey => (
					<Flex
						key={cellKey}
						alignItems="center"
						justifyContent="flex-start"
						flex={rowLayout[cellKey]}
						p={2}
						pl={[2, 3]}
						fontWeight="bold"
						color="white"
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
						<Cell color="white!important">{headerLabels[cellKey].text}</Cell>

						{/* {sort.selected.key === cellKey &&
						(sort.selected.order === 'ASC' ? (
							<ArrowDownIcon ml={2} />
						) : (
							<ArrowUpIcon ml={2} />
						))} */}
					</Flex>
				))}
			</>
		),
		[],
	);
	const items = data ?? [];

	return (
		<>
			<Wrapper p={2} position="relative">
				<Flex
					position="absolute"
					height="100%"
					top={0}
					left={0}
					ref={wrapperRef}
				></Flex>
				<Flex
					flexDirection="column"
					position="absolute"
					width="calc(100% - 20px)"
					overflowY="auto"
					overflowX="hidden"
					pr={2}
					height={`calc(${filterHeight}px - 10px)`}
					//height={500}
				>
					<ClassicTable
						data={items as unknown as TColumnsLayout[]}
						isLoading={isLoading}
						renderRow={renderRow}
						renderHeader={renderHeader}
						minWidth={1300}
					/>
				</Flex>
			</Wrapper>
		</>
	);
};

export default ListView;
