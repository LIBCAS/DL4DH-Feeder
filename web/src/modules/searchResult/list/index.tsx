/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { FC, useCallback, useEffect, useState } from 'react';

import Checkbox from 'components/form/checkbox/Checkbox';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';

import { useTheme } from 'theme';

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
	const theme = useTheme();

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
				<Flex pl={[2, 3]} alignItems="center" py={0}>
					<Checkbox label="" colorVariant="inverted" />
				</Flex>
				{colsOrder.map(cellKey => (
					<Flex
						key={cellKey}
						alignItems="center"
						justifyContent="flex-start"
						flex={rowLayout[cellKey]}
						p={1}
						pl={[2, 3]}
						fontWeight="normal"
						color="white"
						css={css``}
					>
						<Cell color="white!important">{headerLabels[cellKey].text}</Cell>
					</Flex>
				))}
			</>
		),
		[],
	);
	const items = data ?? [];

	return (
		<>
			<Wrapper p={0} my={0} position="relative" overflowX="auto">
				<ClassicTable
					borderless
					headerHeight={30}
					data={items as unknown as TColumnsLayout[]}
					isLoading={isLoading}
					renderRow={renderRow}
					renderHeader={renderHeader}
					minWidth={1000}
					rowWrapperCss={css`
						border-bottom: 1px solid ${theme.colors.border};
					`}
				/>
			</Wrapper>
		</>
	);
};

export default ListView;
