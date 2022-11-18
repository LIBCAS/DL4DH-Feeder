import { PublicationDto } from 'api/models';

export type TColumnsLayout = Pick<
	PublicationDto,
	'title' | 'pid' | 'model' | 'availability' | 'date' | 'enriched'
>;

export const rowLayout: Record<keyof TColumnsLayout, number> = {
	title: 3,
	model: 0.5,
	availability: 0.5,
	date: 0.5,
	enriched: 0.3,
	pid: 0,
};

export const headerLabels: Record<
	keyof TColumnsLayout,
	{ translationKey?: string; hidden?: boolean }
> = {
	title: { translationKey: 'title' },
	model: { translationKey: 'model' },
	availability: { translationKey: 'availability' },
	date: { translationKey: 'date' },

	pid: { hidden: true },
	enriched: { translationKey: 'enrichment' },
};

export const colsOrder: (keyof Omit<TColumnsLayout, 'pid'>)[] = [
	'title',
	'model',
	'enriched',
	'date',
	'availability',
];
