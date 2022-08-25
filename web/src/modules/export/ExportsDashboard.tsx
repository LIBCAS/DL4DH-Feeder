/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { useKeycloak } from '@react-keycloak/web';
import { FC, useState } from 'react';
import { MdArrowDropDown, MdDownload } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import Pagination from 'components/table/Pagination';

import { downloadFile, getDateString } from 'utils';
import { api } from 'api';

import { ExportListParams, useExportList } from 'api/exportsApi';

import { ExportJobStatusToText } from 'utils/enumsMap';

import ExportDetailDialog from './ExportDetailDialog';

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

const ExportsDashboard = () => {
	const { keycloak } = useKeycloak();

	if (!keycloak.authenticated) {
		return (
			<Wrapper
				height="100vh"
				alignItems="flex-start"
				p={[4, 0]}
				width={1}
				bg="paper"
			>
				<Paper color="#444444!important" width="90%">
					<Box mt={3}>
						<H1
							my={3}
							textAlign="left"
							color="#444444!important"
							fontWeight="normal"
						>
							Pro přístup k této stránce je nutné se přihlásit.
						</H1>
						<Button
							variant="primary"
							onClick={() => {
								keycloak.login();
							}}
						>
							Přihlásit se
						</Button>
					</Box>
				</Paper>
			</Wrapper>
		);
	}

	return (
		<Wrapper
			height="100vh"
			alignItems="flex-start"
			p={[4, 0]}
			width={1}
			bg="paper"
		>
			<Paper color="#444444!important" width="90%">
				<Box mt={3}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						Exporty
					</H1>
					<Exportslist />
				</Box>
			</Paper>
		</Wrapper>
	);
};

const HeaderCell: FC<{
	field: string;
	label: string;
	params: ExportListParams;
	updateParams: React.Dispatch<React.SetStateAction<ExportListParams>>;
	flex: number;
}> = ({ flex, field, params, label, updateParams }) => (
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
			tooltip={`Řadit dle ${label}`}
		>
			{label}{' '}
			{params.sort.field === field && (
				<MdArrowDropDown
					size={24}
					css={css`
						transform: rotate(${params.sort.direction === 'ASC' ? 180 : 0}deg);
					`}
				/>
			)}
		</Button>
	</Box>
);

const Exportslist = () => {
	const [params, setParams] = useState<ExportListParams>({
		sort: { field: 'created', direction: 'DESC' },
		size: 10,
		page: 0,
	});
	const [enabled, setEnabled] = useState<string | undefined>(undefined);
	const response = useExportList(params, enabled === undefined);
	const data = response.data?.content ?? [];
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
							onClick={() => setEnabled(row.id)}
							css={css`
								cursor: pointer;
								box-sizing: border-box;
							`}
						>
							<ExportDetailDialog
								exportDto={row}
								isOpen={enabled === row.id}
								onDismiss={() => {
									setEnabled(undefined);
									response.refetch();
								}}
							/>

							<Box flex={3}>
								<Cell>{row.publicationTitle ?? row.publicationId ?? '--'}</Cell>
							</Box>
							<Box flex={2}>
								<Cell>
									{row.created ? getDateString(new Date(row.created)) : '--'}
								</Cell>
							</Box>
							<Box flex={2}>
								<Cell>{ExportJobStatusToText[row.status]}</Cell>
							</Box>
							<Box flex={1}>
								<Cell>{row.format}</Cell>
							</Box>
							<Box flex={1} maxWidth={100}>
								{row.status === 'COMPLETED' && (
									<IconButton
										onClick={async e => {
											e.stopPropagation();
											const file = await api().get(
												`exports/download/${row.id}`,
											);
											const blob = await file.blob();
											const url = URL.createObjectURL(blob);
											downloadFile(url, `${row.id}.zip`);
										}}
									>
										<Flex alignItems="center" pr={1} py={0}>
											<Text my={0} py={0} px={1}>
												Stáhnout
											</Text>{' '}
											<MdDownload size={20} />
										</Flex>
									</IconButton>
								)}
							</Box>
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
							<HeaderCell
								flex={3}
								field="publicationTitle"
								updateParams={setParams}
								params={params}
								label="Název publikace"
							/>
							<HeaderCell
								flex={2}
								field="created"
								updateParams={setParams}
								params={params}
								label="Vytvořeno"
							/>
							<HeaderCell
								flex={2}
								field="status"
								updateParams={setParams}
								params={params}
								label="Status"
							/>
							<HeaderCell
								flex={1}
								field="format"
								updateParams={setParams}
								params={params}
								label="Formát"
							/>

							<Box flex={1} maxWidth={100}>
								Akce
							</Box>
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
						page={(response.data?.pageable.page ?? 0) + 1}
						changePage={page => setParams(p => ({ ...p, page: page - 1 }))}
						changeLimit={limit =>
							limit !== params.size
								? setParams(p => ({ ...p, size: limit }))
								: null
						}
						pageLimit={params.size}
						totalCount={response.data?.totalElements ?? 0}
						hasMore={
							(response.data?.totalPages ?? 0) !==
							(response.data?.pageable.page ?? 0) + 1
						}
						offset={params.page * params.size}
						loading={response.isLoading}
						limitOptions={[10, 20, 30]}
						localStorageKey="feeder-export-list-pagination"
					/>
				</Flex>
			)}
		</Box>
	);
};

export default ExportsDashboard;
