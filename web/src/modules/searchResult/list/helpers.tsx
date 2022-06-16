import { TPublication } from 'api/models';

export type TColumnsLayout = Pick<
	TPublication,
	'title' | 'pid' | 'model' | 'availability' | 'date'
>;

export const rowLayout: Record<keyof TColumnsLayout, number> = {
	title: 3,
	model: 1,
	availability: 0.5,
	date: 0.5,
	pid: 0,
};

export const headerLabels: Record<
	keyof TColumnsLayout,
	{ text?: string; hidden?: boolean }
> = {
	title: { text: 'Název' },
	model: { text: 'Typ' },
	availability: { text: 'Dostupnost' },
	date: { text: 'Datum' },

	pid: { hidden: true },
};

export const colsOrder: (keyof TColumnsLayout)[] = [
	'title',
	'model',
	'date',
	'availability',
];
