import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { css } from '@emotion/core';
import isPropValid from '@emotion/is-prop-valid';
import { ColorProps } from 'styled-system';

import { Box, BoxProps } from 'components/styled';

import { styled, Theme } from 'theme';

export type LinkProps = {
	underlineDefault?: boolean;
} & BoxProps;

const LinkCss = (p: { theme: Theme } & LinkProps & ColorProps) => css`
	${!p.color &&
	css`
		color: ${p.theme.colors.text};
	`}

	${p.underlineDefault &&
	css`
		text-decoration: underline ${p.theme.colors.primary};
	`}

	${!p.underlineDefault &&
	css`
		text-decoration: none;

		&:hover,
		&:focus {
			text-decoration: underline ${p.theme.colors.primary};
		}
	`}
`;

// https://github.com/emotion-js/emotion/issues/183#issuecomment-432609510
const Link = styled(Box, { shouldForwardProp: isPropValid })<LinkProps>`
	${LinkCss}
`.withComponent(RouterLink);

export const HrefLink = styled(Box)<LinkProps>`
	${LinkCss}
`.withComponent('a');

export const activeClassName = 'active-route';

export const NavLink = styled(Link)`
	&.${activeClassName} {
		font-weight: bold;
	}
`.withComponent(RouterNavLink);

NavLink.defaultProps = {
	activeClassName,
};

export default Link;
