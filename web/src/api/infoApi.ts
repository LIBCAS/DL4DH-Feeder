import { useQuery } from 'react-query';

import { api } from 'api';

import { InfoDto } from './models';

export const useInfoApi = () =>
	useQuery('info', () => api().get('info').json<InfoDto>(), {
		staleTime: 600000,
		refetchInterval: 600000,
		refetchOnWindowFocus: false,
		refetchIntervalInBackground: false,
	});
