export type PipeParam = 'n' | 'lemma' | 'pos' | 'msd' | 'join' | '?';
export type TagParam = 'a' | 'g' | 'i' | 'm' | 'n' | 'o' | 'p' | 't' | '?';
export type AltoParam = 'width' | 'height' | 'vpos' | 'hpos' | '?';

export type ExportFormatOption = { label: string; id: string };
export type ExportFieldOption = { label: string; id: string };

export type ExportSort = {
	field: string;
	direction: 'ASC' | 'DESC';
};
export type ExportFilter = {
	operation: 'OR';
	filters: ExportFilterEQ[];
};

export type ExportFilterEQ = {
	field: string;
	operation: 'EQ';
	value: string;
};

export type Delimiter = ',' | '\t';

export const exportFieldOptions: ExportFieldOption[] = [
	{
		id: 'title',
		label: 'Nadpis',
	},
	{
		id: 'index',
		label: 'Číslo strany',
	},
	{
		id: 'nameTagMetadata',
		label: 'NameTag - úroveň stránky',
	},
	{
		id: 'tokens.ti',
		label: 'Číslo tokenu na stránce',
	},
	{
		id: 'tokens.c',
		label: 'Obsah tokenu',
	},
	{
		id: 'tokens.lm.p',
		label: 'Číslo tokenu vo vete',
	},
	{
		id: 'tokens.lm.l',
		label: 'Lemma',
	},
	{
		id: 'tokens.lm.u',
		label: 'UPosTag',
	},
	{
		id: 'tokens.lm.x',
		label: 'XPosTag',
	},
	{
		id: 'tokens.lm.f',
		label: 'Feats',
	},
	{
		id: 'tokens.ntm',
		label: 'NameTag - úroveň tokenu',
	},
];

export const fieldIdToLabel = (id: string) =>
	exportFieldOptions.find(fo => fo.id === id)?.label ?? 'Neznámy';

export const udPipeParamsOptions: PipeParam[] = [
	'n',
	'lemma',
	'pos',
	'msd',
	'join',
	'?',
];

export const nameTagParamsOptions: TagParam[] = [
	'a',
	'g',
	'i',
	'm',
	'n',
	'o',
	'p',
	't',
];

export const altoParamsOptions: AltoParam[] = [
	'height',
	'width',
	'vpos',
	'hpos',
	'?',
];

export const parseFieldOptions = (
	fieldIds?: string[],
): ExportFieldOption[] | undefined =>
	fieldIds && fieldIds?.length > 0
		? (fieldIds.map(id =>
				exportFieldOptions.find(fo => fo.id === id),
		  ) as ExportFieldOption[])
		: undefined;
