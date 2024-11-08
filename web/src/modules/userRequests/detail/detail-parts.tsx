/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Box, Flex } from 'components/styled';
import ClassicTable, { Cell } from 'components/table/ClassicTable';
import Button from 'components/styled/Button';

import { useTheme } from 'theme';
import { UserRequestDto, UserRequestPartDto } from 'models/user-requests';
import { TableColumn } from 'models/common';

const columns: TableColumn<UserRequestPartDto>[] = [
	{ datakey: 'publicationId', visible: true, flex: 3, label: 'Publikace' },
	{
		datakey: 'state',
		visible: true,
		flex: 2,
		label: 'Stav',
		dataMapper(row, translate) {
			return translate?.(`requests:state.${row.state}`) ?? '--';
		},
	},
	{ datakey: 'note', visible: true, flex: 3, label: 'Poznámka' },
];

const HeaderCell: FC<{
	label: string;
	flex: number;
}> = ({ flex, label }) => {
	return (
		<Box flex={flex}>
			<Button variant="text" p={0} color="white" fontSize="lg">
				{label}
			</Button>
		</Box>
	);
};

export const UserRequestDetailParts: FC<{ detail: UserRequestDto }> = ({
	detail,
}) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const data = detail.parts.map(p => ({
		...p,
		id: p.publicationId,
	}));
	return (
		<Box
			p={3}
			css={css`
				//border: 1px solid ${theme.colors.border};
				max-height: 500px;
				overflow-y: auto;
				overflow-x: hidden;
			`}
		>
			<ClassicTable
				data={data}
				rowHeight={40}
				NoResultsComponent={<></>}
				hideEditButton
				renderHeader={() => (
					<Flex
						width={1}
						alignItems="center"
						px={2}
						position="sticky"
						fontSize="15px"
						css={css`
							box-sizing: border-box;
						`}
					>
						{columns
							.filter(c => c.visible)
							.map((col, index) => (
								<HeaderCell
									key={`${col.datakey}-${index}`}
									flex={col?.flex ?? 0}
									label={col.label ? t(col.label) : ''}
								/>
							))}
					</Flex>
				)}
				renderRow={row => (
					<Flex
						width={1}
						alignItems="center"
						px={2}
						minHeight={40}
						//onClick={() => setOpenDetail(row.id)}
						css={css`
							// cursor: pointer;
							box-sizing: border-box;
							&:hover {
								background-color: rgba(0, 0, 0, 0.05);
							}
						`}
					>
						{columns
							.filter(c => c.visible)
							.map(({ CellComponent, datakey, dataMapper, flex }) => {
								if (CellComponent) {
									return CellComponent({ row });
								} else {
									return (
										<Box flex={flex}>
											<Cell>
												{dataMapper
													? dataMapper(row, t as TFunction<string>)
													: row[datakey] ?? '--'}
											</Cell>
										</Box>
									);
								}
							})}
					</Flex>
				)}
			></ClassicTable>
		</Box>
	);
};