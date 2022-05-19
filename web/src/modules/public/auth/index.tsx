import { useNavigate, useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { NavHrefButton } from 'components/styled/Button';
import { Wrapper } from 'components/styled/Wrapper';
import TitleText from 'components/styled/TitleText';
import { Box, Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import {
	ACCESS_TOKEN_CONTEXT,
	APP_CONTEXT,
	OIDC_CLIENT_ID,
	OIDC_CLIENT_SECRET,
	OIDC_REDIRECT_URI,
	OIDC_URL,
	REFRESH_TOKEN_CONTEXT,
} from 'utils/enumsMap';
import Store from 'utils/Store';

type OidcResponse = {
	access_token: string;
	token_type: string; // 'Bearer'
	expires_in: number;
	scope: string; //phone openid profile email
	refresh_token: string;
	id_token: string;
	error: string;
	error_description: string;
};

export type OidcUserInfo = {
	sub: string; //"kaluzak",
	groupIds: string[];
	iss: string;
	name: string; //"Ondrej Kaluzak",
	given_name: string; //"Ondrej",
	email: string;
	id: string;
};

export const sendTokenRequest = async (code: string) => {
	const body = {
		grant_type: 'authorization_code',
		redirect_uri: OIDC_REDIRECT_URI,
		client_id: OIDC_CLIENT_ID,
		client_secret: OIDC_CLIENT_SECRET,
		code: code,
	};
	const res = await fetch(`${OIDC_URL}/endpoint/op/token`, {
		method: 'POST',
		body: new URLSearchParams({ ...body }),
	});

	const json = (await res.json()) as OidcResponse;

	if (json?.error) {
		alert('Nastala chyba pri autorizacii: ' + json.error);
		return;
	}
	Store.set(ACCESS_TOKEN_CONTEXT, json?.access_token);
	Store.set(REFRESH_TOKEN_CONTEXT, json?.refresh_token);
	window.location.replace(APP_CONTEXT);
};

export const OIDCLoginButton = () => {
	const expose = 'openid profile scope1 email phone address';
	return (
		<NavHrefButton
			variant="primary"
			href={`${OIDC_URL}/endpoint/op/authorize?scope=${expose}&response_type=code&client_id=${OIDC_CLIENT_ID}&redirect_uri=${OIDC_REDIRECT_URI}`}
		>
			Prihlásiť sa
		</NavHrefButton>
	);
};

const GetAccesToken = () => {
	const { search } = useLocation();
	const nav = useNavigate();

	const { code } = parse(search);
	useEffect(() => {
		if (code && !Array.isArray(code) && code !== '') {
			sendTokenRequest(code);
		}
		if (!code || code === '') {
			toast.error('Nepodarilo sa prihlásiť', { duration: 8000 });
			nav('/');
		}
	}, [code, nav]);

	return (
		<Wrapper justifyContent="center">
			<Flex justifyContent="center" alignItems="center">
				<Box>
					<TitleText mb={0} pb={0} mt="-150px" fontSize="xl">
						Prebieha prihlasovanie...
					</TitleText>
					<Loader />
				</Box>
			</Flex>
		</Wrapper>
	);
};

export default GetAccesToken;
