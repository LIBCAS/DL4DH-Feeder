import { Metadata } from './metadata.model';

export class PeriodicalItem {
	title?: string;
	date?: string;
	name?: string;
	number?: string;
	sortNumber?: number;
	sortIndex?: number;
	doctype?: string;
	public?: boolean;
	uuid?: string;
	thumb?: string;
	virtual = false;
	metadata?: Metadata;
	editionType?: string;
	licences?: string[];

	getPath(): string {
		if (this.doctype === 'periodicalvolume') {
			return 'periodical/' + this.uuid;
		} else {
			return 'view/' + this.uuid;
		}
	}

	getTitle(): string {
		const title = this.doctype === 'monographunit' ? this.name : this.date;
		return title ?? '-';
	}

	getDate(): string {
		return this.date ?? '-';
	}

	prettyName() {
		const n = this.doctype === 'monographunit' ? this.name : this.date;
		if (this.number && n) {
			return `${this.number} (${n})`;
		}
		if (this.number) {
			return this.number;
		}
		if (n) {
			return n;
		}
		return '';
	}

	getPart(): string {
		if (!this.number) {
			return '';
		}
		return this.number;
	}

	calcSortNumber() {
		if (!this.number) {
			return 9999999;
		}
		const m = this.number.match(/^\d+/);
		if (m && m.length > 0) {
			return parseInt(m[0]);
		}
		return 9999999;
	}
}
