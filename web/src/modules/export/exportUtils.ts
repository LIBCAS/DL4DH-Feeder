import { useMemo, useState, useEffect } from 'react';
import { useQueries } from 'react-query';

import { api } from 'api';

import { StreamsRecord } from 'api/publicationsApi';
import { PublicationChild } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

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

//bez ALTA  http://localhost:3000/view/uuid:0e5a5df0-4462-11dd-aadb-000d606f5dc6

export type AltoCheckProgress = {
	current: number;
	total: number;
	msg: string;
	mode: 'CHILDREN' | 'ALTO';
};

//with caching
export const useCheckAltoStreams = () => {
	// do not check periodicals, always allow ALTO export on periodicals
	const { uuidHeap } = useBulkExportContext();
	const uuids = useMemo(() => {
		return Object.keys(uuidHeap)
			.filter(k => uuidHeap[k].selected)
			.filter(k => !uuidHeap[k].model?.includes('periodical'));
	}, [uuidHeap]);

	const [result, setResult] = useState<{
		allHaveAlto: boolean;
		uuidsWithoutAlto: string[];
	}>({ allHaveAlto: true, uuidsWithoutAlto: [] });

	const [isLoading, setIsLoading] = useState(true);
	const [progress, setProgress] = useState<AltoCheckProgress>({
		current: 0,
		msg: 'Načítání potomků',
		total: uuids.length,
		mode: 'CHILDREN',
	});
	const [altoCounter, setAltoCounter] = useState(0);
	const [childrenCounter, setChildrenCounter] = useState(0);

	const [hasResults, setHasResults] = useState(false);

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
					msg: 'Kontrola dostupnosti ALTO streamů',
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
