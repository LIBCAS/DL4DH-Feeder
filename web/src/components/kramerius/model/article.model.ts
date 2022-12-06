import { Metadata } from './metadata.model';

export class Article {
	uuid: string;
	title: string;
	policy: string;
	firstPageUuid = '';
	type: string; // none | pdf | pages
	metadata: Metadata | null = null;

	constructor(uuid?: string, title?: string, policy?: string) {
		this.uuid = uuid ?? '';
		this.title = title ?? '';
		this.policy = policy ?? '';
		this.type = 'none';
	}
}
