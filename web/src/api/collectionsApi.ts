import { useQuery } from 'react-query';

import { api } from 'api';

import { Collection } from './models';

export const useCollections = () =>
	useQuery(['collections-labels'], () =>
		api().get('search/collections').json<Collection[]>(),
	);

export const useCollectionsKramerius = () =>
	useQuery(['collections'], async () => {
		const r = await fetch('https://kramerius5.nkp.cz/search/api/v5.0/vc');
		const data = (await r.json()) as Collection[];
		return data;
	});
