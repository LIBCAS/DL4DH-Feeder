/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Box, Flex } from 'components/styled';
import ClassicTable, { Cell } from 'components/table/ClassicTable';
import Button, { NavLinkButton } from 'components/styled/Button';

import { UserRequestDto, UserRequestPartDto } from 'models/user-requests';
import { TableColumn } from 'models/common';

import { usePublicationDetail } from 'api/publicationsApi';

const columns: TableColumn<UserRequestPartDto>[] = [
	{
		datakey: 'publicationId',
		visible: true,
		flex: 4,
		label: 'Publikace',
		CellComponent: function Cell({ row }) {
			const detail = usePublicationDetail(row.publicationId);
			return (
				<Box flex={4}>
					<NavLinkButton
						title={detail.data?.title ?? row.publicationId}
						css={css`
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 95%;
							white-space: nowrap;
							text-align: left;
							justify-content: flex-start;
						`}
						to={`/uuid/${row.publicationId}`}
						target="_blank"
						variant="text"
						mx={0}
						px={0}
					>
						{detail.data?.title ?? row.publicationId}
					</NavLinkButton>
				</Box>
			);
		},
	},
	{
		datakey: 'state',
		visible: true,
		flex: 1,
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
	const { t } = useTranslation();
	const data = detail.parts.map(p => ({
		...p,
		id: p.publicationId,
	}));
	return (
		<Box
			p={3}
			css={css`
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
