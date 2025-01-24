import { useMemo, useState, useEffect } from 'react';
import { useQueries } from 'react-query';
import { useTranslation } from 'react-i18next';

import { api } from 'api';
import { LabeledObject } from 'models/common';
import {
	AltoCheckProgress,
	AltoParam,
	NameTagExportOption,
	PipeParam,
} from 'models/exports';

import { StreamsRecord } from 'api/publicationsApi';
import { PublicationChild } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

export const exportFieldOptions: LabeledObject[] = [
	{
		id: 'title',
		label: '',
	},
	{
		id: 'index',
		label: '',
	},
	{
		id: 'nameTagMetadata',
		label: '',
	},
	{
		id: 'tokens.ti',
		label: '',
	},
	{
		id: 'tokens.c',
		label: '',
	},
	{
		id: 'tokens.lm.p',
		label: '',
	},
	{
		id: 'tokens.lm.l',
		label: '',
	},
	{
		id: 'tokens.lm.u',
		label: '',
	},
	{
		id: 'tokens.lm.x',
		label: '',
	},
	{
		id: 'tokens.lm.f',
		label: '',
	},
	{
		id: 'tokens.ntm',
		label: '',
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

export const useExportIncludeExcludeOptionsLabel = () => {
	const { t } = useTranslation('exports');
	//return { labelFromOption: (id: string) => t(`field_options.${id}`) ?? '' };
	return (id: string) => t(`field_options.${id}`) ?? '';
};

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
): LabeledObject[] | undefined =>
	fieldIds && fieldIds?.length > 0
		? (fieldIds.map(id =>
				exportFieldOptions.find(fo => fo.id === id),
		  ) as LabeledObject[])
		: undefined;

export const generateExportName = () => {
	const formatNumber = (x: number): string => (x < 10 ? `0${x}` : x.toString());
	const date = new Date();
	const yy = formatNumber(date.getFullYear());
	const mm = formatNumber(date.getMonth());
	const dd = formatNumber(date.getDay());
	const hh = formatNumber(date.getHours());
	const mins = formatNumber(date.getMinutes());
	const ss = formatNumber(date.getSeconds());
	return `export-${yy}${mm}${dd}-${hh}${mins}${ss}`;
};

//with caching
export const useCheckAltoStreams = (enabled: boolean) => {
	// do not check periodicals, always allow ALTO export on periodicals
	const { uuidHeap } = useBulkExportContext();
	const { t } = useTranslation();
	const uuids = useMemo(() => {
		return enabled
			? Object.keys(uuidHeap)
					.filter(k => uuidHeap[k].selected)
					.filter(k => !uuidHeap[k].model?.includes('periodical'))
			: [];
	}, [uuidHeap, enabled]);

	const [result, setResult] = useState<{
		allHaveAlto: boolean;
		uuidsWithoutAlto: string[];
	}>({ allHaveAlto: true, uuidsWithoutAlto: [] });

	const [isLoading, setIsLoading] = useState(enabled);
	const [progress, setProgress] = useState<AltoCheckProgress>({
		current: 0,
		msg: t('exports:loading_children') ?? '',
		total: uuids.length,
		mode: 'CHILDREN',
	});
	const [altoCounter, setAltoCounter] = useState(0);
	const [childrenCounter, setChildrenCounter] = useState(0);
	const [hasResults, setHasResults] = useState(false);

	useEffect(() => {
		if (enabled && uuids.length > 0) {
			setIsLoading(true);
			setProgress({
				current: 0,
				msg: t('exports:loading_children') ?? '',
				total: uuids.length,
				mode: 'CHILDREN',
			});
		}
	}, [enabled, t, uuids]);

	const childrenQueries = useQueries(
		uuids.map(uuid => ({
			queryKey: ['children', uuid],
			queryFn: async () => {
				const childrenList = await api()
					.get(`item/${uuid}/children`, {
						headers: { accept: 'application/json' },
						timeout: 60000,
					})
					.json<PublicationChild[]>();

				setChildrenCounter(p => p + 1);

				return childrenList;
			},
		})),
	);
	const altoUuids = useMemo(() => {
		if (childrenQueries.some(q => q.isLoading)) {
			return [];
		}

		if (childrenQueries.some(q => !q.data)) {
			return [];
		}

		const children = childrenQueries
			.filter(q => q?.data?.[0] && q.data[0].datanode)
			.map(q => ({
				childUuid: q?.data?.[0].pid ?? '',
				parentUuid: q?.data?.[0].root_pid ?? '',
			}));

		return children;
	}, [childrenQueries]);

	const altoQueries = useQueries(
		altoUuids.map(({ childUuid: uuid, parentUuid }) => ({
			queryKey: ['stream-list', uuid],
			queryFn: async () => {
				const streams = await api()
					.get(`item/${uuid}/streams`, {
						headers: { accept: 'application/json' },
						timeout: 60000,
					})
					.json<StreamsRecord>();
				setProgress(p => ({
					msg: t('exports:checking_alto_streams') ?? '',
					total: altoUuids.length,
					current: p.current + 1,
					mode: 'ALTO',
				}));

				setAltoCounter(p => p + 1);

				return { streams, parentUuid };
			},
		})),
	);

	useEffect(() => {
		const isLoading =
			childrenQueries.some(q => q.isLoading) ||
			altoQueries.some(q => q.isLoading);
		if (!isLoading && !hasResults) {
			if (childrenQueries.length > 0 && altoQueries.length > 0) {
				const newResult: { allHaveAlto: boolean; uuidsWithoutAlto: string[] } =
					{ allHaveAlto: true, uuidsWithoutAlto: [] };
				altoQueries.forEach(aq => {
					if (aq.data) {
						const { streams, parentUuid } = aq.data;

						const hasAlto = Object.keys(streams ?? {}).find(key => {
							return key === 'ALTO' || key === 'alto';
						});
						if (!hasAlto) {
							newResult.allHaveAlto = false;
							const alreadyInList = newResult.uuidsWithoutAlto.find(
								uuid => uuid === parentUuid,
							);
							if (!alreadyInList) {
								newResult.uuidsWithoutAlto = [
									...newResult.uuidsWithoutAlto,
									parentUuid,
								];
							}
						}
					}
				});

				setHasResults(true);
				setResult(newResult);
			}
			setIsLoading(false);
		}
	}, [childrenQueries, altoQueries, hasResults]);

	return {
		result,
		isLoading,
		progress: {
			...progress,
			current: progress.mode === 'ALTO' ? altoCounter : childrenCounter,
		},
	};
};
