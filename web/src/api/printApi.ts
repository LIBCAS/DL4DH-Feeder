import { api } from 'api';

//TODO: other parameters
export const callPrintApi = (uuids: string[]) =>
	api().get(`search/localPrintPDF?pids=${uuids.join(',')}`);
