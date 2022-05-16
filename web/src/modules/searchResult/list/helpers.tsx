import React from 'react';
import { MdDateRange, MdInfo, MdLocationCity, MdPerson } from 'react-icons/md';

import { TPublication } from 'api/models';

export type TColumnsLayout = Pick<TPublication, 'title' | 'pid' | 'model'>;

export const rowLayout: Record<keyof TColumnsLayout, number> = {
	title: 3,
	model: 2,

	//authors: 2,
	//published: 1,
	//pages: 1,
	//meta1: 2,
	//meta2: 2,
	//meta3: 2,
	pid: 0,
};

const iconSize = 20;

export const headerLabels: Record<
	keyof TColumnsLayout,
	{ text?: string; icon?: React.ReactNode; hidden?: boolean }
> = {
	title: { text: 'Název', icon: <MdPerson size={iconSize} /> },
	model: { text: 'Typ', icon: <MdPerson size={iconSize} /> },
	/* authors: { text: 'Autor', icon: <MdLocationCity /> },
	published: { text: 'Rok vydání', icon: <MdInfo size={iconSize} /> },
	pages: { text: 'Počet stránek', icon: <MdInfo size={iconSize} /> },
	meta1: { text: 'Metadata 1', icon: <MdInfo size={iconSize} /> },
	meta2: {
		text: 'Metadata 2',
		icon: <MdDateRange size={iconSize} />,
	},
	meta3: {
		text: 'Metadata 3',
		icon: <MdDateRange size={iconSize} />,
	}, */
	pid: { hidden: true },
};

export const colsOrder: (keyof TColumnsLayout)[] = [
	'title',
	'model',
	/*'published',
	'pages',
	'meta1',
	'meta2',
	'meta3', */
];
