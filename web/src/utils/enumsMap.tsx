import { BiBody } from 'react-icons/bi';
import { GiEarthAfricaEurope, GiPorcelainVase } from 'react-icons/gi';
import { HiLibrary, HiVideoCamera } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import { MdFormatQuote, MdHome } from 'react-icons/md';
import { TbClock, TbSum } from 'react-icons/tb';

import { AvailableNameTagFilters, ModelsEnum, TagNameEnum } from 'api/models';
import { JobStatusEnum } from 'api/exportsApi';

export const SIDE_PANEL_WIDTH = 300;

export const LEFT_PANEL_WIDTH = SIDE_PANEL_WIDTH;

export const DEV_ENV = process.env.NODE_ENV !== 'production';

/**APP CONTEXT */
export const APP_CONTEXT = '';

/**TOKENS */
export const ACCESS_TOKEN_CONTEXT = 'feeder-access-token';

export const REFRESH_TOKEN_CONTEXT = 'feeder-refresh-token';

//export const MAX_PHOTO_FILE_SIZE = 1048576;
export const BROWSER_MAX_PHOTO_FILE_SIZE = 30971520;
export const BACKEND_MAX_PHOTO_FILE_SIZE = 20971520;

const ModelsTexts: Record<ModelsEnum, string> = {
	ARCHIVAL: 'model',
	GRAPHICS: 'graphic',
	MANUSCRIPT: 'manuscript',
	MAP: 'map',
	MONOGRAPH: 'monograph',
	PERIODICAL: 'periodical',
	PERIODICALITEM: 'periodicalitem',
	SHEETMUSIC: 'sheetmusic',
	MONOGRAPHUNIT: 'monographunit',
	MONOGRAPHBUNDLE: 'monographbundle',
	PERIODICALVOLUME: 'periodicalvolume',
	INTERNALPART: 'internalpart',
};
const ModelsColors: Record<ModelsEnum, string> = {
	ARCHIVAL: 'primary',
	GRAPHICS: 'primary',
	MANUSCRIPT: 'primary',
	MAP: 'modelMap',
	MONOGRAPH: 'modelMonograph',
	PERIODICAL: 'modelPeriodical',
	PERIODICALITEM: 'modelPeriodical',
	PERIODICALVOLUME: 'modelPeriodical',
	SHEETMUSIC: 'modelMusic',
	MONOGRAPHUNIT: 'modelMonograph',
	MONOGRAPHBUNDLE: 'modelMonograph',
	INTERNALPART: 'modelMonograph',
};

export const modelToText = (model: ModelsEnum) => {
	const parsed = model.split('/');
	return parsed.map(p => ModelsTexts[p.toUpperCase() as ModelsEnum] ?? p);
};

export const modelToColor = (model: ModelsEnum) => {
	const parsed = model.split('/');
	if (parsed.length > 1) {
		return 'black';
	}
	return ModelsColors[parsed[0].toUpperCase() as ModelsEnum];
};
export const availabilityToText = (value: string) => {
	switch (value) {
		case 'PUBLIC':
			return 'search:accessibility:public';
		case 'PRIVATE':
			return 'search:accessibility:private';
		case 'ALL':
			return 'search:accessibility:all';
		default:
			return 'Neznáma hodnota';
	}
};

export const enrichmentToText = (value: string) => {
	switch (value) {
		case 'ENRICHED':
			return 'search:enrichment:enriched_only';
		case 'NOT_ENRICHED':
			return 'search:enrichment:not_enriched_only';
		case 'ALL':
			return 'common:all';
		default:
			return 'Neznáma hodnota';
	}
};

export const availabilityToTextTag = (value: string) => {
	switch (value) {
		case 'PUBLIC':
			return 'Veřejné';
		case 'PRIVATE':
			return 'Neveřejné';
		default:
			return 'Neznáma hodnota';
	}
};

export const NameTagToText: Record<TagNameEnum, string> = {
	NUMBERS_IN_ADDRESSES: 'Čísla v adresách',
	GEOGRAPHICAL_NAMES: 'Zeměpisné názvy',
	INSTITUTIONS: 'Instituce',
	MEDIA_NAMES: 'Názvy médií',
	NUMBER_EXPRESSIONS: 'Kvantitativní výrazy',
	ARTIFACT_NAMES: 'Názvy artefaktů',
	PERSONAL_NAMES: 'Osobní jména',
	TIME_EXPRESSIONS: 'Vyjádření času',
	COMPLEX_PERSON_NAMES: 'Komplexní osobní jména',
	COMPLEX_TIME_EXPRESSION: 'Komplexní vyjádření času',
	COMPLEX_ADDRESS_EXPRESSION: 'Komplexní vyjádření adresy',
	COMPLEX_BIBLIO_EXPRESSION: 'Bibliografické položky',
};

export const NameTagIcon: Record<TagNameEnum, IconType> = {
	NUMBERS_IN_ADDRESSES: MdHome,
	GEOGRAPHICAL_NAMES: GiEarthAfricaEurope,
	INSTITUTIONS: HiLibrary,
	MEDIA_NAMES: HiVideoCamera,
	NUMBER_EXPRESSIONS: TbSum,
	ARTIFACT_NAMES: GiPorcelainVase,
	PERSONAL_NAMES: BiBody,
	TIME_EXPRESSIONS: TbClock,
	COMPLEX_PERSON_NAMES: BiBody,
	COMPLEX_TIME_EXPRESSION: TbClock,
	COMPLEX_ADDRESS_EXPRESSION: MdHome,
	COMPLEX_BIBLIO_EXPRESSION: MdFormatQuote,
};

export const NameTagCode: Record<TagNameEnum, string> = {
	NUMBERS_IN_ADDRESSES: 'A',
	GEOGRAPHICAL_NAMES: 'B',
	INSTITUTIONS: 'C',
	MEDIA_NAMES: 'D',
	NUMBER_EXPRESSIONS: 'E',
	ARTIFACT_NAMES: 'F',
	PERSONAL_NAMES: 'G',
	TIME_EXPRESSIONS: 'H',
	COMPLEX_PERSON_NAMES: 'I',
	COMPLEX_TIME_EXPRESSION: 'J',
	COMPLEX_ADDRESS_EXPRESSION: 'K',
	COMPLEX_BIBLIO_EXPRESSION: 'L',
};

export const NameTagFilterToNameTagEnum: Record<
	keyof AvailableNameTagFilters,
	TagNameEnum
> = {
	artifactNames: 'ARTIFACT_NAMES',
	complexAddressExpression: 'COMPLEX_ADDRESS_EXPRESSION',
	complexBiblioExpression: 'COMPLEX_BIBLIO_EXPRESSION',
	complexPersonNames: 'COMPLEX_PERSON_NAMES',
	complexTimeExpression: 'COMPLEX_TIME_EXPRESSION',
	geographicalNames: 'GEOGRAPHICAL_NAMES',
	institutions: 'INSTITUTIONS',
	mediaNames: 'MEDIA_NAMES',
	numberExpressions: 'NUMBER_EXPRESSIONS',
	numbersInAddresses: 'NUMBERS_IN_ADDRESSES',
	personalNames: 'PERSONAL_NAMES',
	timeExpression: 'TIME_EXPRESSIONS',
};

export const OperationCode: Record<'EQUAL' | 'NOT_EQUAL', string> = {
	EQUAL: 'A',
	NOT_EQUAL: 'B',
};

export const PUBLICATION_EXPORT_STORE_KEY = 'feeder-pub-to-export-key';

export const ModelToText = {
	monograph: 'Kniha',
	monographunit: 'Kniha (unit)',
	monographbundle: 'Svazek knih',
	periodical: 'Noviny a časopisy',
	map: 'Mapa',
	sheetmusic: 'Hudebniny',
	graphic: 'Grafika',
	archive: 'Archiválie',
	soundrecording: 'Zvukové nahrávky',
	periodicalvolume: 'Ročník periodika',
	periodicalitem: 'Číslo periodika',
	clippingsvolume: 'Sbírka výstřižků',
	manuscript: 'Rukopis',
	page: 'Stránka',
	supplement: 'Příloha',
	article: 'Článek',
	internalpart: 'Kapitola',
	soundunit: 'Album',
	track: 'Nahrávka',
	collection: 'Sbírka',
	convolute: 'Konvolut',
};

export const ExportJobStatusToText: Record<JobStatusEnum, string> = {
	COMPLETED: 'Úspěšně dokončen',
	SUCCESSFUL: 'Úspěšně dokončen',
	CREATED: 'Vytvořen',
	ABANDONED: 'Opuštěn',
	FAILED: 'Neúspěšně ukončen',
	STARTED: 'Započatý',
	STARTING: 'Začíná',
	STOPPED: 'Zastaven',
	STOPPING: 'Zastavuje',
	UNKNOWN: 'Neznámý',
};
