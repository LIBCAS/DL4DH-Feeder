import { BiBody } from 'react-icons/bi';
import { GiEarthAfricaEurope, GiPorcelainVase } from 'react-icons/gi';
import { HiLibrary, HiVideoCamera } from 'react-icons/hi';
import { IconType } from 'react-icons/lib';
import { MdFormatQuote, MdHome } from 'react-icons/md';
import { TbClock, TbSum } from 'react-icons/tb';

import { ModelsEnum, TagNameEnum } from 'api/models';

export const SIDE_PANEL_WIDTH = 300;

export const LEFT_PANEL_WIDTH = SIDE_PANEL_WIDTH;

export const DEV_ENV = process.env.NODE_ENV !== 'production';

/**APP CONTEXT */
export const APP_CONTEXT = '';

/**TOKENS */
export const ACCESS_TOKEN_CONTEXT = 'feeder-access-token';

export const REFRESH_TOKEN_CONTEXT = 'feeder-refresh-token';

/**OIDC */
export const OIDC_URL = 'TODO';
export const OIDC_REDIRECT_URI = `${window.location.origin}${APP_CONTEXT}/auth`;
export const OIDC_CLIENT_ID = 'TODO';
export const OIDC_CLIENT_SECRET = 'TODO';
export const OIDC_USER_INFO_URL = 'TODO';

//export const MAX_PHOTO_FILE_SIZE = 1048576;
export const BROWSER_MAX_PHOTO_FILE_SIZE = 30971520;
export const BACKEND_MAX_PHOTO_FILE_SIZE = 20971520;

const ModelsTexts: Record<ModelsEnum, string> = {
	ARCHIVAL: 'Archiválie',
	GRAPHICS: 'Grafika',
	MANUSCRIPT: 'Rukopis',
	MAP: 'Mapa',
	MONOGRAPH: 'Kniha',
	PERIODICAL: 'Noviny a časopisy',
	SHEETMUSIC: 'Hudebniny',
	MONOGRAPHUNIT: 'Svazek knih',
};
const ModelsColors: Record<ModelsEnum, string> = {
	ARCHIVAL: 'primary',
	GRAPHICS: 'primary',
	MANUSCRIPT: 'primary',
	MAP: 'modelMap',
	MONOGRAPH: 'modelMonograph',
	PERIODICAL: 'modelPeriodical',
	SHEETMUSIC: 'modelMusic',
	MONOGRAPHUNIT: 'modelMonograph',
};

export const modelToText = (model: ModelsEnum) => {
	const parsed = model.split('/');
	return parsed
		.map(p => ModelsTexts[p.toUpperCase() as ModelsEnum] ?? p)
		.join('/');
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
			return 'Pouze veřejné';
		case 'PRIVATE':
			return 'Pouze neveřejné';
		case 'ALL':
			return 'Všechny';
		default:
			return 'Neznáma hodnota';
	}
};

export const enrichmentToText = (value: string) => {
	switch (value) {
		case 'ENRICHED':
			return 'Pouze obohacené';
		case 'NOT_ENRICHED':
			return 'Pouze neobohacené';
		case 'ALL':
			return 'Všechny';
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

export const PUBLICATION_EXPORT_STORE_KEY = 'feeder-pub-to-export-key';
