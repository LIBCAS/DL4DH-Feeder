import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url:
		window.origin === 'http://localhost:3000'
			? 'http://feeder.dev.inqool.cz/'
			: window.origin,
	realm: 'DL4DHFeeder',
	clientId: 'feeder',
});

export default keycloak;
