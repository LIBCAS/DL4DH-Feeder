import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url:
		// eslint-disable-next-line no-nested-ternary
		window.origin === 'http://localhost:3000'
			? //? 'http://feeder.dev.inqool.cz'
			  'https://keycloak.sekan.eu/'
			: process.env.REACT_APP_KEYCLOAK_URL
			? process.env.REACT_APP_KEYCLOAK_URL
			: window.origin,
	realm: 'DL4DHFeeder',
	clientId: 'feeder',
});

export default keycloak;
