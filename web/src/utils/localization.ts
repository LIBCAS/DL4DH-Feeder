import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type ActiveLanguages = 'cz' | 'en';

export type MultiString = Record<ActiveLanguages, string>;

// Initialize i18n
i18n.use(initReactI18next).init({
	resources: {},
	lng: 'cz',
	fallbackLng: 'cz',

	//	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
});

// Get locales resources from the public folder and add them to i18n
const getLocales = async () => {
	const czRes = await fetch(window.location.origin + '/locales/cz.json');
	const enRes = await fetch(window.location.origin + '/locales/en.json');
	return [await czRes.json(), await enRes.json()];
};

getLocales().then(data => {
	const [cz, en] = data;
	Object.entries(cz).forEach(([ns, val]) =>
		i18n.addResourceBundle('cz', ns, val),
	);
	Object.entries(en).forEach(([ns, val]) =>
		i18n.addResourceBundle('en', ns, val),
	);
	// rerender whole page after all jsons are loaded to prevent missing translations
	i18n.changeLanguage('en');
});

export default i18n;
