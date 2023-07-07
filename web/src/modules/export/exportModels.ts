import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type PipeParam = 'n' | 'lemma' | 'pos' | 'msd' | 'join' | '?';
export type TagParam =
	| 'a'
	| 'g'
	| 'i'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 't'
	| 'P'
	| 'T'
	| 'A'
	| 'C';
//| '?';
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
	//	'?',
];

export type NameTagExportOption = {
	id: TagParam;
	labelCode: string;
	label: string;
};

export const nameTagParamsExportOptions: NameTagExportOption[] = [
	{ id: 'a', labelCode: 'NUMBERS_IN_ADDRESSES', label: '' },
	{ id: 'g', labelCode: 'GEOGRAPHICAL_NAMES', label: '' },
	{ id: 'i', labelCode: 'INSTITUTIONS', label: '' },
	{ id: 'm', labelCode: 'MEDIA_NAMES', label: '' },
	{ id: 'n', labelCode: 'NUMBER_EXPRESSIONS', label: '' },
	{ id: 'o', labelCode: 'ARTIFACT_NAMES', label: '' },
	{ id: 'p', labelCode: 'PERSONAL_NAMES', label: '' },
	{ id: 't', labelCode: 'TIME_EXPRESSIONS', label: '' },
	// TODO temporary disabled, because K+ is not able to process them
	// { id: 'P', labelCode: 'COMPLEX_PERSON_NAMES', label: '' },
	// { id: 'T', labelCode: 'COMPLEX_TIME_EXPRESSION', label: '' },
	// { id: 'A', labelCode: 'COMPLEX_ADDRESS_EXPRESSION', label: '' },
	// { id: 'C', labelCode: 'COMPLEX_BIBLIO_EXPRESSION', label: '' },
];

export const useNameTagParamExportOptions = () => {
	const { t } = useTranslation();
	return useMemo(
		() => ({
			nameTagParamsExportOptions: nameTagParamsExportOptions.map(ntp => ({
				...ntp,
				label: t(`nametag:labels.${ntp.labelCode}`) ?? '',
			})),
			labelFromOption: (item: NameTagExportOption | null) =>
				item ? item.label : '',
		}),

		[t],
	);
};

export const altoParamsOptions: AltoParam[] = [
	'height',
	'width',
	'vpos',
	'hpos',
	//'?',
];

export const parseFieldOptions = (
	fieldIds?: string[],
): ExportFieldOption[] | undefined =>
	fieldIds && fieldIds?.length > 0
		? (fieldIds.map(id =>
				exportFieldOptions.find(fo => fo.id === id),
		  ) as ExportFieldOption[])
		: undefined;
