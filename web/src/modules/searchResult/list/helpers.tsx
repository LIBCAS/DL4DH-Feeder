import { PublicationDto } from 'api/models';

export type TColumnsLayout = Pick<
	PublicationDto,
	'title' | 'pid' | 'model' | 'availability' | 'date' | 'enriched'
>;

export const rowLayout: Record<keyof TColumnsLayout, number> = {
	title: 3,
	model: 1,
	availability: 0.5,
	date: 0.5,
	enriched: 0,
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
	enriched: { hidden: true },
};

export const colsOrder: (keyof Omit<TColumnsLayout, 'enriched' | 'pid'>)[] = [
	'title',
	'model',
	'date',
	'availability',
];
