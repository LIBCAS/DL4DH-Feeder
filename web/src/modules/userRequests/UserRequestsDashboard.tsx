/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { FC, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { MdArrowDropDown } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import Pagination from 'components/table/Pagination';

import { UserRequestType } from 'models/user-requests';
import { PagableParams } from 'models/solr';

import { useUserRequestsList } from 'api/userRequestsApi';

import { columns } from './table/columns';
import UserRequestDetailDialog from './detail/detail';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

const UserRequestsDashboard = () => {
	const { t } = useTranslation('requests');

	return (
		<Wrapper height="100vh" alignItems="flex-start" bg="paper">
			<Box color="#444444!important" width="100%">
				<Box mt={4} mx={4}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						{t('dashboard.title')}
					</H1>
					<UserRequestsList />
				</Box>
			</Box>
		</Wrapper>
	);
};

const HeaderCell: FC<{
	field: string;

	label: string;
	params: PagableParams;
	updateParams: React.Dispatch<React.SetStateAction<PagableParams>>;
	flex: number;
}> = ({ flex, field, params, label, updateParams }) => {
	const { t } = useTranslation('exports');
	return (
		<Box flex={flex}>
			<Button
				variant="text"
				p={0}
				onClick={() =>
					updateParams(p => ({
						...p,
						sort: {
							field,
							direction: p.sort.direction === 'ASC' ? 'DESC' : 'ASC',
						},
					}))
				}
				color="white"
				fontSize="lg"
				tooltip={`${t('exports_dashboard.tooltip_sort_by')} ${label}`}
			>
				{label}{' '}
				{params.sort.field === field && (
					<MdArrowDropDown
						size={24}
						css={css`
							transform: rotate(
								${params.sort.direction === 'ASC' ? 180 : 0}deg
							);
						`}
					/>
				)}
			</Button>
		</Box>
	);
};

const UserRequestsList = () => {
	const [params, setParams] = useState<PagableParams>({
		sort: { field: 'created', direction: 'DESC' },
		size: 10,
		page: 0,
	});
	const [openDetail, setOpenDetail] = useState<string | undefined>(undefined);
	const response = useUserRequestsList({
		params,
		enabled: openDetail === undefined,
		type: UserRequestType.ENRICHMENT,
	});
	const data = response.data?.items ?? [];
	const { t } = useTranslation();
	console.log({ openDetail });
	return (
		<Box width={1}>
			<Flex
				width={1}
				maxHeight="80vh"
				css={css`
					box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.03);
				`}
			>
				<ClassicTable
					data={data}
					isLoading={response.isLoading}
					rowHeight={40}
					renderRow={row => (
						<Flex
							width={1}
							alignItems="center"
							px={2}
							minHeight={40}
							onClick={() => setOpenDetail(row.id)}
							css={css`
								cursor: pointer;
								box-sizing: border-box;
								&:hover {
									background-color: rgba(0, 0, 0, 0.05);
								}
							`}
						>
							<UserRequestDetailDialog
								isOpen={openDetail === row.id}
								onDismiss={() => setOpenDetail(undefined)}
								requestDto={row}
							/>
							{columns
								.filter(c => c.visible)
								.map(({ CellComponent, datakey, dataMapper, flex }) => {
									if (CellComponent) {
										return CellComponent({ row, onClick: setOpenDetail });
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
										field={col.datakey}
										updateParams={setParams}
										params={params}
										label={col.label ? t(col.label) : ''}
									/>
								))}
						</Flex>
					)}
					hideEditButton
					rowWrapperCss={css`
						&:hover {
							background-color: unset;
							color: unset;
						}
					`}
				/>
			</Flex>

			{!response.isLoading && (
				<Flex px={2} my={3}>
					<Pagination
						page={(response.data?.page ?? 0) + 1}
						changePage={page => setParams(p => ({ ...p, page: page - 1 }))}
						changeLimit={limit =>
							limit !== params.size
								? setParams(p => ({ ...p, size: limit }))
								: null
						}
						pageLimit={params.size}
						totalCount={response.data?.total ?? 0}
						hasMore={
							(response.data?.total ?? 0) !== (response.data?.page ?? 0) + 1
						}
						offset={params.page * params.size}
						loading={response.isLoading}
						limitOptions={[10, 20, 30]}
						localStorageKey="feeder-user-requests-list-pagination"
					/>
				</Flex>
			)}
		</Box>
	);
};

export default UserRequestsDashboard;
