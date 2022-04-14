import React from 'react';
import { MdDateRange, MdInfo, MdLocationCity, MdPerson } from 'react-icons/md';

import { Backend } from 'api/endpoints';

export type TColumnsLayout = Pick<
	Backend.Reading,
	| 'barcode'
	| 'deliveryPoint'
	| 'record1'
	| 'state'
	| 'created'
	| 'definiteEvaluation'
	| 'id'
	| 'customer'
> &
	Partial<Pick<Backend.Reading, 'record2'>>;

export const rowLayout: Record<keyof TColumnsLayout, number> = {
	customer: 2,
	deliveryPoint: 2,
	barcode: 3,
	record1: 2,
	record2: 2,
	definiteEvaluation: 2,
	created: 2,
	state: 3,
	id: 0,
};

const iconSize = 20;

export const headerLabels: Record<
	keyof TColumnsLayout,
	{ text?: string; icon?: React.ReactNode; hidden?: boolean }
> = {
	customer: { text: 'Email odberateľa', icon: <MdPerson size={iconSize} /> },
	deliveryPoint: { text: 'Odberné miesto', icon: <MdLocationCity /> },
	barcode: { text: 'Výrobné číslo', icon: <MdInfo size={iconSize} /> },
	record1: { text: 'Stav 1', icon: <MdInfo size={iconSize} /> },
	record2: { text: 'Stav 2', icon: <MdInfo size={iconSize} /> },
	created: {
		text: 'Dátum odpočtu',
		icon: <MdDateRange size={iconSize} />,
	},
	definiteEvaluation: {
		text: 'Dátum overenia',
		icon: <MdDateRange size={iconSize} />,
	},
	state: { text: 'Stav', icon: <MdInfo size={iconSize} /> },
	id: { hidden: true },
};

export const colsOrder: (keyof TColumnsLayout)[] = [
	'customer',
	'deliveryPoint',
	'barcode',
	'record1',
	'record2',
	'created',
	'definiteEvaluation',
	'state',
];
