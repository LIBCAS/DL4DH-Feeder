import { MdDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Text from 'components/styled/Text';
import { Flex } from 'components/styled';
import IconButton from 'components/styled/IconButton';

import { TableColumn } from 'models/common';
import { downloadFile, getDateString } from 'utils';
import { api } from 'api';
import { ExportDto } from 'models/exports';

export const columns: TableColumn<ExportDto>[] = [
	{
		datakey: 'publicationTitle',

		visible: false,

		label: 'exports_dashboard.export_name',
		flex: 3,
		dataMapper: row => row.publicationTitle ?? row.publicationId,
	},
	{
		datakey: 'created',
		label: 'exports_dashboard.created',
		visible: true,
		flex: 2,
		dataMapper: row =>
			row.created ? getDateString(new Date(row.created)) : '--',
	},
	{
		datakey: 'status',
		label: 'exports_dashboard.status',
		visible: true,
		flex: 2,
		dataMapper: (row, translate) =>
			translate?.(`status_enum.${row.status}`) ?? '--',
	},
	{
		datakey: 'format',
		label: 'exports_dashboard.format',
		visible: true,
		flex: 1,
	},

	{
		datakey: 'util',
		label: 'exports_dashboard.action',
		visible: true,
		flex: 2,
		maxWidth: 250,
		CellComponent: function Cell({ row, ...rest }) {
			const { t } = useTranslation('exports');
			const onClick = _.get(rest, 'openDialog') as (id: string) => void;
			return (
				<Flex flex={2} maxWidth={250} justifyContent="space-between">
					<IconButton onClick={() => onClick?.(row.id)}>
						<Text color="primary" fontSize="lg" px={2}>
							Zobrazit podrobnosti
						</Text>
					</IconButton>
					{(row.status === 'COMPLETED' || row.status == 'SUCCESSFUL') && (
						<IconButton
							onClick={async e => {
								e.stopPropagation();
								try {
									const file = await api().get(`exports/download/${row.id}`, {
										headers: { Accept: 'application/zip' },
									});
									const blob = await file.blob();
									const url = URL.createObjectURL(blob);
									downloadFile(url, `${row.publicationTitle ?? row.id}.zip`);
								} catch (error) {
									toast.error(
										`Při stahování došlo k chybě: ${
											error as unknown as string
										}`,
									);
								}
							}}
						>
							<Flex alignItems="center" pr={1} py={0} color="black">
								<Text my={0} py={2} px={1}>
									{t('exports_dashboard.download')}
								</Text>{' '}
								<MdDownload size={20} />
							</Flex>
						</IconButton>
					)}
				</Flex>
			);
		},
	},
];
