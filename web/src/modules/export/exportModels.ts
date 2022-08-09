/**
 * Param options
 * "?" - means "other character"
 */
export type PipeParam = 'n' | 'lemma' | 'pos' | 'msd' | 'join' | '?';
export type TagParam = 'a' | 'g' | 'i' | 'm' | 'n' | 'o' | 'p' | 't' | '?';
export type AltoParam = 'width' | 'height' | 'vpos' | 'hpos' | '?';

export const fieldOptions = [
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
