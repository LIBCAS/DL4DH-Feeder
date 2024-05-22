import { TableColumn } from 'models/common';
import { UserRequestListDto } from 'models/user-requests';
import { getDateString } from 'utils';

export const columns: TableColumn<UserRequestListDto>[] = [
	{
		datakey: 'id',
		visible: false,
	},
	{
		datakey: 'created',
		label: 'common:created',
		visible: true,
		flex: 2,
		dataMapper: row =>
			row.created ? getDateString(new Date(row.created)) : '--',
	},
	{
		datakey: 'type',
		label: 'requests:type.label',
		visible: true,
		flex: 3,
		dataMapper: (row, translate) =>
			translate?.(`requests:type.${row.type}`) ?? '--',
	},
	{
		datakey: 'state',
		label: 'requests:state.label',
		visible: true,
		flex: 2,
		dataMapper: (row, translate) =>
			translate?.(`requests:state.${row.state}`) ?? '--',
	},
];
