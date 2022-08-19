/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useKeycloak } from '@react-keycloak/web';
import { FC, useState } from 'react';
import { MdArrowDropDown, MdDownload } from 'react-icons/md';

import MyAccordion from 'components/accordion';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1, H3 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import Pagination from 'components/table/Pagination';

import { api } from 'api';

import { ExportListParams, useExportList } from 'api/exportsApi';

import { ExportJobStatusToText } from 'utils/enumsMap';

const ExportsDashboard = () => {
	const { keycloak } = useKeycloak();
	console.log({ keycloak });

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
					<Flex alignItems="center" justifyContent="space-between">
						<H1
							my={3}
							textAlign="left"
							color="#444444!important"
							fontWeight="normal"
						>
							Exporty
						</H1>

						<Text>
							Uzivatel:{' '}
							{keycloak?.idTokenParsed?.preferred_username ?? 'neznamy'}
						</Text>
						<Button
							variant="primary"
							onClick={async () => {
								keycloak.clearToken();
								await api().get('user/logout');
							}}
						>
							Odlasit
						</Button>
					</Flex>

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
		size: 5,
		page: 0,
	});
	const response = useExportList(params);
	const data = response.data?.content ?? [];

	return (
		<Box width={1}>
			<Button variant="primary" my={3} onClick={() => response.refetch()}>
				Aktualizovat seznam
			</Button>
			<Flex
				width={1}
				maxHeight={'calc(80vh - 200px)'} //TODO: FIXME: vyroiesit overflow ked sa expanduju akordeony
				css={css`
					box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.03);
				`}
			>
				<ClassicTable
					data={data}
					isLoading={response.isLoading}
					//rowHeight={40}
					renderRow={row => (
						<Flex width={1} alignItems="center" px={2} minHeight={40}>
							<MyAccordion
								hideArrow
								headerCss={css`
									padding: 0;
									padding-top: 16px;
									padding-bottom: 16px;
									width: 100%;
								`}
								label={
									<>
										<Box flex={3}>{row.publicationId}</Box>
										<Box flex={2}>
											{row.created
												? new Date(row.created).toLocaleDateString()
												: '--'}
										</Box>
										<Box flex={2}>{ExportJobStatusToText[row.status]}</Box>
										<Box flex={0.5} maxWidth={100}>
											{row.status === 'COMPLETED' && (
												<IconButton
													onClick={() =>
														window.open(
															`${window.origin}/api/exports/download/${row.id}`,
														)
													}
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
									</>
								}
							>
								<Box py={3} minHeight={100}>
									<Divider mb={3} opacity={0.5} />
									<H3>Podrobnosti</H3>
									<Text color="#757575" fontSize="sm">
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Nobis nemo error, debitis perferendis delectus voluptas
										animi facere placeat facilis, quidem sunt voluptate expedita
										illum libero. Autem quae voluptates sed praesentium rerum
										natus quisquam ullam! Veritatis neque voluptas ipsa id
										provident unde quo harum repudiandae, numquam, nam rerum.
										Vel, officia nesciunt!
									</Text>
								</Box>
							</MyAccordion>
						</Flex>
					)}
					renderHeader={() => (
						<Flex width={1} alignItems="center" px={2} position="sticky">
							<HeaderCell
								flex={3}
								field="publicationId"
								updateParams={setParams}
								params={params}
								label="ID publikace"
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

							<Box flex={0.5} maxWidth={100}>
								Akce
							</Box>
						</Flex>
					)}
					hideEditButton
					rowWrapperCss={css`
						border: none !important;
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
						limitOptions={[2, 3, 5, 10, 15]}
						localStorageKey="feeder-export-list-pagination"
					/>
				</Flex>
			)}
		</Box>
	);
};

export default ExportsDashboard;
