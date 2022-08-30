import { useQuery } from 'react-query';

type Collection = {
	canLeave: boolean;
	descs: {
		cs: string;
		en: string;
	};
	label: string;
	numberOfDocs: number;
	pid: string;
};

export const useCollections = () =>
	useQuery(['collections'], async () => {
		const r = await fetch('https://kramerius5.nkp.cz/search/api/v5.0/vc');
		const data = (await r.json()) as Collection[];
		return data;
	});
