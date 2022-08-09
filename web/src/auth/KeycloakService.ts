import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url: window.origin,
	realm: 'DL4DHFeeder',
	clientId: 'feeder',
});

export default keycloak;
