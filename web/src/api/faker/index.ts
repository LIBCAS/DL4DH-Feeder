import { v4 as uuid } from 'uuid';

type TRecord = {
	id: string;
	title: string;
	author: string;
	published: Date;
	pages: number;
	meta1: string;
	meta2: string;
	meta3: string;
};

export const fake = {
	authors: [
		'Ondrej Laco',
		'Juraj Vavro',
		'Cyprian Huska',
		'Petr Konsel',
		'Janko Hraško',
		'Augustin Imrich',
		'Karel Capek',
		'Meno Autora',
		'Iny Autor',
		'Dalsie Meno',
		'Haruki Murakami',
		'Franz Kafka',
	],
	title: [
		'Biblia',
		'Titul 123',
		'Encyklopedia',
		'Norske drevo',
		'Kniha stoleti',
		'Titul XYZ',
		'Premena',
		'Dejiny hudby',
		'Historia v kocke',
	],
};

export const randomElement = (array: string[]) =>
	array[Math.floor(Math.random() * array.length)];

export const randomNumber = (min: number) =>
	Math.floor(Math.random() * 100 + min);

export function randomDate(start: Date, end: Date) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime()),
	);
}

export const getMockReading = () => {
	const row = {} as TRecord;
	row.author = randomElement(fake.authors);
	row.title = randomElement(fake.title);
	row.published = randomDate(new Date(1500, 0, 1), new Date());
	row.pages = randomNumber(10);
	row.meta1 = randomString(5);
	row.meta2 = randomString(5);
	row.meta3 = randomString(5);
	row.id = uuid();
	return row;
};

const Records: TRecord[] = [];

const initReadings = (count: number) => {
	for (let i = 0; i < count; i++) {
		Records.push(getMockReading());
	}
	return;
};

export type EASResult<T> = {
	items: T[];
	count: number;
	searchAfter?: string;
};
export const randomString = (length: number) =>
	(Math.random() + 1).toString(36).substring(3).slice(0, length);
export const randomEmail = () =>
	`${randomString(12)}@${randomString(12)}.${randomString(2)}`;

export const getEASMockReadings = (size: number, offset: number) => {
	//const ms = 100;
	const items = Records.slice(offset, offset + size);
	const response = {
		data: items,
		count: Records.length,
		isLoading: false,
		hasMore: offset + (items?.length ?? 0) < Records.length,
		searchAfter: '',
	};
	return response;
	/* return new Promise<{
		data: TPublication[] | undefined;
		count: number;
		page: number;
		hasMore: boolean;
	}>(resolve => setTimeout(resolve, ms, response)); */
};

initReadings(231);

export const getReadingByID = (id: string) => Records.find(r => r.id === id);
