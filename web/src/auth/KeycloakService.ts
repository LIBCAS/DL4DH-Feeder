import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url: 'http://feeder.dev.inqool.cz',
	realm: 'DL4DHFeeder',
	clientId: 'feeder',
});

export default keycloak;
