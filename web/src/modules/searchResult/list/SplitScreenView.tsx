/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled/macro';
import { FC, useCallback, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import { useTranslation } from 'react-i18next';

import Text from 'components/styled/Text';
import { Flex } from 'components/styled';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import RadioButton from 'components/styled/RadioButton';
import Checkbox from 'components/form/checkbox/Checkbox';

import { PublicationDto } from 'api/models';

import { modelToText } from 'utils/enumsMap';

import { colsOrder, headerLabels, rowLayout, TColumnsLayout } from './helpers';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
	color: black;
`;

const RenderCell: FC<{
	row: Omit<TColumnsLayout, 'pid'>;
	cellKey: keyof Omit<TColumnsLayout, 'pid'>;
}> = ({ row, cellKey }) => {
	const { t } = useTranslation();
	if (cellKey === 'model') {
		return <Cell>{t(`model:${modelToText(row[cellKey])}`)}</Cell>;
	}

	if (cellKey === 'availability') {
		return <Cell>{t(`common:${row[cellKey]}`)}</Cell>;
	}
	if (cellKey === 'enriched') {
		return (
			<Cell>
				<Checkbox
					checked={row[cellKey]}
					label={t(`common:${row[cellKey] ? 'yes' : 'no'}`)}
				/>
			</Cell>
		);
	}
	return <Cell title={row[cellKey] ?? '--'}>{row[cellKey] ?? '--'}</Cell>;
};

const SplitScreenView: FC<{
	data?: PublicationDto[];
	isLoading: boolean;
	variant: 'left' | 'right';
	onSelect: (uuid: string) => void;
}> = ({ data, isLoading, variant, onSelect }) => {
	const [wrapperRef, { height: filterHeight }] = useMeasure({
		debounce: 200,
	});

	const [selectedRow, setSelectedRow] = useState<number | undefined>(undefined);
	const { t } = useTranslation();

	const renderHeader = useCallback(
		() => (
			<>
				<div style={{ opacity: 0 }}>
					<RadioButton
						pl={[2, 3]}
						name={`header-${variant}`}
						checked={true}
						onChange={() => null}
						size="sm"
					/>
				</div>
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
					>
						<Cell color="white!important">
							{t(`list_view:header.${headerLabels[cellKey].translationKey}`)}
						</Cell>
					</Flex>
				))}
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const renderRow = useCallback(
		(row: TColumnsLayout, rowIndex: number) => (
			<>
				<RadioButton
					pl={[2, 3]}
					name={`radio-${variant}`}
					checked={selectedRow === rowIndex}
					onChange={() => {
						setSelectedRow(rowIndex);
						onSelect(row.pid);
					}}
					size="sm"
					bg={selectedRow === rowIndex ? 'enriched' : 'transparent'}
				/>
				{colsOrder.map(cellKey => (
					<Flex
						key={cellKey}
						bg={selectedRow === rowIndex ? 'enriched' : 'transparent'}
						alignItems="center"
						justifyContent="flex-start"
						flex={rowLayout[cellKey]}
						fontSize="md"
						p={2}
						pl={[2, 3]}
					>
						<RenderCell row={row} cellKey={cellKey} />
					</Flex>
				))}
			</>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedRow, data],
	);
	const items = data ?? [];

	useEffect(() => {
		if (selectedRow === undefined) {
			onSelect(data?.[0]?.pid ?? 'error:multiview search id undefined');
		}
		setSelectedRow(0);
		if (data?.length === 1) {
			onSelect(data?.[0]?.pid ?? '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

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
						minWidth={900}
					/>
				</Flex>
			</Wrapper>
		</>
	);
};

export default SplitScreenView;
