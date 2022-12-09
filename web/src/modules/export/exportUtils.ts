import { useMemo, useState, useEffect } from 'react';
import { useQueries } from 'react-query';

import { api } from 'api';

import { StreamsRecord } from 'api/publicationsApi';
import { PublicationChild } from 'api/models';

import { useBulkExportContext, UuidHeap } from 'hooks/useBulkExport';

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
export const useCheckAltoStreams2 = (uuidHeap: UuidHeap) => {
	console.log('checking alto');

	// do not check periodicals, always allow ALTO export on periodicals
	const uuids = Object.keys(uuidHeap)
		.filter(k => uuidHeap[k].selected)
		.filter(k => !uuidHeap[k].model?.includes('periodical'));

	const [result, setResult] = useState<{
		allHaveAlto: boolean;
		uuidsWithoutAlto: string[];
	}>({ allHaveAlto: true, uuidsWithoutAlto: [] });
	console.log({ result, uuids });
	const [isLoading, setIsLoading] = useState(true);
	const [children, setChildren] = useState<Record<string, PublicationChild>>(
		{},
	);

	const childrenQueries = useQueries(
		uuids.map(uuid => ({
			queryKey: ['children', uuid],
			queryFn: async () => {
				const childrenList = await api()
					.get(`item/${uuid}/children`, {
						headers: { accept: 'application/json' },
					})
					.json<PublicationChild[]>();
				setChildren(p => ({ ...p, [uuid]: childrenList[0] }));
			},
		})),
	);
	const altoUuids = useMemo(
		() =>
			Object.keys(children)
				.filter(k => children[k].datanode)
				.map(k => ({ childUuid: children[k].pid, parentUuid: k })),
		[children],
	);
	const altoQueries = useQueries(
		altoUuids.map(({ childUuid: uuid, parentUuid }) => ({
			queryKey: ['stream-list', uuid],
			queryFn: async () => {
				const list = await api()
					.get(`item/${uuid}/streams`, {
						headers: { accept: 'application/json' },
					})
					.json<StreamsRecord>();
				if (
					!Object.keys(list ?? {}).find(key => key === 'ALTO' || key === 'alto')
				) {
					setResult(p => ({
						allHaveAlto: false,
						uuidsWithoutAlto: [...p.uuidsWithoutAlto, parentUuid],
					}));
				}
			},
		})),
	);

	useEffect(() => {
		setIsLoading(
			childrenQueries.some(q => q.isLoading) ||
				altoQueries.some(q => q.isLoading),
		);
	}, [childrenQueries, altoQueries]);

	return { result, isLoading };
};

//without caching
export const useCheckAltoStreams = (uuidHeap2: UuidHeap) => {
	console.log('checking alto 2');

	// do not check periodicals, always allow ALTO export on periodicals

	const { uuidHeap } = useBulkExportContext();
	const uuids = useMemo(
		() =>
			Object.keys(uuidHeap)
				.filter(k => uuidHeap[k].selected)
				.filter(k => !uuidHeap[k].model?.includes('periodical')),
		[uuidHeap],
	);

	const [result, setResult] = useState<{
		allHaveAlto: boolean;
		uuidsWithoutAlto: string[];
	}>({ allHaveAlto: true, uuidsWithoutAlto: [] });
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const checkAltoStreams = async () => {
			const getChildren = async (uuid: string) =>
				await api()
					.get(`item/${uuid}/children`, {
						headers: { accept: 'application/json' },
					})
					.json<PublicationChild[]>();
			const checkStream = async (uuid: string) =>
				await api()
					.get(`item/${uuid}/streams`, {
						headers: { accept: 'application/json' },
					})
					.json<StreamsRecord>();

			setIsLoading(true);
			for (const uuid of uuids) {
				const children = await getChildren(uuid);
				const streams = await checkStream(children?.[0]?.pid);
				if (
					!Object.keys(streams ?? {}).find(
						key => key === 'ALTO' || key === 'alto',
					)
				) {
					setResult(p => ({
						allHaveAlto: false,
						uuidsWithoutAlto: p.uuidsWithoutAlto.find(id => id === uuid)
							? p.uuidsWithoutAlto
							: [...p.uuidsWithoutAlto, uuid],
					}));
				}
			}
			setIsLoading(false);
		};
		checkAltoStreams();
	}, [uuids]);

	return { result, isLoading };
};
