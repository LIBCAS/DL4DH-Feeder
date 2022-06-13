import { css } from '@emotion/core';

import { Box, BoxProps } from 'components/styled';

import { theme } from 'theme';

import { OffscreenCSS } from 'theme/GlobalStyles';
import styled from 'theme/styled';

type Props = {
	ellipsis?: boolean;
};

const Text = styled(Box)<BoxProps & Props>`
	${p =>
		p.ellipsis &&
		css`
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		`}
`.withComponent('p');

export const OffscreenText = styled(Text)`
	${OffscreenCSS}
`.withComponent('span');

export default Text;

export const H1 = styled(Text)`
	color: ${theme.colors.primary};
	font-size: ${theme.fontSizes.xxl}px;
	font-family: 'RobotoCondensed-bold';
`;

export const H2 = styled(Text)`
	color: ${theme.colors.primary};
	font-size: ${theme.fontSizes.lg}px;
	font-family: 'RobotoCondensed-Regular';
`;

export const H3 = styled(Text)`
	${p => css`
		color: ${p.color ?? theme.colors.primary};
		font-size: ${theme.fontSizes.lg}px;
		font-family: 'RobotoCondensed-Regular';
	`}
`;

export const H4 = styled(Text)`
	color: ${theme.colors.textH4};
	font-size: ${theme.fontSizes.lg}px;
	font-family: 'RobotoCondensed-Bold';
`;

export const H5 = styled(Text)`
	color: ${theme.colors.textH4};
	font-size: ${theme.fontSizes.md}px;
	font-family: 'RobotoCondensed-Regular';
`;
