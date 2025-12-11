import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
	url: process.env.REACT_APP_KEYCLOAK_URL
		? process.env.REACT_APP_KEYCLOAK_URL
		: window.origin,
	realm: process.env.REACT_APP_KEYCLOAK_REALM
		? process.env.REACT_APP_KEYCLOAK_REALM
		: 'DL4DHFeeder',
	clientId: process.env.REACT_APP_KEYCLOAK_CLIENTID
		? process.env.REACT_APP_KEYCLOAK_CLIENTID
		: 'feeder',
});

export default keycloak;
