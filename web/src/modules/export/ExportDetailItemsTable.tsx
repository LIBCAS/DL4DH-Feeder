/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import ClassicTable from 'components/table/ClassicTable';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';

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
							<Text>{row.publicationTitle} </Text>
						</Flex>
						<Flex
							minWidth={180}
							flex={1}
							flexDirection="column"
							alignItems="flex-end"
							justifyContent="flex-end"
						>
							<Text my={1}>{t(`exports:status_enum:${exportDto.status}`)}</Text>
							{row.finished && row.status === 'COMPLETED' && (
								<Text my={1} fontSize="md" css={css``}>
									<IconButton
										onClick={async e => {
											e.stopPropagation();
											const file = await api().get(
												`exports/download/${exportDto.id}/item/${row.id}`,
											);

											const blob = await file.blob();
											const url = URL.createObjectURL(blob);
											downloadFile(
												url,
												`${exportDto?.publicationTitle ?? exportDto.id}-${
													row.publicationTitle
												}.zip`,
											);
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
