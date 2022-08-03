/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdDownload } from 'react-icons/md';
import { useKeycloak } from '@react-keycloak/web';

import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Flex } from 'components/styled';
import ClassicTable from 'components/table/ClassicTable';
import IconButton from 'components/styled/IconButton';
import Button from 'components/styled/Button';

import { Loader } from 'modules/loader';

import { useExportList } from 'api/exportsApi';

const ExportsDashboard = () => {
	const { keycloak } = useKeycloak();
	console.log({ keycloak });

	if (!keycloak.authenticated) {
		keycloak.login();
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
					</Flex>

					<Exportslist />
				</Box>
			</Paper>
		</Wrapper>
	);
};

const Exportslist = () => {
	const response = useExportList();
	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<Box>
			<Button variant="primary" my={3} onClick={() => response.refetch()}>
				Aktualizovat seznam
			</Button>
			<Flex
				width={1}
				maxHeight={'80vh'}
				css={css`
					box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.03);
				`}
			>
				<ClassicTable
					data={response.data?.content ?? []}
					rowHeight={40}
					renderRow={row => (
						<Flex width={1} alignItems="center" px={2}>
							<Box flex={3}>{row.publicationId}</Box>
							<Box flex={2}>
								{row.created
									? new Date(row.created).toLocaleDateString()
									: '--'}
							</Box>
							<Box flex={2}>{row.status}</Box>
							<Box flex={0.5} maxWidth={100}>
								<IconButton
									onClick={() =>
										window.open(
											`${window.origin}/api/exports/download/${row.id}`,
										)
									}
								>
									<Flex alignItems="center" pr={1} py={2}>
										<Text my={0} py={0} px={1}>
											Stáhnout
										</Text>{' '}
										<MdDownload size={16} />
									</Flex>
								</IconButton>
							</Box>
						</Flex>
					)}
					renderHeader={() => (
						<Flex width={1} alignItems="center" px={2} position="sticky">
							<Box flex={3}>ID publikace</Box>
							<Box flex={2}>Vytvořeno</Box>
							<Box flex={2}>Status</Box>
							<Box flex={0.5} maxWidth={100}>
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
		</Box>
	);
};

export default ExportsDashboard;
