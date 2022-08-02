/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdDownload } from 'react-icons/md';
import { useState } from 'react';

import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Flex } from 'components/styled';
import ClassicTable from 'components/table/ClassicTable';
import IconButton from 'components/styled/IconButton';
import Tabs from 'components/tabs';
import Button from 'components/styled/Button';

import { Loader } from 'modules/loader';

import { api } from 'api';

import { useExportList, useJobsList } from 'api/exportsApi';

const ExportsDashboard = () => {
	const [activeTab, setActiveTab] = useState<'JOBS' | 'EXPORTS'>('JOBS');

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
							{activeTab === 'JOBS' ? 'Úlohy' : 'Exporty'}
						</H1>
						<Button
							variant="text"
							onClick={() => {
								try {
									const response = api()
										.get('user/me', { redirect: 'follow' })
										.then(r => console.log({ r: r.json() }));
								} catch (error) {
									console.log({ error });
								}
							}}
						>
							{'api/user/me'}
						</Button>
						<Flex>
							<Tabs
								tabs={[
									{
										key: 'JOBS',
										jsx: (
											<Button
												py={1}
												variant={activeTab === 'JOBS' ? 'primary' : 'outlined'}
											>
												Úlohy
											</Button>
										),
									},
									{
										key: 'EXPORTS',
										jsx: (
											<Button
												py={1}
												variant={
													activeTab === 'EXPORTS' ? 'primary' : 'outlined'
												}
											>
												Exporty
											</Button>
										),
									},
								]}
								activeTab="JOBS"
								setActiveTab={key => setActiveTab(key as 'JOBS' | 'EXPORTS')}
								tabsDivider={<Box px={1}></Box>}
							/>
						</Flex>
					</Flex>
					<Flex
						width={1}
						maxHeight={'80vh'}
						css={css`
							box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.03);
						`}
					>
						{activeTab === 'JOBS' ? <JobsList /> : <Exportslist />}
					</Flex>
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
		<ClassicTable
			data={response.data?.results ?? []}
			rowHeight={40}
			renderRow={row => (
				<Flex width={1} alignItems="center" px={2}>
					<Box flex={3}>{row.publicationTitle}</Box>
					<Box flex={2}>
						{row.created ? new Date(row.created).toLocaleDateString() : '--'}
					</Box>
					<Box flex={0.5} maxWidth={100}>
						<IconButton>
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
					<Box flex={3}>Název publikace</Box>
					<Box flex={2}>Vytvořeno</Box>
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
	);
};

const JobsList = () => {
	const response = useJobsList();
	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<ClassicTable
			data={response.data?.results ?? []}
			rowHeight={40}
			renderRow={row => (
				<Flex width={1} alignItems="center" px={2}>
					<Box flex={3}>{row.jobName}</Box>
					<Box flex={2}>
						{row.created ? new Date(row.created).toLocaleDateString() : '--'}
					</Box>
					<Box flex={2}>{row.lastExecutionStatus}</Box>
				</Flex>
			)}
			renderHeader={() => (
				<Flex width={1} alignItems="center" px={2} position="sticky">
					<Box flex={3}>Název publikace</Box>
					<Box flex={2}>Vytvořeno</Box>
					<Box flex={2}>Status</Box>
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
	);
};

export default ExportsDashboard;
