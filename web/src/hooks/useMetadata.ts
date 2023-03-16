import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQueries } from 'react-query';
import { useTranslation } from 'react-i18next';
import { uniqWith } from 'lodash-es';

import { Author, Metadata } from 'components/kramerius/model/metadata.model';
import { ModsParserService } from 'components/kramerius/modsParser/modsParserService';

import { api } from 'api';

import { PublicationContext } from 'api/models';
import { usePublicationDetail } from 'api/publicationsApi';

const bibApi = async (pid: string) =>
	await api()
		.get(`item/${pid}/streams/BIBLIO_MODS`, {
			headers: { accept: 'application/json' },
		})
		.then(async r => await r.text());

export const useFullContextMetadata = (context: PublicationContext[]) => {
	const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
	const [parsed, setParsed] = useState(false);
	const mqueries = useQueries(
		context.map(ctx => ({
			queryKey: ['stream-with-parse', ctx.pid, 'BIBLIO_MODS'],
			queryFn: async () => {
				const mod = bibApi(ctx.pid);
				return { pid: ctx.pid, model: ctx.model, mods: mod };
			},
		})),
	);

	const isLoading = useMemo(() => mqueries.some(q => q.isLoading), [mqueries]);

	useEffect(() => {
		if (!isLoading && !parsed) {
			const metadata: Record<string, Metadata> = {};
			console.log('parsing');
			mqueries.forEach(({ data }) => {
				if (data) {
					const pservice = new ModsParserService();
					const parsed = pservice.parse(data.mods, data.pid);
					metadata[data.model] = parsed;
				}
			});
			setMetadata(metadata);
			setParsed(true);
		}
	}, [isLoading, mqueries, parsed]);

	return { metadata, isLoading };
};

const mapTitle = {
	monograph: { label: 'kniha', key: 'title' },
	monographunit: { label: 'kniha zo zvazku', key: 'title' }, // tu treba cekovat aj partName a partNumber a potom dalsie titles v poli
	periodical: { label: 'periodikum', key: 'title' },
	periodicalvolume: { label: 'rocnik', key: 'partNumber' },
	periodicalitem: { label: 'cislo', key: 'partNumber' },
	page: { label: 'strana', key: 'partNumber' },
};

const mapPartInfo = {
	monograph: 'unit',
	monographunit: 'unit',
	periodical: '',
	periodicalvolume: 'volume',
	periodicalitem: 'issue',
	page: 'page',
};

type FormattedMetadata = {
	id: string;
	data: ({
		label: string;
		value: string[];
		empty?: boolean;
	} & (
		| { link?: false }
		| { link: true; getLink: (itemIndex: number) => string }
	))[];
}[];

export type FormattedBibliohraphy = {
	model: string;
	pid: string;
	data: FormattedMetadata;
	titles: {
		mainTitle: string;
		mainSubTitle: string;
		otherTitles: {
			mainTitle: string;
			subTitle: string;
		}[];
	} | null;
	authors: { primaryAuthors: Author[]; otherAutors: Author[] };
	parts: {
		mainPartNumber: string;
		mainPartName: string;
		otherTitles: {
			partNumber: string;
			partName: string;
		}[];
		label: string;
	} | null;
	year?: number[];
	metadata: Metadata;
};

export const useMetadataFormatter = () => {
	const { t } = useTranslation();

	const formatMetadata = useCallback(
		(m: Metadata): FormattedMetadata => {
			const result: FormattedMetadata = [];
			const {
				locations,
				publishers,
				keywords,
				languages,
				geonames,
				physicalDescriptions,
				contents,
				notes,
				extent,
			} = m;

			if (publishers && publishers.length > 0) {
				result.push({
					id: 'publishers',
					data: [
						{
							value: publishers.map(p => p.fullDetail()),
							label: t('metadata:publisher'),
							empty: publishers && publishers.length === 0,
						},
					],
				});
			}
			if (publishers && publishers.length > 0) {
				result.push({
					id: 'keywords',
					data: [
						{
							value: keywords,
							label: t('metadata:keywords'),
							link: true,
							empty: keywords && keywords.length === 0,
							getLink: (itemIndex: number) =>
								`/search?keywords=${keywords[itemIndex]}`,
						},
					],
				});
			}
			if (geonames && geonames.length > 0) {
				result.push({
					id: 'geonames',
					data: [
						{
							value: geonames,
							label: t('metadata:geonames'),
							empty: geonames && geonames.length === 0,
						},
					],
				});
			}
			if (languages && languages.length > 0) {
				result.push({
					id: 'languages',
					data: [
						{
							value: languages.map(item => t(`language:${item}`)),
							label: t('metadata:languages'),
							link: true,
							getLink: (itemIndex: number) =>
								`/search?languages=${languages[itemIndex]}`,
							empty: languages && languages.length === 0,
						},
					],
				});
			}
			if (extent) {
				result.push({
					id: 'extent',
					data: [
						{
							value: [extent],
							label: t('metadata:extent'),
						},
					],
				});
			}
			if (locations && locations.length > 0) {
				result.push({
					id: 'locations',
					data: [
						{
							label: t('metadata:location'),
							value: [
								...locations.map(l => t(`sigla:${l.physicalLocation}`)),
								...locations.map(l =>
									t('metadata:shelf_locator', {
										shelf_locator: l.shelfLocator,
									}),
								),
							],
							empty: locations && locations.length === 0,
						},
					],
				});
			}
			if (physicalDescriptions && physicalDescriptions.length > 0) {
				result.push({
					id: 'physicalDescriptions',
					data: [
						{
							value: [
								...physicalDescriptions.map(p =>
									p.extent ? `${t('metadata:extent')}: ${p.extent}` : '',
								),
								...physicalDescriptions.map(p => (p.note ? p.note : '')),
							],
							label: t('metadata:physical_description'),
							empty: physicalDescriptions && physicalDescriptions.length === 0,
						},
					],
				});
			}
			if (contents && contents.length > 0) {
				result.push({
					id: 'contents',
					data: [
						{
							value: contents,
							label: t('metadata:content'),
							empty: contents && contents.length === 0,
						},
					],
				});
			}
			if (notes && notes.length > 0) {
				result.push({
					id: 'notes',
					data: [
						{
							value: notes,
							label: t('metadata:notes'),
							empty: notes && notes.length === 0,
						},
					],
				});
			}

			return result;
		},
		[t],
	);

	const getTitles = useCallback((m: Metadata) => {
		const { titles } = m;
		if (!titles || titles.length === 0) {
			return null;
		}
		const mainTitle = (titles[0]?.title ?? '') as string;
		const mainSubTitle = (titles[0]?.subTitle ?? '') as string;
		const otherTitles = titles.slice(1).map(t => ({
			mainTitle: t.title as string,
			subTitle: t.subTitle as string,
		}));
		return { mainTitle, mainSubTitle, otherTitles };
	}, []);

	const getPartsInfo = useCallback(
		(m: Metadata, model: string) => {
			const { titles } = m;
			if (!titles || titles.length === 0) {
				return null;
			}
			const label = `${t(`metadata:${mapPartInfo[model]}`)}`;
			const mainPartNumber = (titles[0]?.partNumber ?? '') as string;
			const mainPartName = (titles[0]?.partName ?? '') as string;
			const otherTitles = titles.slice(1).map(t => ({
				partNumber: t.partNumber as string,
				partName: t.partName as string,
			}));
			return { mainPartNumber, mainPartName, otherTitles, label };
		},
		[t],
	);

	const getAuthors = useCallback((m: Metadata) => {
		const primaryAuthors = m.getPrimaryAuthors();
		const otherAutors = m.getOtherAuthors();
		return { primaryAuthors, otherAutors };
	}, []);

	const format = useCallback(
		(fcm: FullContextMetadata): FormattedBibliohraphy[] => {
			// uniqWith - filter out duplicates which may be in context (when there are internal parts)
			return uniqWith(fcm ?? [], (a, b) => a.pid === b.pid).map(m => ({
				model: m.model,
				pid: m.pid,
				data: formatMetadata(m.metadata),
				titles: getTitles(m.metadata),
				parts: getPartsInfo(m.metadata, m.model),
				year: m.metadata.getYearRange(),
				authors: getAuthors(m.metadata),
				metadata: m.metadata,
			}));
		},
		[formatMetadata, getAuthors, getPartsInfo, getTitles],
	);

	return { formatMetadata, getTitles, getPartsInfo, getAuthors, format };
};

export type FullContextMetadata = {
	pid: string;
	metadata: Metadata;
	model: string;
	xml: string;
}[];

const useMetadata = (uuid: string) => {
	const publication = usePublicationDetail(uuid);
	const pageTitle =
		publication.data?.model === 'page' ? publication.data?.title : undefined;
	const mqueries = useQueries(
		(publication?.data?.context ?? []).flat().map((ctx, index) => ({
			queryKey: ['stream-with-parse', ctx.pid, 'BIBLIO_MODS'],
			queryFn: async () => {
				const mod = await bibApi(ctx.pid);
				return { pid: ctx.pid, model: ctx.model, mods: mod };
			},
		})),
	);
	const isLoading = useMemo(
		() => mqueries.some(q => q.isLoading) || publication.isLoading,
		[mqueries, publication],
	);
	const fcm = useMemo(() => {
		if (!isLoading) {
			const metadata: FullContextMetadata = [];
			mqueries.forEach(({ data }) => {
				if (data) {
					const pservice = new ModsParserService();
					const parsed = pservice.parse(data.mods, data.pid);
					metadata.push({
						model: data.model,
						pid: data.pid,
						xml: data.mods,
						metadata: parsed,
					});
				}
			});
			return metadata;
		} else {
			return [];
		}
	}, [isLoading, mqueries]);

	return { isLoading, fcm, pageTitle };
};

export default useMetadata;
