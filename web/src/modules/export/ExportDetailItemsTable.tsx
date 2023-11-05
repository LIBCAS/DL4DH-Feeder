/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, MouseEvent } from 'react';
import { MdDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BiLinkExternal } from 'react-icons/bi';

import ClassicTable, { Cell } from 'components/table/ClassicTable';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';
import { NavLinkButton } from 'components/styled/Button';

import { api } from 'api';
import { downloadFile } from 'utils';

import { ExportDto } from 'api/exportsApi';

type Props = {
	exportDto: ExportDto;
};

const ExportDetailItemsTable: FC<Props> = ({ exportDto }) => {
	const { t } = useTranslation();
	const items = exportDto.items;
	if (!items || items.length < 1) {
		return <></>;
	}
	return (
		<>
			<Text>Podrobnosti:</Text>
			<ClassicTable
				data={items}
				rowHeight={60}
				hideEditButton
				minWidth={100}
				renderHeader={() => (
					<Flex width={1} px={3} alignItems="center">
						<Flex flex={3}>
							<Text>Název publikace</Text>
						</Flex>
						<Flex
							flex={1}
							minWidth={180}
							alignItems="flex-end"
							justifyContent="flex-end"
						>
							<Text>Stav / Akce</Text>
						</Flex>
					</Flex>
				)}
				renderRow={row => (
					<Flex
						alignItems="center"
						justifyContent="space-between"
						width={1}
						px={3}
						bg="white"
					>
						<Flex flex={3}>
							<NavLinkButton
								variant="text"
								target="_blank"
								to={`/uuid/${row.publicationId}`}
								px={0}
								mx={0}
								color="text"
								fontSize="md"
								textAlign="left"
								maxWidth={500}
								title={row.publicationTitle}
							>
								<Cell>
									<Text as="span" mr={2}>
										{row.publicationTitle}
									</Text>
								</Cell>
								<Box minWidth={16} maxWidth={16}>
									<BiLinkExternal size={16} />
								</Box>
							</NavLinkButton>
						</Flex>
						<Flex
							minWidth={180}
							flex={1}
							flexDirection="column"
							alignItems="flex-end"
							justifyContent="flex-end"
						>
							<Text my={1}>{t(`exports:status_enum:${row.status}`)}</Text>
							{row.finished &&
								(row.status === 'COMPLETED' || row.status === 'SUCCESSFUL') && (
									<Text my={1} fontSize="md" css={css``}>
										<IconButton
											onClick={async (e: MouseEvent) => {
												e.stopPropagation();
												try {
													const file = await api().get(
														`exports/download/${exportDto.id}/item/${row.id}`,
														{ headers: { Accept: 'application/zip' } },
													);
													const blob = await file.blob();
													const url = URL.createObjectURL(blob);
													downloadFile(
														url,
														`${exportDto?.publicationTitle ?? exportDto.id}-${
															row.publicationTitle
														}.zip`,
													);
												} catch (error) {
													toast.error(
														`Při stahování došlo k chybě: ${
															error as unknown as string
														}`,
													);
												}
											}}
										>
											<Flex
												alignItems="center"
												py={0}
												color="primary"
												fontWeight="bold"
											>
												<Text my={0} py={0} px={1} fontSize="lg">
													{t('exports:exports_dashboard:download')}
												</Text>{' '}
												<MdDownload size={16} />
											</Flex>
										</IconButton>
									</Text>
								)}
						</Flex>
					</Flex>
				)}
			/>
			<Divider my={3} />
		</>
	);
};

export default ExportDetailItemsTable;
