import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url:
		window.origin === 'http://localhost:3000' ? 'https://keycloak.sekan.eu/'
			: (process.env.KEYCLOAK_URL ? process.env.KEYCLOAK_URL : window.origin),
	realm: 'DL4DHFeeder',
	clientId: 'feeder',
});

export default keycloak;
